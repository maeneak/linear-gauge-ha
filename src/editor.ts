import { LitElement, html, css, nothing, CSSResultGroup, PropertyValues } from 'lit';
import { property, state } from 'lit/decorators.js';
import {
  HomeAssistant,
  LinearGaugeCardConfig,
  SegmentConfig,
  WarningConfig,
  DialConfig,
  TicksConfig,
  HistoryConfig,
  DisplayConfig,
} from './types';
import {
  EDITOR_TAG,
  DEFAULT_DIAL,
  DEFAULT_DISPLAY,
  DEFAULT_HISTORY,
  DEFAULT_MAJOR_TICK,
  DEFAULT_MINOR_TICK,
  PRESET_COLORS,
} from './const';

const DIAL_STYLES = [
  { value: 'bar-fill', label: 'Bar Fill' },
  { value: 'needle', label: 'Needle' },
  { value: 'line', label: 'Line' },
  { value: 'triangle', label: 'Triangle' },
  { value: 'dot', label: 'Dot' },
];

const VALUE_POSITIONS = [
  { value: 'above', label: 'Above' },
  { value: 'below', label: 'Below' },
  { value: 'right', label: 'Right' },
  { value: 'left', label: 'Left' },
  { value: 'inside', label: 'Inside' },
];

const WARNING_STYLES = [
  { value: 'fill', label: 'Fill' },
  { value: 'hatch', label: 'Hatch' },
  { value: 'border', label: 'Border' },
];

const HISTORY_MODES = [
  { value: 'minmax', label: 'Min/Max Markers' },
  { value: 'dots', label: 'History Dots' },
  { value: 'both', label: 'Both' },
];

const SEGMENT_FILL_MODES = [
  { value: 'solid', label: 'Solid' },
  { value: 'gradient', label: 'Gradient Blend' },
];

const ENTITY_DOMAINS = ['sensor', 'input_number', 'number', 'counter'];
const ENTITY_INPUT_WAIT_TIMEOUT_MS = 1500;

type SectionKey =
  | 'general'
  | 'segments'
  | 'ticks'
  | 'dial'
  | 'warnings'
  | 'history'
  | 'appearance';

type EntityInputMode = 'selector' | 'entity-picker' | 'textfield';

export class LinearGaugeCardEditor extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;
  @state() private _config!: LinearGaugeCardConfig;
  @state() private _expandedSections: Set<SectionKey> = new Set(['general']);
  @state() private _entityInputMode: EntityInputMode = 'textfield';

  public connectedCallback(): void {
    super.connectedCallback();
    void this._detectEntityInputMode();
  }

  private async _detectEntityInputMode(): Promise<void> {
    const alreadyAvailableMode = this._resolveEntityInputMode();
    if (alreadyAvailableMode !== 'textfield') {
      this._entityInputMode = alreadyAvailableMode;
      return;
    }

    // Try to trigger HA editor component loading.
    try {
      const helpers = await (window as any).loadCardHelpers?.();
      if (helpers) {
        const entitiesCard = await helpers.createCardElement({
          type: 'entities',
          entities: ['sun.sun'],
        });
        if (entitiesCard) {
          entitiesCard.hass = this.hass;
        }
      }
    } catch (_) {
      // Ignore errors
    }

    await Promise.race([
      this._waitForEntityInputDefinition(),
      new Promise<void>((resolve) => {
        setTimeout(resolve, ENTITY_INPUT_WAIT_TIMEOUT_MS);
      }),
    ]);

    this._entityInputMode = this._resolveEntityInputMode();
  }

  private _resolveEntityInputMode(): EntityInputMode {
    if (customElements.get('ha-selector')) return 'selector';
    if (customElements.get('ha-entity-picker')) return 'entity-picker';
    return 'textfield';
  }

  private _waitForEntityInputDefinition(): Promise<void> {
    return new Promise((resolve) => {
      let settled = false;
      const finish = () => {
        if (settled) return;
        settled = true;
        resolve();
      };

      customElements.whenDefined('ha-selector').then(finish);
      customElements.whenDefined('ha-entity-picker').then(finish);
    });
  }

  public setConfig(config: LinearGaugeCardConfig): void {
    this._config = { ...config };
  }

  // ---- Helpers ----

  private _dispatchConfigChanged(): void {
    const event = new CustomEvent('config-changed', {
      detail: { config: { ...this._config } },
      bubbles: true,
      composed: true,
    });
    this.dispatchEvent(event);
  }

  private _updateConfig(key: string, value: unknown): void {
    (this._config as any)[key] = value;
    this._config = { ...this._config };
    this._dispatchConfigChanged();
  }

  private _updateNestedConfig(section: string, key: string, value: unknown): void {
    const current = (this._config as any)[section] ?? {};
    (this._config as any)[section] = { ...current, [key]: value };
    this._config = { ...this._config };
    this._dispatchConfigChanged();
  }

  private _updateDeepConfig(section: string, subsection: string, key: string, value: unknown): void {
    const currentSection = (this._config as any)[section] ?? {};
    const currentSub = currentSection[subsection] ?? {};
    (this._config as any)[section] = {
      ...currentSection,
      [subsection]: { ...currentSub, [key]: value },
    };
    this._config = { ...this._config };
    this._dispatchConfigChanged();
  }

  private _toggleSection(section: SectionKey): void {
    const newSet = new Set(this._expandedSections);
    if (newSet.has(section)) {
      newSet.delete(section);
    } else {
      newSet.add(section);
    }
    this._expandedSections = newSet;
  }

  // ---- Main render ----

  protected render() {
    if (!this._config || !this.hass) return nothing;

    return html`
      <div class="editor">
        ${this._renderSection('general', 'General', this._renderGeneral())}
        ${this._renderSection('segments', 'Colored Segments', this._renderSegments())}
        ${this._renderSection('ticks', 'Ticks & Labels', this._renderTicks())}
        ${this._renderSection('dial', 'Dial / Indicator', this._renderDial())}
        ${this._renderSection('warnings', 'Warning Ranges', this._renderWarnings())}
        ${this._renderSection('history', 'History Markers', this._renderHistorySection())}
        ${this._renderSection('appearance', 'Appearance', this._renderAppearance())}
      </div>
    `;
  }

  private _renderSection(key: SectionKey, title: string, content: unknown) {
    const expanded = this._expandedSections.has(key);
    return html`
      <div class="section">
        <div class="section-header" @click="${() => this._toggleSection(key)}">
          <ha-icon icon="${expanded ? 'mdi:chevron-down' : 'mdi:chevron-right'}"></ha-icon>
          <span>${title}</span>
        </div>
        ${expanded ? html`<div class="section-content">${content}</div>` : ''}
      </div>
    `;
  }

  // ---- General section ----

  private _renderGeneral() {
    const showName = this._config.show_name !== false;
    const condensed = this._config.condensed === true;
    const entityPicker =
      this._entityInputMode === 'selector'
        ? html`
            <ha-selector
              .hass="${this.hass}"
              .label="${'Entity'}"
              .selector="${{ entity: { domain: ENTITY_DOMAINS } }}"
              .value="${this._config.entity ?? ''}"
              .required="${true}"
              @value-changed="${(e: CustomEvent) => this._updateConfig('entity', e.detail.value)}"
            ></ha-selector>
          `
        : this._entityInputMode === 'entity-picker'
          ? html`
              <ha-entity-picker
                .hass="${this.hass}"
                .value="${this._config.entity ?? ''}"
                .label="${'Entity'}"
                .includeDomains="${ENTITY_DOMAINS}"
                .required="${true}"
                @value-changed="${(e: CustomEvent) => this._updateConfig('entity', e.detail.value)}"
                allow-custom-entity
              ></ha-entity-picker>
            `
          : html`
              <ha-textfield
                .label="${'Entity'}"
                .value="${this._config.entity ?? ''}"
                @input="${(e: Event) =>
                  this._updateConfig('entity', (e.target as HTMLInputElement).value)}"
              ></ha-textfield>
            `;

    return html`
      <div class="field">
        ${entityPicker}
      </div>

      <div class="field">
        <ha-textfield
          .label="${'Name (leave blank for entity name)'}"
          .value="${this._config.name === false ? '' : this._config.name ?? ''}"
          .disabled="${!showName}"
          @input="${(e: Event) => {
            const val = (e.target as HTMLInputElement).value;
            this._updateConfig('name', val === '' ? undefined : val);
          }}"
        ></ha-textfield>
      </div>

      <div class="row">
        <div class="field half">
          <ha-formfield .label="${'Show Name'}">
            <ha-switch
              .checked="${showName}"
              @change="${(e: Event) =>
                this._updateConfig('show_name', (e.target as HTMLInputElement).checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <div class="field half">
          <ha-formfield .label="${'Condensed Mode'}">
            <ha-switch
              .checked="${condensed}"
              @change="${(e: Event) =>
                this._updateConfig('condensed', (e.target as HTMLInputElement).checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>

      <div class="row">
        <div class="field half">
          <ha-textfield
            .label="${'Min'}"
            .value="${String(this._config.min ?? 0)}"
            type="number"
            @input="${(e: Event) =>
              this._updateConfig('min', parseFloat((e.target as HTMLInputElement).value) || 0)}"
          ></ha-textfield>
        </div>
        <div class="field half">
          <ha-textfield
            .label="${'Max'}"
            .value="${String(this._config.max ?? 100)}"
            type="number"
            @input="${(e: Event) =>
              this._updateConfig('max', parseFloat((e.target as HTMLInputElement).value) || 100)}"
          ></ha-textfield>
        </div>
      </div>

      <div class="row">
        <div class="field half">
          <ha-textfield
            .label="${'Unit (override)'}"
            .value="${this._config.unit ?? ''}"
            @input="${(e: Event) => {
              const val = (e.target as HTMLInputElement).value;
              this._updateConfig('unit', val || undefined);
            }}"
          ></ha-textfield>
        </div>
        <div class="field half">
          <label class="toggle-label">
            Orientation
            <ha-select
              .value="${this._config.orientation ?? 'horizontal'}"
              @selected="${(e: CustomEvent) =>
                this._updateConfig('orientation', (e.target as any).value)}"
              @closed="${(e: Event) => e.stopPropagation()}"
            >
              <mwc-list-item value="horizontal">Horizontal</mwc-list-item>
              <mwc-list-item value="vertical">Vertical</mwc-list-item>
            </ha-select>
          </label>
        </div>
      </div>
    `;
  }

  // ---- Segments section ----

  private _renderSegments() {
    const segments = this._config.segments ?? [];
    const segmentFill = this._config.display?.segmentFill ?? 'solid';

    return html`
      <div class="field">
        <ha-select
          .label="${'Segment Fill'}"
          .value="${segmentFill}"
          @selected="${(e: CustomEvent) =>
            this._updateNestedConfig('display', 'segmentFill', (e.target as any).value)}"
          @closed="${(e: Event) => e.stopPropagation()}"
        >
          ${SEGMENT_FILL_MODES.map(
            (mode) => html`<mwc-list-item value="${mode.value}">${mode.label}</mwc-list-item>`,
          )}
        </ha-select>
      </div>

      <div class="list-section">
        ${segments.map(
          (seg, idx) => html`
            <div class="list-item">
              <div class="list-item-header">
                <span class="color-swatch" style="background:${seg.color}"></span>
                <span class="list-item-title">Segment ${idx + 1}</span>
                <ha-icon-button
                  .path="${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}"
                  @click="${() => this._removeSegment(idx)}"
                ></ha-icon-button>
              </div>
              <div class="row">
                <ha-textfield
                  class="third"
                  .label="${'From'}"
                  .value="${String(seg.from)}"
                  type="number"
                  @input="${(e: Event) =>
                    this._updateSegmentField(idx, 'from', parseFloat((e.target as HTMLInputElement).value))}"
                ></ha-textfield>
                <ha-textfield
                  class="third"
                  .label="${'To'}"
                  .value="${String(seg.to)}"
                  type="number"
                  @input="${(e: Event) =>
                    this._updateSegmentField(idx, 'to', parseFloat((e.target as HTMLInputElement).value))}"
                ></ha-textfield>
                <div class="third color-field">
                  <label>Color</label>
                  <input
                    type="color"
                    .value="${seg.color}"
                    @input="${(e: Event) =>
                      this._updateSegmentField(idx, 'color', (e.target as HTMLInputElement).value)}"
                  />
                </div>
              </div>
            </div>
          `,
        )}
        <ha-button @click="${this._addSegment}">
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add Segment
        </ha-button>
      </div>
    `;
  }

  private _addSegment(): void {
    const segments = [...(this._config.segments ?? [])];
    const lastTo = segments.length > 0 ? segments[segments.length - 1].to : (this._config.min ?? 0);
    const max = this._config.max ?? 100;
    const range = max - lastTo;
    const newTo = Math.min(max, lastTo + range / 2);
    const colorIdx = segments.length % PRESET_COLORS.length;
    segments.push({ from: lastTo, to: newTo, color: PRESET_COLORS[colorIdx] });
    this._updateConfig('segments', segments);
  }

  private _removeSegment(idx: number): void {
    const segments = [...(this._config.segments ?? [])];
    segments.splice(idx, 1);
    this._updateConfig('segments', segments);
  }

  private _updateSegmentField(idx: number, field: keyof SegmentConfig, value: unknown): void {
    const segments = [...(this._config.segments ?? [])];
    segments[idx] = { ...segments[idx], [field]: value };
    this._updateConfig('segments', segments);
  }

  // ---- Ticks & Labels section ----

  private _renderTicks() {
    const major = { ...DEFAULT_MAJOR_TICK, ...this._config.ticks?.major };
    const minor = { ...DEFAULT_MINOR_TICK, ...this._config.ticks?.minor };

    return html`
      <h4>Major Ticks</h4>
      <div class="row">
        <ha-textfield
          class="third"
          .label="${'Interval'}"
          .value="${String(major.interval)}"
          type="number"
          @input="${(e: Event) =>
            this._updateDeepConfig('ticks', 'major', 'interval', parseFloat((e.target as HTMLInputElement).value) || 10)}"
        ></ha-textfield>
        <ha-textfield
          class="third"
          .label="${'Size (px)'}"
          .value="${String(major.size)}"
          type="number"
          @input="${(e: Event) =>
            this._updateDeepConfig('ticks', 'major', 'size', parseFloat((e.target as HTMLInputElement).value) || 12)}"
        ></ha-textfield>
        <ha-textfield
          class="third"
          .label="${'Width (px)'}"
          .value="${String(major.width)}"
          type="number"
          @input="${(e: Event) =>
            this._updateDeepConfig('ticks', 'major', 'width', parseFloat((e.target as HTMLInputElement).value) || 2)}"
        ></ha-textfield>
      </div>
      <div class="row">
        <div class="field half">
          <ha-formfield .label="${'Show Labels'}">
            <ha-switch
              .checked="${major.labels}"
              @change="${(e: Event) =>
                this._updateDeepConfig('ticks', 'major', 'labels', (e.target as any).checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <ha-textfield
          class="half"
          .label="${'Label Font Size'}"
          .value="${String(major.labelFontSize)}"
          type="number"
          @input="${(e: Event) =>
            this._updateDeepConfig('ticks', 'major', 'labelFontSize', parseFloat((e.target as HTMLInputElement).value) || 11)}"
        ></ha-textfield>
      </div>
      <div class="row">
        <ha-textfield
          class="half"
          .label="${'Label Suffix'}"
          .value="${major.labelSuffix ?? ''}"
          @input="${(e: Event) =>
            this._updateDeepConfig('ticks', 'major', 'labelSuffix', (e.target as HTMLInputElement).value)}"
        ></ha-textfield>
        <div class="half color-field">
          <label>Tick Color</label>
          <input
            type="color"
            .value="${major.color?.startsWith('var(') ? '#666666' : major.color ?? '#666666'}"
            @input="${(e: Event) =>
              this._updateDeepConfig('ticks', 'major', 'color', (e.target as HTMLInputElement).value)}"
          />
        </div>
      </div>

      <h4>Minor Ticks</h4>
      <div class="row">
        <ha-textfield
          class="third"
          .label="${'Count (between majors)'}"
          .value="${String(minor.count)}"
          type="number"
          @input="${(e: Event) =>
            this._updateDeepConfig('ticks', 'minor', 'count', parseInt((e.target as HTMLInputElement).value) || 0)}"
        ></ha-textfield>
        <ha-textfield
          class="third"
          .label="${'Size (px)'}"
          .value="${String(minor.size)}"
          type="number"
          @input="${(e: Event) =>
            this._updateDeepConfig('ticks', 'minor', 'size', parseFloat((e.target as HTMLInputElement).value) || 6)}"
        ></ha-textfield>
        <div class="third color-field">
          <label>Color</label>
          <input
            type="color"
            .value="${minor.color?.startsWith('var(') ? '#999999' : minor.color ?? '#999999'}"
            @input="${(e: Event) =>
              this._updateDeepConfig('ticks', 'minor', 'color', (e.target as HTMLInputElement).value)}"
          />
        </div>
      </div>
    `;
  }

  // ---- Dial / Indicator section ----

  private _renderDial() {
    const dial = { ...DEFAULT_DIAL, ...this._config.dial };

    return html`
      <div class="field">
        <ha-select
          .label="${'Dial Style'}"
          .value="${dial.style}"
          @selected="${(e: CustomEvent) =>
            this._updateNestedConfig('dial', 'style', (e.target as any).value)}"
          @closed="${(e: Event) => e.stopPropagation()}"
        >
          ${DIAL_STYLES.map(
            (s) => html`<mwc-list-item value="${s.value}">${s.label}</mwc-list-item>`,
          )}
        </ha-select>
      </div>

      <div class="row">
        <div class="half color-field">
          <label>Dial Color (or pick 'segment' to inherit)</label>
          <div class="color-row">
            <input
              type="color"
              .value="${dial.color?.startsWith('var(') || dial.color === 'segment' ? '#1976D2' : dial.color ?? '#1976D2'}"
              @input="${(e: Event) =>
                this._updateNestedConfig('dial', 'color', (e.target as HTMLInputElement).value)}"
            />
            <ha-button
              class="${dial.color === 'segment' ? 'active' : ''}"
              @click="${() => this._updateNestedConfig('dial', 'color', 'segment')}"
            >
              Segment
            </ha-button>
          </div>
        </div>
        <ha-textfield
          class="half"
          .label="${'Size / Thickness'}"
          .value="${String(dial.size)}"
          type="number"
          @input="${(e: Event) =>
            this._updateNestedConfig('dial', 'size', parseFloat((e.target as HTMLInputElement).value) || 4)}"
        ></ha-textfield>
      </div>

      <h4>Value Display</h4>
      <div class="row">
        <div class="field half">
          <ha-formfield .label="${'Show Value'}">
            <ha-switch
              .checked="${dial.showValue}"
              @change="${(e: Event) =>
                this._updateNestedConfig('dial', 'showValue', (e.target as any).checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <ha-select
          class="half"
          .label="${'Value Position'}"
          .value="${dial.valuePosition}"
          @selected="${(e: CustomEvent) =>
            this._updateNestedConfig('dial', 'valuePosition', (e.target as any).value)}"
          @closed="${(e: Event) => e.stopPropagation()}"
        >
          ${VALUE_POSITIONS.map(
            (p) => html`<mwc-list-item value="${p.value}">${p.label}</mwc-list-item>`,
          )}
        </ha-select>
      </div>

      <div class="row">
        <ha-textfield
          class="half"
          .label="${'Value Font Size'}"
          .value="${String(dial.valueFontSize)}"
          type="number"
          @input="${(e: Event) =>
            this._updateNestedConfig('dial', 'valueFontSize', parseFloat((e.target as HTMLInputElement).value) || 14)}"
        ></ha-textfield>
        <div class="half color-field">
          <label>Value Color</label>
          <input
            type="color"
            .value="${dial.valueColor?.startsWith('var(') ? '#333333' : dial.valueColor ?? '#333333'}"
            @input="${(e: Event) =>
              this._updateNestedConfig('dial', 'valueColor', (e.target as HTMLInputElement).value)}"
          />
        </div>
      </div>
    `;
  }

  // ---- Warning Ranges section ----

  private _renderWarnings() {
    const warnings = this._config.warnings ?? [];

    return html`
      <div class="list-section">
        ${warnings.map(
          (warn, idx) => html`
            <div class="list-item">
              <div class="list-item-header">
                <span class="color-swatch" style="background:${warn.color}"></span>
                <span class="list-item-title">Warning ${idx + 1}</span>
                <ha-icon-button
                  .path="${'M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z'}"
                  @click="${() => this._removeWarning(idx)}"
                ></ha-icon-button>
              </div>
              <div class="row">
                <ha-textfield
                  class="quarter"
                  .label="${'From'}"
                  .value="${String(warn.from)}"
                  type="number"
                  @input="${(e: Event) =>
                    this._updateWarningField(idx, 'from', parseFloat((e.target as HTMLInputElement).value))}"
                ></ha-textfield>
                <ha-textfield
                  class="quarter"
                  .label="${'To'}"
                  .value="${String(warn.to)}"
                  type="number"
                  @input="${(e: Event) =>
                    this._updateWarningField(idx, 'to', parseFloat((e.target as HTMLInputElement).value))}"
                ></ha-textfield>
                <div class="quarter color-field">
                  <label>Color</label>
                  <input
                    type="color"
                    .value="${warn.color}"
                    @input="${(e: Event) =>
                      this._updateWarningField(idx, 'color', (e.target as HTMLInputElement).value)}"
                  />
                </div>
                <ha-select
                  class="quarter"
                  .label="${'Style'}"
                  .value="${warn.style ?? 'fill'}"
                  @selected="${(e: CustomEvent) =>
                    this._updateWarningField(idx, 'style', (e.target as any).value)}"
                  @closed="${(e: Event) => e.stopPropagation()}"
                >
                  ${WARNING_STYLES.map(
                    (s) => html`<mwc-list-item value="${s.value}">${s.label}</mwc-list-item>`,
                  )}
                </ha-select>
              </div>
            </div>
          `,
        )}
        <ha-button @click="${this._addWarning}">
          <ha-icon icon="mdi:plus" slot="icon"></ha-icon>
          Add Warning Range
        </ha-button>
      </div>
    `;
  }

  private _addWarning(): void {
    const warnings = [...(this._config.warnings ?? [])];
    const max = this._config.max ?? 100;
    warnings.push({
      from: max * 0.8,
      to: max,
      color: '#F44336',
      style: 'fill',
    });
    this._updateConfig('warnings', warnings);
  }

  private _removeWarning(idx: number): void {
    const warnings = [...(this._config.warnings ?? [])];
    warnings.splice(idx, 1);
    this._updateConfig('warnings', warnings);
  }

  private _updateWarningField(idx: number, field: keyof WarningConfig, value: unknown): void {
    const warnings = [...(this._config.warnings ?? [])];
    warnings[idx] = { ...warnings[idx], [field]: value };
    this._updateConfig('warnings', warnings);
  }

  // ---- History section ----

  private _renderHistorySection() {
    const h = { ...DEFAULT_HISTORY, ...this._config.history };

    return html`
      <div class="row">
        <div class="field half">
          <ha-formfield .label="${'Enable History'}">
            <ha-switch
              .checked="${h.enabled}"
              @change="${(e: Event) =>
                this._updateNestedConfig('history', 'enabled', (e.target as any).checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
        <ha-textfield
          class="half"
          .label="${'Lookback Hours'}"
          .value="${String(h.hours)}"
          type="number"
          @input="${(e: Event) =>
            this._updateNestedConfig('history', 'hours', parseFloat((e.target as HTMLInputElement).value) || 24)}"
        ></ha-textfield>
      </div>

      ${h.enabled
        ? html`
            <div class="field">
              <ha-select
                .label="${'History Mode'}"
                .value="${h.mode}"
                @selected="${(e: CustomEvent) =>
                  this._updateNestedConfig('history', 'mode', (e.target as any).value)}"
                @closed="${(e: Event) => e.stopPropagation()}"
              >
                ${HISTORY_MODES.map(
                  (m) => html`<mwc-list-item value="${m.value}">${m.label}</mwc-list-item>`,
                )}
              </ha-select>
            </div>

            ${h.mode === 'minmax' || h.mode === 'both'
              ? html`
                  <div class="row">
                    <div class="half color-field">
                      <label>Min Marker Color</label>
                      <input
                        type="color"
                        .value="${h.minColor ?? '#2196F3'}"
                        @input="${(e: Event) =>
                          this._updateNestedConfig('history', 'minColor', (e.target as HTMLInputElement).value)}"
                      />
                    </div>
                    <div class="half color-field">
                      <label>Max Marker Color</label>
                      <input
                        type="color"
                        .value="${h.maxColor ?? '#F44336'}"
                        @input="${(e: Event) =>
                          this._updateNestedConfig('history', 'maxColor', (e.target as HTMLInputElement).value)}"
                      />
                    </div>
                  </div>
                `
              : ''}

            ${h.mode === 'dots' || h.mode === 'both'
              ? html`
                  <div class="row">
                    <div class="half color-field">
                      <label>Dot Color</label>
                      <input
                        type="color"
                        .value="${h.dotColor?.startsWith('var(') ? '#FF9800' : h.dotColor ?? '#FF9800'}"
                        @input="${(e: Event) =>
                          this._updateNestedConfig('history', 'dotColor', (e.target as HTMLInputElement).value)}"
                      />
                    </div>
                    <ha-textfield
                      class="half"
                      .label="${'Dot Size'}"
                      .value="${String(h.dotSize)}"
                      type="number"
                      @input="${(e: Event) =>
                        this._updateNestedConfig('history', 'dotSize', parseFloat((e.target as HTMLInputElement).value) || 3)}"
                    ></ha-textfield>
                  </div>
                `
              : ''}
          `
        : ''}
    `;
  }

  // ---- Appearance section ----

  private _getDisplayEndRadius(): number {
    const d = { ...DEFAULT_DISPLAY, ...this._config.display };
    const radius = d.endRadius ?? d.borderRadius ?? 0;
    if (!Number.isFinite(radius)) {
      return 0;
    }
    return Math.max(0, radius);
  }

  private _setDisplayRoundedEnds(enabled: boolean): void {
    const display = { ...(this._config.display ?? {}) };
    display.roundedEnds = enabled;
    this._updateConfig('display', display);
  }

  private _setDisplayEndRadius(inputValue: string): void {
    const parsed = parseFloat(inputValue);
    if (!Number.isFinite(parsed)) {
      return;
    }

    const radius = Math.max(0, parsed);
    const display = { ...(this._config.display ?? {}) };
    // Keep legacy key synchronized for backward compatibility.
    display.endRadius = radius;
    display.borderRadius = radius;
    this._updateConfig('display', display);
  }

  private _renderAppearance() {
    const d = { ...DEFAULT_DISPLAY, ...this._config.display };
    const roundedEnds = d.roundedEnds !== false;
    const endRadius = this._getDisplayEndRadius();

    return html`
      <div class="row">
        <div class="half color-field">
          <label>Track Color</label>
          <input
            type="color"
            .value="${d.trackColor?.startsWith('var(') ? '#CCCCCC' : d.trackColor ?? '#CCCCCC'}"
            @input="${(e: Event) =>
              this._updateNestedConfig('display', 'trackColor', (e.target as HTMLInputElement).value)}"
          />
        </div>
        <div class="field half">
          <ha-formfield .label="${'Rounded Ends'}">
            <ha-switch
              .checked="${roundedEnds}"
              @change="${(e: Event) =>
                this._setDisplayRoundedEnds((e.target as HTMLInputElement).checked)}"
            ></ha-switch>
          </ha-formfield>
        </div>
      </div>

      <div class="row">
        <ha-textfield
          class="half"
          .label="${'End Radius (px)'}"
          .value="${String(endRadius)}"
          .disabled="${!roundedEnds}"
          type="number"
          @input="${(e: Event) => this._setDisplayEndRadius((e.target as HTMLInputElement).value)}"
        ></ha-textfield>
        <ha-textfield
          class="half"
          .label="${'Padding'}"
          .value="${String(d.padding)}"
          type="number"
          @input="${(e: Event) =>
            this._updateNestedConfig('display', 'padding', parseFloat((e.target as HTMLInputElement).value) || 16)}"
        ></ha-textfield>
      </div>

      <div class="row">
        <div class="half color-field">
          <label>Background</label>
          <input
            type="color"
            .value="${d.backgroundColor?.startsWith('var(') || d.backgroundColor === 'none' ? '#000000' : d.backgroundColor ?? '#000000'}"
            @input="${(e: Event) =>
            this._updateNestedConfig('display', 'backgroundColor', (e.target as HTMLInputElement).value)}"
          />
        </div>
        <div class="half"></div>
      </div>
    `;
  }

  // ---- Styles ----

  static get styles(): CSSResultGroup {
    return css`
      :host {
        display: block;
      }

      .editor {
        padding: 0;
      }

      .section {
        border-bottom: 1px solid var(--divider-color);
      }

      .section-header {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        cursor: pointer;
        font-weight: 500;
        user-select: none;
        color: var(--primary-text-color);
      }

      .section-header:hover {
        background: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
      }

      .section-content {
        padding: 0 16px 16px;
      }

      .field {
        margin-bottom: 12px;
      }

      .row {
        display: flex;
        gap: 12px;
        margin-bottom: 12px;
        align-items: flex-end;
      }

      .half {
        flex: 1;
        min-width: 0;
      }

      .third {
        flex: 1;
        min-width: 0;
      }

      .quarter {
        flex: 1;
        min-width: 0;
      }

      ha-textfield,
      ha-select,
      ha-entity-picker,
      ha-selector {
        width: 100%;
      }

      h4 {
        margin: 16px 0 8px;
        font-size: 13px;
        font-weight: 500;
        color: var(--secondary-text-color);
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }

      h4:first-child {
        margin-top: 0;
      }

      .color-field {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .color-field label {
        font-size: 12px;
        color: var(--secondary-text-color);
      }

      .color-field input[type='color'] {
        width: 100%;
        height: 40px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        padding: 2px;
      }

      .color-row {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .color-row input[type='color'] {
        width: 48px;
        height: 36px;
        border: 1px solid var(--divider-color);
        border-radius: 4px;
        cursor: pointer;
        background: none;
        padding: 2px;
        flex-shrink: 0;
      }

      .color-row ha-button.active {
        --mdc-theme-primary: var(--primary-color);
        font-weight: 600;
      }

      .toggle-label {
        font-size: 12px;
        color: var(--secondary-text-color);
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      /* List items (segments, warnings) */

      .list-section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .list-item {
        background: var(--card-background-color, var(--ha-card-background));
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 8px 12px;
      }

      .list-item-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
      }

      .list-item-title {
        flex: 1;
        font-weight: 500;
        font-size: 13px;
      }

      .color-swatch {
        width: 16px;
        height: 16px;
        border-radius: 50%;
        border: 1px solid var(--divider-color);
        flex-shrink: 0;
      }
    `;
  }
}

customElements.define(EDITOR_TAG, LinearGaugeCardEditor);
