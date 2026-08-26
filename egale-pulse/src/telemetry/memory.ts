import * as os from 'os';
import { MemoryMetrics } from '../types/metrics';

/**
 * Calculates current system RAM usage in GB and percentage.
 */
export function getMemoryUsage(): MemoryMetrics {
  const totalBytes = os.totalmem();
  const freeBytes = os.freemem();
  const usedBytes = totalBytes - freeBytes;

  const totalGB = parseFloat((totalBytes / (1024 ** 3)).toFixed(1));
  const usedGB = parseFloat((usedBytes / (1024 ** 3)).toFixed(1));
  const percent = Math.round((usedBytes / totalBytes) * 100);

  return { usedGB, totalGB, percent };
}

