import * as os from 'os';
import { CpuSnapshot } from '../types/metrics';

/**
 * Captures an instantaneous snapshot of system CPU ticks across all cores.
 */
export function getCpuSnapshot(): CpuSnapshot {
  const cpus = os.cpus();
  let idle = 0;
  let total = 0;

  for (const cpu of cpus) {
    const times = cpu.times;
    idle += times.idle;
    total += times.user + times.nice + times.sys + times.idle + times.irq;
  }

  return { idle, total };
}

/**
 * Calculates CPU utilization percentage between two snapshots.
 */
export function calculateCpuUsage(prev: CpuSnapshot, current: CpuSnapshot): number {
  const idleDelta = current.idle - prev.idle;
  const totalDelta = current.total - prev.total;

  if (totalDelta <= 0) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(((totalDelta - idleDelta) / totalDelta) * 100)));
}

/**
 * Creates a stateful functional CPU monitor closure.
 */
export function createCpuMonitor() {
  let prevSnapshot: CpuSnapshot = getCpuSnapshot();

  return {
    getCpuUsage: (): number => {
      const current = getCpuSnapshot();
      const usage = calculateCpuUsage(prevSnapshot, current);
      prevSnapshot = current;
      return usage;
    },
    getCpuModel: (): string => {
      const cpus = os.cpus();
      return cpus[0]?.model || 'Processor';
    },
    getCpuCoreCount: (): number => {
      return os.cpus().length;
    }
  };
}

