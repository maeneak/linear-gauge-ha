import { LitElement, html, css, PropertyValues, nothing, CSSResultGroup } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  HassEntity,
  LinearGaugeCardConfig,
  HistoryData,
  ActionConfig,
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
import { fetchHistory, invalidateHistoryCache } from './history';

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
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: LinearGaugeCardConfig;
  @state() private _historyData: HistoryData | null = null;

  private _historyFetchTimer?: ReturnType<typeof setTimeout>;
  private _lastEntityId?: string;

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
    this._config = {
      ...DEFAULT_CONFIG,
      ...config,
      dial: { ...DEFAULT_DIAL, ...config.dial },
      display: { ...DEFAULT_DISPLAY, ...config.display },
      history: { ...DEFAULT_HISTORY, ...config.history },
    } as LinearGaugeCardConfig;
  }

  public getCardSize(): number {
    if (this._config?.orientation === 'vertical') {
      return 6;
    }
    return this._estimateHorizontalRows();
  }

  public getGridOptions(): { rows: number; columns: number; min_rows: number; min_columns: number } {
    if (this._config?.orientation === 'vertical') {
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
    const headerVisible =
      (showName && this._config.name !== false) || (dial.showValue && dial.valuePosition !== 'inside');
    const headerHeight = headerVisible ? 28 : 0;
    const contentPadding = 24;
    const layout = computeLayout(this._config);
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
    }
  }

  private _scheduleHistoryFetch(): void {
    if (this._historyFetchTimer) return;
    this._historyFetchTimer = setTimeout(async () => {
      this._historyFetchTimer = undefined;
      if (!this.hass || !this._config) return;
      const histCfg = { ...DEFAULT_HISTORY, ...this._config.history };
      const data = await fetchHistory(this.hass, this._config.entity, histCfg.hours);
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

    const value = parseFloat(stateObj.state);
    const numericValue = isNaN(value) ? null : value;

    const showName = this._config.show_name !== false;
    const name =
      showName && this._config.name !== false
        ? this._config.name ?? stateObj.attributes.friendly_name ?? entityId
        : null;
    const unit = this._config.unit ?? (stateObj.attributes.unit_of_measurement as string) ?? '';

    const layout = computeLayout(this._config);
    const dial = { ...DEFAULT_DIAL, ...this._config.dial };
    const condensed = this._config.condensed === true;
    const headerVisible = name !== null || (dial.showValue && dial.valuePosition !== 'inside');
    const contentClasses = [
      'card-content',
      this._config.orientation === 'vertical' ? 'vertical' : 'horizontal',
      condensed ? 'condensed' : '',
      name === null ? 'name-hidden' : '',
    ]
      .filter(Boolean)
      .join(' ');

    const displayValue = numericValue !== null ? this._formatValue(numericValue) : stateObj.state;
    const renderDialBeforeTicks =
      numericValue !== null && dial.style === 'bar-fill'
        ? renderDial(numericValue, this._config, layout)
        : '';
    const renderDialAfterTicks =
      numericValue !== null && dial.style !== 'bar-fill'
        ? renderDial(numericValue, this._config, layout)
        : '';

    return html`
      <ha-card @click="${this._handleAction}" @ha-click="${this._handleAction}">
        <div class="${contentClasses}">
          ${headerVisible
            ? html`
                <div class="header-row">
                  ${name !== null ? html`<div class="name">${name}</div>` : ''}
                  ${dial.showValue && dial.valuePosition !== 'inside'
                    ? html`<div class="value-badge" style="font-size:${dial.valueFontSize}px; color:${dial.valueColor}">
                        ${displayValue} ${unit}
                      </div>`
                    : ''}
                </div>
              `
            : ''}
          <div class="gauge-container">
            <svg
              viewBox="0 0 ${layout.svgWidth} ${layout.svgHeight}"
              preserveAspectRatio="${this._config.orientation === 'vertical' ? 'xMidYMid meet' : 'xMidYMid meet'}"
              width="100%"
              class="gauge-svg"
            >
              ${renderTrack(layout, this._config.display ?? {})}
              ${renderSegments(this._config.segments ?? [], layout, this._config.display ?? {})}
              ${renderWarnings(this._config.warnings ?? [], layout, this._config.display ?? {})}
              ${renderDialBeforeTicks}
              ${renderHistory(this._historyData, this._config, layout)}
              ${renderMajorTicks(this._config, layout)}
              ${renderMinorTicks(this._config, layout)}
              ${renderDialAfterTicks}
            </svg>
          </div>
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

  private _handleAction(): void {
    if (this._config.tap_action) {
      this._fireAction(this._config.tap_action);
    } else {
      // Default: open more-info dialog
      const event = new CustomEvent('hass-more-info', {
        composed: true,
        bubbles: true,
        detail: { entityId: this._config.entity },
      });
      this.dispatchEvent(event);
    }
  }

  private _fireAction(actionConfig: ActionConfig): void {
    switch (actionConfig.action) {
      case 'more-info': {
        const event = new CustomEvent('hass-more-info', {
          composed: true,
          bubbles: true,
          detail: { entityId: this._config.entity },
        });
        this.dispatchEvent(event);
        break;
      }
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
          this.hass.callApi('POST', `services/${domain}/${service}`, actionConfig.service_data ?? {});
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
        padding: 2px 8px;
        border-radius: 10px;
        line-height: 1.1;
      }

      .gauge-container {
        width: 100%;
        line-height: 0;
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
