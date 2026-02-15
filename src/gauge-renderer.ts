import { svg, TemplateResult, nothing } from 'lit';
import {
  LinearGaugeCardConfig,
  SegmentConfig,
  WarningConfig,
  MajorTickConfig,
  MinorTickConfig,
  DialConfig,
  HistoryConfig,
  HistoryData,
  DisplayConfig,
} from './types';
import {
  DEFAULT_MAJOR_TICK,
  DEFAULT_MINOR_TICK,
  DEFAULT_DIAL,
  DEFAULT_HISTORY,
  DEFAULT_DISPLAY,
  GAUGE_TRACK_HEIGHT,
} from './const';

function resolveEndRadius(display: DisplayConfig): number {
  const d = { ...DEFAULT_DISPLAY, ...display };
  if (d.roundedEnds === false) {
    return 0;
  }

  const configuredRadius = d.endRadius ?? d.borderRadius;
  if (!Number.isFinite(configuredRadius)) {
    return 0;
  }

  return Math.max(0, configuredRadius);
}

// ---- Layout helpers ----

export interface GaugeLayout {
  orientation: 'horizontal' | 'vertical';
  trackX: number;
  trackY: number;
  trackWidth: number;
  trackHeight: number;
  svgWidth: number;
  svgHeight: number;
  min: number;
  max: number;
}

export function computeLayout(config: LinearGaugeCardConfig): GaugeLayout {
  const orientation = config.orientation ?? 'horizontal';
  const condensed = config.condensed === true;
  const min = config.min ?? 0;
  const max = config.max ?? 100;

  const major = { ...DEFAULT_MAJOR_TICK, ...config.ticks?.major };
  const showLabels = major.labels;
  const labelSpace = showLabels ? major.labelFontSize + 6 : 0;
  const tickSpace = Math.max(major.size, (config.ticks?.minor ? { ...DEFAULT_MINOR_TICK, ...config.ticks.minor }.size : 0));

  if (orientation === 'horizontal') {
    const padding = condensed ? 4 : 8;
    const topPadding = condensed ? 2 : tickSpace + labelSpace + 4;
    const bottomTickSpace = condensed ? Math.max(0, tickSpace - 2) : tickSpace;
    const bottomLabelSpace = condensed ? Math.max(0, labelSpace - 2) : labelSpace;
    const svgWidth = 300;
    const trackHeight = GAUGE_TRACK_HEIGHT;
    const trackY = topPadding;
    const trackX = padding;
    const trackWidth = svgWidth - padding * 2;
    const bottomPadding = condensed ? 4 : 8;
    const svgHeight = trackY + trackHeight + bottomTickSpace + bottomLabelSpace + bottomPadding;
    return { orientation, trackX, trackY, trackWidth, trackHeight, svgWidth, svgHeight, min, max };
  } else {
    const padding = 8;
    const svgHeight = 300;
    const trackWidth = GAUGE_TRACK_HEIGHT;
    const trackX = GAUGE_TRACK_HEIGHT + labelSpace + tickSpace + 4;
    const trackY = padding;
    const trackHeight = svgHeight - padding * 2;
    const svgWidth = trackX + trackWidth + tickSpace + labelSpace + 16;
    return { orientation, trackX, trackY, trackWidth, trackHeight, svgWidth, svgHeight, min, max };
  }
}

/** Maps a data value to a pixel position along the gauge axis. */
export function valueToPos(value: number, layout: GaugeLayout): number {
  const ratio = Math.max(0, Math.min(1, (value - layout.min) / (layout.max - layout.min)));
  if (layout.orientation === 'horizontal') {
    return layout.trackX + ratio * layout.trackWidth;
  } else {
    // Vertical: value increases upward, SVG y increases downward
    return layout.trackY + layout.trackHeight - ratio * layout.trackHeight;
  }
}

// ---- Track background ----

export function renderTrack(layout: GaugeLayout, display: DisplayConfig): TemplateResult {
  const d = { ...DEFAULT_DISPLAY, ...display };
  const endRadius = resolveEndRadius(d);
  return svg`
    <rect
      x="${layout.trackX}"
      y="${layout.trackY}"
      width="${layout.orientation === 'horizontal' ? layout.trackWidth : layout.trackHeight}"
      height="${layout.orientation === 'horizontal' ? layout.trackHeight : layout.trackWidth}"
      rx="${endRadius}"
      ry="${endRadius}"
      fill="${d.trackColor}"
      class="gauge-track"
    />
  `;
}

// ---- Colored segments ----

export function renderSegments(
  segments: SegmentConfig[],
  layout: GaugeLayout,
  display: DisplayConfig,
): TemplateResult {
  if (!segments || segments.length === 0) return svg``;
  const d = { ...DEFAULT_DISPLAY, ...display };
  const endRadius = resolveEndRadius(d);
  const clipId = `seg-clip-${Math.random().toString(36).slice(2, 8)}`;
  const useGradient = d.segmentFill === 'gradient';

  const gradientDefs: TemplateResult[] = [];
  const segRects = segments.map((seg, idx) => {
    const start = valueToPos(Math.max(seg.from, layout.min), layout);
    const end = valueToPos(Math.min(seg.to, layout.max), layout);
    const nextSegColor = segments[idx + 1]?.color ?? seg.color;

    if (layout.orientation === 'horizontal') {
      const x = Math.min(start, end);
      const w = Math.abs(end - start);
      if (!useGradient) {
        return svg`<rect x="${x}" y="${layout.trackY}" width="${w}" height="${layout.trackHeight}" fill="${seg.color}" />`;
      }
      const gradientId = `seg-grad-h-${idx}-${Math.random().toString(36).slice(2, 8)}`;
      gradientDefs.push(svg`
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="${seg.color}" />
          <stop offset="100%" stop-color="${nextSegColor}" />
        </linearGradient>
      `);
      return svg`<rect x="${x}" y="${layout.trackY}" width="${w}" height="${layout.trackHeight}" fill="url(#${gradientId})" />`;
    } else {
      const y = Math.min(start, end);
      const h = Math.abs(end - start);
      if (!useGradient) {
        return svg`<rect x="${layout.trackX}" y="${y}" width="${layout.trackWidth}" height="${h}" fill="${seg.color}" />`;
      }
      const gradientId = `seg-grad-v-${idx}-${Math.random().toString(36).slice(2, 8)}`;
      gradientDefs.push(svg`
        <linearGradient id="${gradientId}" x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stop-color="${seg.color}" />
          <stop offset="100%" stop-color="${nextSegColor}" />
        </linearGradient>
      `);
      return svg`<rect x="${layout.trackX}" y="${y}" width="${layout.trackWidth}" height="${h}" fill="url(#${gradientId})" />`;
    }
  });

  return svg`
    <defs>
      ${gradientDefs}
      <clipPath id="${clipId}">
        <rect
          x="${layout.trackX}"
          y="${layout.trackY}"
          width="${layout.orientation === 'horizontal' ? layout.trackWidth : layout.trackWidth}"
          height="${layout.orientation === 'horizontal' ? layout.trackHeight : layout.trackHeight}"
          rx="${endRadius}"
          ry="${endRadius}"
        />
      </clipPath>
    </defs>
    <g clip-path="url(#${clipId})">
      ${segRects}
    </g>
  `;
}

// ---- Warning ranges ----

export function renderWarnings(
  warnings: WarningConfig[],
  layout: GaugeLayout,
  display: DisplayConfig,
): TemplateResult {
  if (!warnings || warnings.length === 0) return svg``;
  const d = { ...DEFAULT_DISPLAY, ...display };
  const endRadius = resolveEndRadius(d);
  const clipId = `warn-clip-${Math.random().toString(36).slice(2, 8)}`;

  const patterns: TemplateResult[] = [];
  const warnRects = warnings.map((warn, i) => {
    const start = valueToPos(Math.max(warn.from, layout.min), layout);
    const end = valueToPos(Math.min(warn.to, layout.max), layout);
    const warnStyle = warn.style ?? 'fill';
    const patternId = `hatch-${i}-${Math.random().toString(36).slice(2, 8)}`;

    let fill = warn.color;
    let stroke = 'none';
    let strokeWidth = 0;
    let fillOpacity = 0.3;

    if (warnStyle === 'hatch') {
      patterns.push(svg`
        <pattern id="${patternId}" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="6" stroke="${warn.color}" stroke-width="2" />
        </pattern>
      `);
      fill = `url(#${patternId})`;
      fillOpacity = 1;
    } else if (warnStyle === 'border') {
      fill = 'none';
      stroke = warn.color;
      strokeWidth = 1.5;
      fillOpacity = 1;
    }

    if (layout.orientation === 'horizontal') {
      const x = Math.min(start, end);
      const w = Math.abs(end - start);
      return svg`<rect x="${x}" y="${layout.trackY}" width="${w}" height="${layout.trackHeight}"
        fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    } else {
      const y = Math.min(start, end);
      const h = Math.abs(end - start);
      return svg`<rect x="${layout.trackX}" y="${y}" width="${layout.trackWidth}" height="${h}"
        fill="${fill}" fill-opacity="${fillOpacity}" stroke="${stroke}" stroke-width="${strokeWidth}" />`;
    }
  });

  return svg`
    <defs>
      ${patterns}
      <clipPath id="${clipId}">
        <rect
          x="${layout.trackX}" y="${layout.trackY}"
          width="${layout.orientation === 'horizontal' ? layout.trackWidth : layout.trackWidth}"
          height="${layout.orientation === 'horizontal' ? layout.trackHeight : layout.trackHeight}"
          rx="${endRadius}" ry="${endRadius}"
        />
      </clipPath>
    </defs>
    <g clip-path="url(#${clipId})">
      ${warnRects}
    </g>
  `;
}

// ---- Major ticks and labels ----

export function renderMajorTicks(
  config: LinearGaugeCardConfig,
  layout: GaugeLayout,
): TemplateResult {
  const t = { ...DEFAULT_MAJOR_TICK, ...config.ticks?.major };
  if (t.interval <= 0) return svg``;

  const ticks: TemplateResult[] = [];
  const { min, max } = layout;

  for (let v = min; v <= max + 0.0001; v += t.interval) {
    const pos = valueToPos(v, layout);

    if (layout.orientation === 'horizontal') {
      // Ticks below the track
      const y1 = layout.trackY + layout.trackHeight + 2;
      const y2 = y1 + t.size;
      ticks.push(svg`
        <line x1="${pos}" y1="${y1}" x2="${pos}" y2="${y2}"
          stroke="${t.color}" stroke-width="${t.width}" />
      `);

      if (t.labels) {
        const label = Number.isInteger(v) ? v.toString() : v.toFixed(1);
        ticks.push(svg`
          <text x="${pos}" y="${y2 + t.labelFontSize}" text-anchor="middle"
            font-size="${t.labelFontSize}" fill="${t.labelColor}" class="tick-label">
            ${label}${t.labelSuffix}
          </text>
        `);
      }
    } else {
      // Ticks to the left of the track
      const x1 = layout.trackX - 2;
      const x2 = x1 - t.size;
      ticks.push(svg`
        <line x1="${x1}" y1="${pos}" x2="${x2}" y2="${pos}"
          stroke="${t.color}" stroke-width="${t.width}" />
      `);

      if (t.labels) {
        const label = Number.isInteger(v) ? v.toString() : v.toFixed(1);
        ticks.push(svg`
          <text x="${x2 - 3}" y="${pos + t.labelFontSize / 3}" text-anchor="end"
            font-size="${t.labelFontSize}" fill="${t.labelColor}" class="tick-label">
            ${label}${t.labelSuffix}
          </text>
        `);
      }
    }
  }

  return svg`<g class="major-ticks">${ticks}</g>`;
}

// ---- Minor ticks ----

export function renderMinorTicks(
  config: LinearGaugeCardConfig,
  layout: GaugeLayout,
): TemplateResult {
  const major = { ...DEFAULT_MAJOR_TICK, ...config.ticks?.major };
  const minor = { ...DEFAULT_MINOR_TICK, ...config.ticks?.minor };
  if (minor.count <= 0 || major.interval <= 0) return svg``;

  const ticks: TemplateResult[] = [];
  const { min, max } = layout;
  const step = major.interval / (minor.count + 1);

  for (let majorVal = min; majorVal < max + 0.0001; majorVal += major.interval) {
    for (let i = 1; i <= minor.count; i++) {
      const v = majorVal + step * i;
      if (v > max + 0.0001) break;
      const pos = valueToPos(v, layout);

      if (layout.orientation === 'horizontal') {
        const y1 = layout.trackY + layout.trackHeight + 2;
        const y2 = y1 + minor.size;
        ticks.push(svg`
          <line x1="${pos}" y1="${y1}" x2="${pos}" y2="${y2}"
            stroke="${minor.color}" stroke-width="${minor.width}" />
        `);
      } else {
        const x1 = layout.trackX - 2;
        const x2 = x1 - minor.size;
        ticks.push(svg`
          <line x1="${x1}" y1="${pos}" x2="${x2}" y2="${pos}"
            stroke="${minor.color}" stroke-width="${minor.width}" />
        `);
      }
    }
  }

  return svg`<g class="minor-ticks">${ticks}</g>`;
}

// ---- Dial / indicator ----

function getSegmentColor(value: number, segments: SegmentConfig[], fallback: string): string {
  for (const seg of segments) {
    if (value >= seg.from && value <= seg.to) return seg.color;
  }
  return fallback;
}

export function renderDial(
  value: number,
  config: LinearGaugeCardConfig,
  layout: GaugeLayout,
): TemplateResult {
  const dial = { ...DEFAULT_DIAL, ...config.dial };
  const display = { ...DEFAULT_DISPLAY, ...config.display };
  const endRadius = resolveEndRadius(display);
  const pos = valueToPos(value, layout);

  let color = dial.color;
  if (color === 'segment' && config.segments && config.segments.length > 0) {
    color = getSegmentColor(value, config.segments, 'var(--primary-color)');
  }

  const clipId = `dial-clip-${Math.random().toString(36).slice(2, 8)}`;

  if (layout.orientation === 'horizontal') {
    switch (dial.style) {
      case 'bar-fill': {
        const barWidth = pos - layout.trackX;
        return svg`
          <defs>
            <clipPath id="${clipId}">
              <rect x="${layout.trackX}" y="${layout.trackY}" width="${layout.trackWidth}" height="${layout.trackHeight}"
                rx="${endRadius}" ry="${endRadius}" />
            </clipPath>
          </defs>
          <rect x="${layout.trackX}" y="${layout.trackY}" width="${Math.max(0, barWidth)}" height="${layout.trackHeight}"
            fill="${color}" clip-path="url(#${clipId})" class="gauge-dial-bar" />
        `;
      }
      case 'needle': {
        const needleW = dial.size ?? 3;
        const top = layout.trackY - 4;
        const bottom = layout.trackY + layout.trackHeight + 4;
        return svg`
          <line x1="${pos}" y1="${top}" x2="${pos}" y2="${bottom}"
            stroke="${color}" stroke-width="${needleW}" stroke-linecap="round" class="gauge-dial-needle" />
          <polygon points="${pos - 4},${top - 2} ${pos + 4},${top - 2} ${pos},${top + 3}"
            fill="${color}" />
        `;
      }
      case 'triangle': {
        const sz = dial.size ?? 6;
        const base = layout.trackY + layout.trackHeight + 2;
        return svg`
          <polygon points="${pos - sz},${base + sz * 1.5} ${pos + sz},${base + sz * 1.5} ${pos},${base}"
            fill="${color}" class="gauge-dial-triangle" />
        `;
      }
      case 'dot': {
        const r = dial.size ?? 5;
        const cy = layout.trackY + layout.trackHeight / 2;
        return svg`
          <circle cx="${pos}" cy="${cy}" r="${r}" fill="${color}" class="gauge-dial-dot" />
        `;
      }
      case 'line': {
        const lw = dial.size ?? 3;
        return svg`
          <line x1="${pos}" y1="${layout.trackY}" x2="${pos}" y2="${layout.trackY + layout.trackHeight}"
            stroke="${color}" stroke-width="${lw}" stroke-linecap="round" class="gauge-dial-line" />
        `;
      }
      default:
        return svg``;
    }
  } else {
    // Vertical
    switch (dial.style) {
      case 'bar-fill': {
        const barHeight = layout.trackY + layout.trackHeight - pos;
        return svg`
          <defs>
            <clipPath id="${clipId}">
              <rect x="${layout.trackX}" y="${layout.trackY}" width="${layout.trackWidth}" height="${layout.trackHeight}"
                rx="${endRadius}" ry="${endRadius}" />
            </clipPath>
          </defs>
          <rect x="${layout.trackX}" y="${pos}" width="${layout.trackWidth}" height="${Math.max(0, barHeight)}"
            fill="${color}" clip-path="url(#${clipId})" class="gauge-dial-bar" />
        `;
      }
      case 'needle': {
        const needleW = dial.size ?? 3;
        const left = layout.trackX - 4;
        const right = layout.trackX + layout.trackWidth + 4;
        return svg`
          <line x1="${left}" y1="${pos}" x2="${right}" y2="${pos}"
            stroke="${color}" stroke-width="${needleW}" stroke-linecap="round" class="gauge-dial-needle" />
          <polygon points="${left - 2},${pos - 4} ${left - 2},${pos + 4} ${left + 3},${pos}"
            fill="${color}" />
        `;
      }
      case 'triangle': {
        const sz = dial.size ?? 6;
        const base = layout.trackX + layout.trackWidth + 2;
        return svg`
          <polygon points="${base + sz * 1.5},${pos - sz} ${base + sz * 1.5},${pos + sz} ${base},${pos}"
            fill="${color}" class="gauge-dial-triangle" />
        `;
      }
      case 'dot': {
        const r = dial.size ?? 5;
        const cx = layout.trackX + layout.trackWidth / 2;
        return svg`
          <circle cx="${cx}" cy="${pos}" r="${r}" fill="${color}" class="gauge-dial-dot" />
        `;
      }
      case 'line': {
        const lw = dial.size ?? 3;
        return svg`
          <line x1="${layout.trackX}" y1="${pos}" x2="${layout.trackX + layout.trackWidth}" y2="${pos}"
            stroke="${color}" stroke-width="${lw}" stroke-linecap="round" class="gauge-dial-line" />
        `;
      }
      default:
        return svg``;
    }
  }
}

// ---- History markers ----

export function renderHistory(
  historyData: HistoryData | null,
  config: LinearGaugeCardConfig,
  layout: GaugeLayout,
): TemplateResult {
  if (!historyData) return svg``;
  const h = { ...DEFAULT_HISTORY, ...config.history };
  const parts: TemplateResult[] = [];

  const showMinMax = h.mode === 'minmax' || h.mode === 'both';
  const showDots = h.mode === 'dots' || h.mode === 'both';

  if (showMinMax) {
    const minPos = valueToPos(historyData.min, layout);
    const maxPos = valueToPos(historyData.max, layout);

    if (layout.orientation === 'horizontal') {
      const markerY = layout.trackY - 2;
      const sz = 3;
      // Min marker (down-pointing triangle above track)
      parts.push(svg`
        <polygon points="${minPos - sz},${markerY - sz * 1.8} ${minPos + sz},${markerY - sz * 1.8} ${minPos},${markerY}"
          fill="${h.minColor}" class="history-min" />
      `);
      // Max marker
      parts.push(svg`
        <polygon points="${maxPos - sz},${markerY - sz * 1.8} ${maxPos + sz},${markerY - sz * 1.8} ${maxPos},${markerY}"
          fill="${h.maxColor}" class="history-max" />
      `);
    } else {
      const markerX = layout.trackX + layout.trackWidth + 2;
      const sz = 3;
      // Min: right-pointing triangle
      parts.push(svg`
        <polygon points="${markerX},${minPos} ${markerX + sz * 1.8},${minPos - sz} ${markerX + sz * 1.8},${minPos + sz}"
          fill="${h.minColor}" class="history-min" />
      `);
      // Max
      parts.push(svg`
        <polygon points="${markerX},${maxPos} ${markerX + sz * 1.8},${maxPos - sz} ${markerX + sz * 1.8},${maxPos + sz}"
          fill="${h.maxColor}" class="history-max" />
      `);
    }
  }

  if (showDots && historyData.values.length > 0) {
    // Sample down to at most ~50 dots to avoid clutter
    const maxDots = 50;
    const step = Math.max(1, Math.floor(historyData.values.length / maxDots));
    const sampled = historyData.values.filter((_, i) => i % step === 0);

    for (const entry of sampled) {
      const pos = valueToPos(entry.value, layout);
      if (layout.orientation === 'horizontal') {
        parts.push(svg`
          <circle cx="${pos}" cy="${layout.trackY + layout.trackHeight / 2}" r="${h.dotSize}"
            fill="${h.dotColor}" opacity="0.6" class="history-dot" />
        `);
      } else {
        parts.push(svg`
          <circle cx="${layout.trackX + layout.trackWidth / 2}" cy="${pos}" r="${h.dotSize}"
            fill="${h.dotColor}" opacity="0.6" class="history-dot" />
        `);
      }
    }
  }

  return svg`<g class="history-markers">${parts}</g>`;
}
