// ---- Home Assistant type stubs ----

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  themes: HassThemes;
  language: string;
  locale: HassLocale;
  config: HassConfig;
  callApi: <T>(method: string, path: string, parameters?: Record<string, unknown>) => Promise<T>;
  callWS: <T>(msg: Record<string, unknown>) => Promise<T>;
  connection: {
    subscribeMessage: <T>(callback: (msg: T) => void, msg: Record<string, unknown>) => Promise<() => void>;
  };
  formatEntityState: (stateObj: HassEntity) => string;
  formatEntityAttributeValue: (stateObj: HassEntity, attribute: string) => string;
}

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, unknown> & {
    friendly_name?: string;
    unit_of_measurement?: string;
    icon?: string;
    min?: number;
    max?: number;
    device_class?: string;
  };
  last_changed: string;
  last_updated: string;
}

export interface HassThemes {
  default_theme: string;
  themes: Record<string, Record<string, string>>;
}

export interface HassLocale {
  language: string;
  number_format: string;
}

export interface HassConfig {
  unit_system: Record<string, string>;
}

// ---- Action types ----

export interface ActionConfig {
  action: 'more-info' | 'toggle' | 'call-service' | 'navigate' | 'url' | 'none' | 'fire-dom-event';
  service?: string;
  service_data?: Record<string, unknown>;
  navigation_path?: string;
  url_path?: string;
  confirmation?: {
    text?: string;
    exemptions?: { user: string }[];
  };
}

// ---- Card config types ----

export interface TicksConfig {
  major?: MajorTickConfig;
  minor?: MinorTickConfig;
}

export interface MajorTickConfig {
  interval?: number;
  size?: number;
  width?: number;
  color?: string;
  labels?: boolean;
  labelFontSize?: number;
  labelColor?: string;
  labelSuffix?: string;
  labelPosition?: 'outside' | 'inside';
}

export interface MinorTickConfig {
  count?: number;
  size?: number;
  width?: number;
  color?: string;
}

export interface SegmentConfig {
  from: number;
  to: number;
  color: string;
  label?: string;
}

export interface WarningConfig {
  from: number;
  to: number;
  color: string;
  label?: string;
  style?: 'fill' | 'hatch' | 'border';
}

export interface DialConfig {
  style?: 'needle' | 'line' | 'triangle' | 'dot' | 'bar-fill';
  color?: string;
  size?: number;
  length?: number;
  showValue?: boolean;
  valueFontSize?: number;
  valuePosition?: 'above' | 'below' | 'right' | 'left' | 'inside';
  valueColor?: string;
}

export interface HistoryConfig {
  enabled?: boolean;
  hours?: number;
  mode?: 'minmax' | 'dots' | 'both';
  dotColor?: string;
  dotSize?: number;
  minColor?: string;
  maxColor?: string;
}

export interface DisplayConfig {
  backgroundColor?: string;
  trackColor?: string;
  segmentFill?: 'solid' | 'gradient';
  roundedEnds?: boolean;
  endRadius?: number;
  borderRadius?: number;
  padding?: number;
}

export interface LinearGaugeCardConfig {
  type: string;
  entity: string;
  name?: string | false;
  show_name?: boolean;
  condensed?: boolean;
  unit?: string;
  min?: number;
  max?: number;
  orientation?: 'horizontal' | 'vertical';
  height?: number;
  ticks?: TicksConfig;
  segments?: SegmentConfig[];
  warnings?: WarningConfig[];
  dial?: DialConfig;
  history?: HistoryConfig;
  display?: DisplayConfig;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

// ---- History data types ----

export interface HistoryData {
  min: number;
  max: number;
  values: { time: number; value: number }[];
}

// ---- Lovelace interfaces ----

export interface LovelaceCard extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: LinearGaugeCardConfig): void;
  getCardSize(): number;
}

export interface LovelaceCardEditor extends HTMLElement {
  hass: HomeAssistant;
  setConfig(config: LinearGaugeCardConfig): void;
}
