import {
  LinearGaugeCardConfig,
  DialConfig,
  TicksConfig,
  HistoryConfig,
  DisplayConfig,
  MajorTickConfig,
  MinorTickConfig,
} from './types';

export const CARD_VERSION = '1.0.0';

export const CARD_TAG = 'linear-gauge-card';
export const EDITOR_TAG = 'linear-gauge-card-editor';

export const DEFAULT_MAJOR_TICK: Required<MajorTickConfig> = {
  interval: 10,
  size: 12,
  width: 2,
  color: 'var(--primary-text-color)',
  labels: true,
  labelFontSize: 11,
  labelColor: 'var(--primary-text-color)',
  labelSuffix: '',
  labelPosition: 'outside',
};

export const DEFAULT_MINOR_TICK: Required<MinorTickConfig> = {
  count: 4,
  size: 6,
  width: 1,
  color: 'var(--secondary-text-color)',
};

export const DEFAULT_TICKS: Required<TicksConfig> = {
  major: { ...DEFAULT_MAJOR_TICK },
  minor: { ...DEFAULT_MINOR_TICK },
};

export const DEFAULT_DIAL: Required<DialConfig> = {
  style: 'bar-fill',
  color: 'var(--primary-color)',
  size: 4,
  length: 14,
  showValue: true,
  valueFontSize: 14,
  valuePosition: 'right',
  valueColor: 'var(--primary-text-color)',
};

export const DEFAULT_HISTORY: Required<HistoryConfig> = {
  enabled: false,
  hours: 24,
  mode: 'minmax',
  dotColor: 'var(--accent-color)',
  dotSize: 3,
  minColor: '#2196F3',
  maxColor: '#F44336',
};

export const DEFAULT_DISPLAY: Required<DisplayConfig> = {
  backgroundColor: 'none',
  trackColor: 'var(--divider-color, rgba(127,127,127,0.3))',
  segmentFill: 'solid',
  roundedEnds: true,
  endRadius: 4,
  borderRadius: 4,
  padding: 16,
};

export const DEFAULT_CONFIG: Partial<LinearGaugeCardConfig> = {
  min: 0,
  max: 100,
  show_name: true,
  condensed: false,
  orientation: 'horizontal',
  ticks: { ...DEFAULT_TICKS },
  dial: { ...DEFAULT_DIAL },
  history: { ...DEFAULT_HISTORY },
  display: { ...DEFAULT_DISPLAY },
  segments: [],
  warnings: [],
};

// Preset color palettes for segments
export const PRESET_COLORS = [
  '#4CAF50', // green
  '#8BC34A', // light green
  '#FFEB3B', // yellow
  '#FF9800', // orange
  '#F44336', // red
  '#2196F3', // blue
  '#9C27B0', // purple
  '#00BCD4', // cyan
  '#795548', // brown
  '#607D8B', // blue-grey
];

// SVG layout constants
export const GAUGE_TRACK_HEIGHT = 12;
export const GAUGE_LABEL_MARGIN = 4;
export const SVG_H_VIEWBOX_WIDTH = 300;
export const SVG_H_VIEWBOX_HEIGHT = 60;
export const SVG_V_VIEWBOX_WIDTH = 80;
export const SVG_V_VIEWBOX_HEIGHT = 300;
