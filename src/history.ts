import { HomeAssistant, HistoryData } from './types';

export interface HistoryCache {
  entityId: string;
  hours: number;
  timestamp: number;
  data: HistoryData;
}

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function fetchHistory(
  hass: HomeAssistant,
  entityId: string,
  hours: number,
  cache: { current: HistoryCache | null },
): Promise<HistoryData | null> {
  // Check instance-level cache
  if (
    cache.current &&
    cache.current.entityId === entityId &&
    cache.current.hours === hours &&
    Date.now() - cache.current.timestamp < CACHE_TTL
  ) {
    return cache.current.data;
  }

  try {
    const end = new Date();
    const start = new Date(end.getTime() - hours * 60 * 60 * 1000);
    const startStr = start.toISOString();
    const endStr = end.toISOString();

    const url = `history/period/${startStr}?filter_entity_id=${entityId}&end_time=${endStr}&minimal_response&no_attributes`;

    const result = await hass.callApi<Array<Array<{ state: string; last_changed: string }>>>(
      'GET',
      url,
    );

    if (!result || result.length === 0 || result[0].length === 0) {
      return null;
    }

    const states = result[0];
    const values: { time: number; value: number }[] = [];
    let min = Infinity;
    let max = -Infinity;

    for (const entry of states) {
      const val = parseFloat(entry.state);
      if (isNaN(val) || !isFinite(val)) continue;
      values.push({ time: new Date(entry.last_changed).getTime(), value: val });
      if (val < min) min = val;
      if (val > max) max = val;
    }

    if (values.length === 0) return null;

    const data: HistoryData = { min, max, values };

    cache.current = {
      entityId,
      hours,
      timestamp: Date.now(),
      data,
    };

    return data;
  } catch (err) {
    console.warn('Linear Gauge Card: Failed to fetch history', err);
    return null;
  }
}
