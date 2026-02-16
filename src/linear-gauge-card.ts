import { LitElement, html, css, PropertyValues, nothing, CSSResultGroup } from 'lit';
import { state } from 'lit/decorators.js';
import { actionHandler } from './action-handler';
import {
  HomeAssistant,
  HassEntity,
  LinearGaugeCardConfig,
  HistoryData,
  ActionConfig,
  WarningConfig,
} from './types';
import {
  CARD_VERSION,
  CARD_TAG,
  EDITOR_TAG,
  DEFAULT_CONFIG,
  DEFAULT_DIAL,
  DEFAULT_DISPLAY,
  DEFAULT_HISTORY,
} from './const';
import {
  computeLayout,
  GaugeLayout,
  renderTrack,
  renderSegments,
  renderWarnings,
  renderMajorTicks,
  renderMinorTicks,
  renderDial,
  renderHistory,
} from './gauge-renderer';
import { fetchHistory, HistoryCache } from './history';

// Log version
console.info(
  `%c LINEAR-GAUGE-CARD %c v${CARD_VERSION} `,
  'color: white; background: #555; font-weight: bold; padding: 2px 6px; border-radius: 4px 0 0 4px;',
  'color: white; background: #1976D2; font-weight: bold; padding: 2px 6px; border-radius: 0 4px 4px 0;',
);

// Register card for the picker
(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: CARD_TAG,
  name: 'Linear Gauge Card',
  description: 'A customizable linear gauge with segments, ticks, dial, and history markers',
  preview: true,
  documentationURL: 'https://github.com/your-user/linear-gauge-ha',
});

export class LinearGaugeCard extends LitElement {
  private static _instanceCounter = 0;

  private _hass?: HomeAssistant;
  @state() private _config!: LinearGaugeCardConfig;
  @state() private _historyData: HistoryData | null = null;

  private _historyFetchTimer?: ReturnType<typeof setTimeout>;
  private _historyCache: { current: HistoryCache | null } = { current: null };
  private _cachedLayout?: GaugeLayout;
  private _instanceId = `lg-${LinearGaugeCard._instanceCounter++}`;
  private _activeWarningIndices: Set<number> = new Set();

  public get hass(): HomeAssistant {
    return this._hass!;
  }

  public set hass(hass: HomeAssistant) {
    const oldHass = this._hass;
    this._hass = hass;

    if (!oldHass || !this._config) {
      this.requestUpdate('hass', oldHass);
      return;
    }

    const entityId = this._config.entity;
    if (oldHass.states[entityId] !== hass.states[entityId]) {
      this.requestUpdate('hass', oldHass);
    }
  }

  // ---- Lovelace Card API ----

  public static async getConfigElement(): Promise<HTMLElement> {
    await import('./editor');
    return document.createElement(EDITOR_TAG);
  }

  public static getStubConfig(hass: HomeAssistant): Partial<LinearGaugeCardConfig> {
    // Find a numeric sensor entity to use as default
    const entities = Object.keys(hass.states).filter((eid) => {
      if (!eid.startsWith('sensor.')) return false;
      const val = parseFloat(hass.states[eid].state);
      return !isNaN(val) && isFinite(val);
    });
    return {
      entity: entities[0] ?? 'sensor.temperature',
      min: 0,
      max: 100,
    };
  }

  public setConfig(config: LinearGaugeCardConfig): void {
    if (!config.entity) {
      throw new Error('Please define an entity');
    }
    const oldEntity = this._config?.entity;
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      dial: { ...DEFAULT_DIAL, ...config.dial },
      display: { ...DEFAULT_DISPLAY, ...config.display },
      history: { ...DEFAULT_HISTORY, ...config.history },
    } as LinearGaugeCardConfig;
    this._cachedLayout = computeLayout(this._config);

    if (oldEntity && oldEntity !== this._config.entity) {
      this._historyData = null;
      this._historyCache.current = null;
      this._activeWarningIndices = new Set();
    }
  }

  public getCardSize(): number {
    if (this._config?.orientation === 'vertical') {
      return 6;
    }
    return this._estimateHorizontalRows();
  }

  public getGridOptions(): { rows: number; columns: number; min_rows: number; min_columns: number } {
    if (!this._config) {
      return { rows: 2, columns: 6, min_rows: 1, min_columns: 3 };
    }
    if (this._config.orientation === 'vertical') {
      return { rows: 6, columns: 3, min_rows: 3, min_columns: 3 };
    }
    const rows = this._estimateHorizontalRows();
    return { rows, columns: 6, min_rows: 1, min_columns: 3 };
  }

  private _estimateHorizontalRows(): number {
    if (!this._config) return 2;
    if (this._config.height) {
      return Math.max(1, Math.ceil(this._config.height / 50));
    }

    const condensed = this._config.condensed === true;
    if (condensed) {
      return 1;
    }

    const dial = { ...DEFAULT_DIAL, ...this._config.dial };
    const showName = this._config.show_name !== false;
    const valuePosition = dial.valuePosition ?? 'right';
    const isBoxInline = valuePosition === 'box-start' || valuePosition === 'box-end';
    const showHeaderValue = dial.showValue && valuePosition !== 'inside' && !isBoxInline;
    const headerVisible = (showName && this._config.name !== false) || showHeaderValue;
    const headerHeight = headerVisible ? 28 : 0;
    const contentPadding = 24;
    const layout = this._cachedLayout ?? computeLayout(this._config);
    const estimatedPx = headerHeight + contentPadding + layout.svgHeight;

    return Math.max(1, Math.ceil(estimatedPx / 50));
  }

  // ---- Lifecycle ----

  protected updated(changedProps: PropertyValues): void {
    super.updated(changedProps);

    if (changedProps.has('hass') && this._config) {
      const histCfg = { ...DEFAULT_HISTORY, ...this._config.history };
      if (histCfg.enabled) {
        this._scheduleHistoryFetch();
      }
      this._checkWarningNotifications();
    }
  }

  private _scheduleHistoryFetch(): void {
    if (this._historyFetchTimer) return;
    this._historyFetchTimer = setTimeout(async () => {
      this._historyFetchTimer = undefined;
      if (!this.hass || !this._config) return;
      const histCfg = { ...DEFAULT_HISTORY, ...this._config.history };
      const data = await fetchHistory(this.hass, this._config.entity, histCfg.hours, this._historyCache);
      if (data) {
        this._historyData = data;
      }
    }, 100);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._historyFetchTimer) {
      clearTimeout(this._historyFetchTimer);
    }
  }

  // ---- Warning actions ----

  private _getActiveWarning(value: number): WarningConfig | null {
    const warnings = this._config?.warnings ?? [];
    for (const w of warnings) {
      if (value >= w.from && value <= w.to) return w;
    }
    return null;
  }

  private _getActiveWarningIndices(value: number): Set<number> {
    const result = new Set<number>();
    const warnings = this._config?.warnings ?? [];
    for (let i = 0; i < warnings.length; i++) {
      if (value >= warnings[i].from && value <= warnings[i].to) {
        result.add(i);
      }
    }
    return result;
  }

  private _checkWarningNotifications(): void {
    if (!this.hass || !this._config) return;
    const stateObj = this.hass.states[this._config.entity];
    if (!stateObj) return;
    const value = parseFloat(stateObj.state);
    if (isNaN(value)) return;

    const warnings = this._config.warnings ?? [];
    const currentActive = this._getActiveWarningIndices(value);
    const previousActive = this._activeWarningIndices;

    for (const idx of currentActive) {
      if (!previousActive.has(idx)) {
        const warn = warnings[idx];
        if (warn.notification?.enabled) {
          this._fireWarningNotification(warn, stateObj);
        }
      }
    }

    this._activeWarningIndices = currentActive;
  }

  private _fireWarningNotification(warn: WarningConfig, stateObj: HassEntity): void {
    const friendlyName = stateObj.attributes.friendly_name ?? stateObj.entity_id;
    const label = warn.label ?? `${warn.from}–${warn.to}`;
    const title = warn.notification!.title || friendlyName;
    const message = warn.notification!.message || `Value entered warning range: ${label}`;
    const serviceStr = warn.notification!.service || 'persistent_notification.create';
    const [domain, service] = serviceStr.split('.');

    this.hass.callService(domain, service, { title, message });
  }

  // ---- Rendering ----

  protected render() {
    if (!this._config || !this.hass) return nothing;

    const entityId = this._config.entity;
    const stateObj: HassEntity | undefined = this.hass.states[entityId];

    if (!stateObj) {
      return html`
        <ha-card>
          <div class="warning">Entity not found: ${entityId}</div>
        </ha-card>
      `;
    }

    const showName = this._config.show_name !== false;
    const name =
      showName && this._config.name !== false
        ? this._config.name ?? stateObj.attributes.friendly_name ?? entityId
        : null;
    const unit = this._config.unit ?? (stateObj.attributes.unit_of_measurement as string) ?? '';

    const layout = this._cachedLayout ?? computeLayout(this._config);
    const dial = { ...DEFAULT_DIAL, ...this._config.dial };
    const condensed = this._config.condensed === true;
    const valuePosition = dial.valuePosition ?? 'right';
    const isBoxInline = valuePosition === 'box-start' || valuePosition === 'box-end';
    const showHeaderValue = dial.showValue && valuePosition !== 'inside' && !isBoxInline;
    const showInlineBoxValue = dial.showValue && isBoxInline;
    const headerVisible = name !== null || showHeaderValue;
    const isHeaderValueLeft = showHeaderValue && valuePosition === 'left';
    const headerRowClasses = [
      'header-row',
      isHeaderValueLeft ? 'value-left' : '',
      showHeaderValue && name === null && isHeaderValueLeft ? 'value-only-left' : '',
      showHeaderValue && name === null && !isHeaderValueLeft ? 'value-only-right' : '',
    ]
      .filter(Boolean)
      .join(' ');
    const contentClasses = [
      'card-content',
      this._config.orientation === 'vertical' ? 'vertical' : 'horizontal',
      condensed ? 'condensed' : '',
      name === null ? 'name-hidden' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const stateValue = stateObj.state;
    const isUnavailable = stateValue === 'unavailable' || stateValue === 'unknown';

    if (isUnavailable) {
      const unavailableLabel = stateValue === 'unavailable' ? 'Unavailable' : 'Unknown';
      return html`
        <ha-card
          ${actionHandler({
            hasHold: !!this._config.hold_action,
            hasDoubleClick: !!this._config.double_tap_action,
          })}
          @action="${this._handleAction}"
        >
          <div class="${contentClasses}">
            ${headerVisible
              ? html`
                  <div class="${headerRowClasses}">
                    ${showHeaderValue && isHeaderValueLeft
                      ? html`<div class="value-badge unavailable">${unavailableLabel}</div>`
                      : ''}
                    ${name !== null ? html`<div class="name">${name}</div>` : ''}
                    ${showHeaderValue && !isHeaderValueLeft
                      ? html`<div class="value-badge unavailable">${unavailableLabel}</div>`
                      : ''}
                  </div>
                `
              : ''}
            ${showInlineBoxValue
              ? html`
                  <div class="gauge-inline-row">
                    ${valuePosition === 'box-start'
                      ? html`
                          <div class="value-box unavailable" style="font-size:${dial.valueFontSize}px">
                            ${unavailableLabel}
                          </div>
                        `
                      : ''}
                    <div class="gauge-container">
                      <svg
                        viewBox="0 0 ${layout.svgWidth} ${layout.svgHeight}"
                        preserveAspectRatio="${condensed ? 'none' : 'xMidYMid meet'}"
                        width="100%"
                        height="${condensed ? layout.svgHeight : nothing}"
                        class="gauge-svg unavailable-gauge"
                      >
                        ${renderTrack(layout, this._config.display ?? {})}
                      </svg>
                    </div>
                    ${valuePosition === 'box-end'
                      ? html`
                          <div class="value-box unavailable" style="font-size:${dial.valueFontSize}px">
                            ${unavailableLabel}
                          </div>
                        `
                      : ''}
                  </div>
                `
              : html`
                  <div class="gauge-container">
                    <svg
                      viewBox="0 0 ${layout.svgWidth} ${layout.svgHeight}"
                      preserveAspectRatio="${condensed ? 'none' : 'xMidYMid meet'}"
                      width="100%"
                      height="${condensed ? layout.svgHeight : nothing}"
                      class="gauge-svg unavailable-gauge"
                    >
                      ${renderTrack(layout, this._config.display ?? {})}
                    </svg>
                  </div>
                `}
          </div>
        </ha-card>
      `;
    }

    const value = parseFloat(stateValue);
    const numericValue = isNaN(value) ? null : value;
    const displayValue = numericValue !== null ? this._formatValue(numericValue) : stateValue;
    const displayValueWithUnit = unit ? `${displayValue} ${unit}` : displayValue;
    const id = this._instanceId;

    const activeWarning = numericValue !== null ? this._getActiveWarning(numericValue) : null;
    const cardBgStyle = activeWarning?.cardBackgroundColor
      ? `background-color: ${activeWarning.cardBackgroundColor}`
      : '';
    const nameColorStyle = activeWarning?.headerTextColor
      ? `color: ${activeWarning.headerTextColor}`
      : '';
    const renderDialBeforeTicks =
      numericValue !== null && dial.style === 'bar-fill'
        ? renderDial(numericValue, this._config, layout, id)
        : '';
    const renderDialAfterTicks =
      numericValue !== null && dial.style !== 'bar-fill'
        ? renderDial(numericValue, this._config, layout, id)
        : '';

    return html`
      <ha-card
        style="${cardBgStyle}"
        ${actionHandler({
          hasHold: !!this._config.hold_action,
          hasDoubleClick: !!this._config.double_tap_action,
        })}
        @action="${this._handleAction}"
      >
        <div class="${contentClasses}">
          ${headerVisible
            ? html`
                <div class="${headerRowClasses}">
                  ${showHeaderValue && isHeaderValueLeft
                    ? html`<div class="value-badge" style="font-size:${dial.valueFontSize}px; color:${dial.valueColor}">
                        ${displayValueWithUnit}
                      </div>`
                    : ''}
                  ${name !== null ? html`<div class="name" style="${nameColorStyle}">${name}</div>` : ''}
                  ${showHeaderValue && !isHeaderValueLeft
                    ? html`<div class="value-badge" style="font-size:${dial.valueFontSize}px; color:${dial.valueColor}">
                        ${displayValueWithUnit}
                      </div>`
                    : ''}
                </div>
              `
            : ''}
          ${showInlineBoxValue
            ? html`
                <div class="gauge-inline-row">
                  ${valuePosition === 'box-start'
                    ? html`
                        <div
                          class="value-box"
                          style="font-size:${dial.valueFontSize}px; color:${dial.valueColor}"
                        >
                          ${displayValueWithUnit}
                        </div>
                      `
                    : ''}
                  <div class="gauge-container">
                    <svg
                      viewBox="0 0 ${layout.svgWidth} ${layout.svgHeight}"
                      preserveAspectRatio="${condensed ? 'none' : 'xMidYMid meet'}"
                      width="100%"
                      height="${condensed ? layout.svgHeight : nothing}"
                      class="gauge-svg"
                    >
                      ${renderTrack(layout, this._config.display ?? {})}
                      ${renderSegments(this._config.segments ?? [], layout, this._config.display ?? {}, id)}
                      ${renderWarnings(this._config.warnings ?? [], layout, this._config.display ?? {}, id)}
                      ${renderDialBeforeTicks}
                      ${renderHistory(this._historyData, this._config, layout)}
                      ${renderMajorTicks(this._config, layout)}
                      ${renderMinorTicks(this._config, layout)}
                      ${renderDialAfterTicks}
                    </svg>
                  </div>
                  ${valuePosition === 'box-end'
                    ? html`
                        <div
                          class="value-box"
                          style="font-size:${dial.valueFontSize}px; color:${dial.valueColor}"
                        >
                          ${displayValueWithUnit}
                        </div>
                      `
                    : ''}
                </div>
              `
            : html`
                <div class="gauge-container">
                  <svg
                    viewBox="0 0 ${layout.svgWidth} ${layout.svgHeight}"
                    preserveAspectRatio="${condensed ? 'none' : 'xMidYMid meet'}"
                    width="100%"
                    height="${condensed ? layout.svgHeight : nothing}"
                    class="gauge-svg"
                  >
                    ${renderTrack(layout, this._config.display ?? {})}
                    ${renderSegments(this._config.segments ?? [], layout, this._config.display ?? {}, id)}
                    ${renderWarnings(this._config.warnings ?? [], layout, this._config.display ?? {}, id)}
                    ${renderDialBeforeTicks}
                    ${renderHistory(this._historyData, this._config, layout)}
                    ${renderMajorTicks(this._config, layout)}
                    ${renderMinorTicks(this._config, layout)}
                    ${renderDialAfterTicks}
                  </svg>
                </div>
              `}
        </div>
      </ha-card>
    `;
  }

  private _formatValue(value: number): string {
    // Format to reasonable precision
    if (Number.isInteger(value)) return value.toString();
    if (Math.abs(value) >= 100) return value.toFixed(1);
    if (Math.abs(value) >= 10) return value.toFixed(1);
    return value.toFixed(2);
  }

  private _handleAction(ev: CustomEvent): void {
    const action = ev.detail?.action ?? 'tap';
    let actionConfig: ActionConfig | undefined;

    switch (action) {
      case 'hold':
        actionConfig = this._config.hold_action;
        break;
      case 'double_tap':
        actionConfig = this._config.double_tap_action;
        break;
      case 'tap':
      default:
        actionConfig = this._config.tap_action;
        break;
    }

    if (!actionConfig) {
      this._fireMoreInfo();
      return;
    }

    this._fireAction(actionConfig);
  }

  private _fireMoreInfo(): void {
    const event = new CustomEvent('hass-more-info', {
      composed: true,
      bubbles: true,
      detail: { entityId: this._config.entity },
    });
    this.dispatchEvent(event);
  }

  private _fireAction(actionConfig: ActionConfig): void {
    switch (actionConfig.action) {
      case 'more-info':
        this._fireMoreInfo();
        break;
      case 'navigate':
        if (actionConfig.navigation_path) {
          window.history.pushState(null, '', actionConfig.navigation_path);
          const navEvent = new Event('location-changed', { composed: true, bubbles: true });
          window.dispatchEvent(navEvent);
        }
        break;
      case 'url':
        if (actionConfig.url_path) window.open(actionConfig.url_path);
        break;
      case 'call-service':
        if (actionConfig.service) {
          const [domain, service] = actionConfig.service.split('.');
          this.hass.callService(domain, service, actionConfig.service_data ?? {});
        }
        break;
      case 'none':
        break;
    }
  }

  // ---- Styles ----

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      ha-card {
        cursor: pointer;
        overflow: hidden;
        transition: background-color 0.3s ease;
      }

      .card-content {
        padding: 12px 16px;
      }

      .card-content.condensed {
        padding: 4px 12px;
      }

      .card-content.vertical {
        display: flex;
        flex-direction: row;
        align-items: stretch;
        gap: 12px;
      }

      .card-content.vertical.condensed {
        gap: 8px;
      }

      .card-content.vertical .header-row {
        writing-mode: vertical-lr;
        text-orientation: mixed;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
      }

      .header-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;
        gap: 8px;
      }

      .header-row.value-only-right {
        justify-content: flex-end;
      }

      .header-row.value-only-left {
        justify-content: flex-start;
      }

      .card-content.condensed .header-row {
        margin-bottom: 0;
        gap: 6px;
      }

      .card-content.condensed.name-hidden .header-row {
        margin-bottom: 0;
      }

      .name {
        font-size: 14px;
        font-weight: 500;
        color: var(--primary-text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
        transition: color 0.3s ease;
      }

      .card-content.condensed .name {
        font-size: 13px;
        line-height: 1.1;
      }

      .value-badge {
        font-weight: 600;
        white-space: nowrap;
        padding: 4px 10px;
        border-radius: 12px;
        background: var(--card-background-color, var(--ha-card-background, rgba(127,127,127,0.1)));
        border: 1px solid var(--divider-color, rgba(127,127,127,0.2));
        flex-shrink: 0;
      }

      .card-content.condensed .value-badge {
        padding: 1px 6px;
        border-radius: 10px;
        line-height: 1.1;
      }

      .gauge-inline-row {
        display: flex;
        align-items: center;
        gap: 10px;
        direction: inherit;
        width: 100%;
      }

      .card-content.condensed .gauge-inline-row {
        gap: 6px;
      }

      .value-box {
        font-weight: 500;
        white-space: nowrap;
        padding: 2px 6px;
        border-radius: 4px;
        border: 1px solid var(--divider-color, rgba(127,127,127,0.25));
        background: transparent;
        line-height: 1.2;
        flex-shrink: 0;
      }

      .card-content.condensed .value-box {
        padding: 1px 4px;
      }

      .gauge-container {
        width: 100%;
        line-height: 0;
      }

      .gauge-inline-row .gauge-container {
        width: auto;
        flex: 1;
        min-width: 0;
      }

      .card-content.vertical .gauge-inline-row {
        flex: 1;
        min-width: 0;
      }

      .card-content.vertical .gauge-container {
        flex: 1;
        height: 250px;
      }

      .gauge-svg {
        overflow: visible;
      }

      .gauge-svg .tick-label {
        font-family: var(--ha-card-header-font-family, inherit);
        user-select: none;
      }

      .value-badge.unavailable {
        color: var(--secondary-text-color);
        opacity: 0.7;
        font-style: italic;
      }

      .value-box.unavailable {
        color: var(--secondary-text-color);
        opacity: 0.7;
        font-style: italic;
      }

      .unavailable-gauge {
        opacity: 0.4;
      }

      .warning {
        padding: 16px;
        color: var(--error-color, #db4437);
        font-weight: 500;
      }
    `;
  }
}

// Register the element
customElements.define(CARD_TAG, LinearGaugeCard);

// Re-export editor so it can be lazy-loaded
export { LinearGaugeCardEditor } from './editor';
