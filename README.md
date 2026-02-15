# Linear Gauge Card

A modern, highly customizable linear gauge card for [Home Assistant](https://www.home-assistant.io/) Lovelace dashboards.

[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

## Features

- **Horizontal & Vertical** orientation
- **Colored segments** — define value ranges with custom colors
- **Major & minor ticks** with configurable labels, size, colors, and suffix
- **Multiple dial/indicator styles** — bar fill, needle, triangle, dot, line
- **Warning ranges** — fill, hatch pattern, or border overlays
- **History markers** — min/max markers and/or time-series dots from entity history
- **Full visual editor** — configure everything from the UI, no YAML needed
- **Theme integration** — inherits HA theme colors (dark/light)
- **HACS ready**

## Installation

### HACS (Recommended)

1. Open HACS in your HA instance
2. Go to **Frontend** → three-dot menu → **Custom repositories**
3. Add this repository URL, category: **Dashboard**
4. Search for "Linear Gauge Card" and install
5. Refresh the browser

### Manual

1. Download `linear-gauge-card.js` from the [latest release](https://github.com/your-user/linear-gauge-ha/releases)
2. Copy to `config/www/linear-gauge-card.js`
3. Add the resource in **Settings → Dashboards → Resources**:
   - URL: `/local/linear-gauge-card.js`
   - Type: JavaScript Module

## Usage

Add the card via the UI card picker — search for **Linear Gauge Card**.

### Minimal YAML

```yaml
type: custom:linear-gauge-card
entity: sensor.temperature
```

### Full Example

```yaml
type: custom:linear-gauge-card
entity: sensor.fuel_rate
name: Fuel Rate
unit: L/h
min: 0
max: 300
orientation: horizontal
segments:
  - from: 0
    to: 100
    color: "#4CAF50"
  - from: 100
    to: 200
    color: "#FFEB3B"
  - from: 200
    to: 300
    color: "#F44336"
warnings:
  - from: 250
    to: 300
    color: "#F44336"
    style: hatch
ticks:
  major:
    interval: 50
    size: 12
    width: 2
    labels: true
    labelFontSize: 11
    labelSuffix: ""
  minor:
    count: 4
    size: 6
dial:
  style: bar-fill
  color: segment
  size: 4
  showValue: true
  valueFontSize: 14
  valuePosition: right
history:
  enabled: true
  hours: 24
  mode: both
  minColor: "#2196F3"
  maxColor: "#F44336"
  dotColor: "#FF9800"
  dotSize: 3
display:
  trackColor: "rgba(127,127,127,0.3)"
  borderRadius: 4
  padding: 16
```

## Configuration Options

### General

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `entity` | string | **required** | Entity ID |
| `name` | string / false | entity name | Card title (false to hide) |
| `unit` | string | from entity | Override unit of measurement |
| `min` | number | 0 | Gauge minimum value |
| `max` | number | 100 | Gauge maximum value |
| `orientation` | string | horizontal | `horizontal` or `vertical` |

### Segments

Array of colored value ranges:

| Option | Type | Description |
|--------|------|-------------|
| `from` | number | Start value |
| `to` | number | End value |
| `color` | string | CSS color |

### Ticks

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `ticks.major.interval` | number | 10 | Interval between major ticks |
| `ticks.major.size` | number | 12 | Tick height in px |
| `ticks.major.width` | number | 2 | Tick line width |
| `ticks.major.labels` | boolean | true | Show tick labels |
| `ticks.major.labelFontSize` | number | 11 | Label font size |
| `ticks.major.labelSuffix` | string | "" | Suffix appended to labels |
| `ticks.minor.count` | number | 4 | Minor ticks between major |
| `ticks.minor.size` | number | 6 | Minor tick height |

### Dial / Indicator

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `dial.style` | string | bar-fill | `bar-fill`, `needle`, `line`, `triangle`, `dot` |
| `dial.color` | string | primary-color | CSS color or `segment` to inherit |
| `dial.size` | number | 4 | Thickness / radius |
| `dial.showValue` | boolean | true | Show numeric value badge |
| `dial.valueFontSize` | number | 14 | Value text size |
| `dial.valuePosition` | string | right | `above`, `below`, `right`, `left`, `inside` |

### Warnings

Array of warning range overlays:

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `from` | number | — | Start value |
| `to` | number | — | End value |
| `color` | string | — | Warning color |
| `style` | string | fill | `fill`, `hatch`, or `border` |

### History

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `history.enabled` | boolean | false | Enable history markers |
| `history.hours` | number | 24 | Lookback period |
| `history.mode` | string | minmax | `minmax`, `dots`, or `both` |
| `history.dotColor` | string | accent-color | Dot color |
| `history.dotSize` | number | 3 | Dot radius |
| `history.minColor` | string | #2196F3 | Min marker color |
| `history.maxColor` | string | #F44336 | Max marker color |

### Display

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `display.trackColor` | string | divider-color | Gauge track background |
| `display.borderRadius` | number | 4 | Track corner radius |
| `display.padding` | number | 16 | Card inner padding |

### Actions

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `tap_action` | object | more-info | Action on tap |
| `hold_action` | object | — | Action on hold |
| `double_tap_action` | object | — | Action on double-tap |

## Development

```bash
npm install
npm run build      # Production build → dist/linear-gauge-card.js
npm run dev        # Watch mode
```

## License

MIT
