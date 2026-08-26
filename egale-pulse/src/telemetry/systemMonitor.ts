import { createCpuMonitor } from './cpu';
import { getMemoryUsage } from './memory';
import { createNetworkMonitor } from './network';
import { formatUptime } from './uptime';
import { SystemMetrics } from '../types/metrics';

export type SystemMonitorService = ReturnType<typeof createSystemMonitor>;

/**
 * Factory function creating the full system telemetry service.
 */
export function createSystemMonitor() {
  const cpuMonitor = createCpuMonitor();
  const networkMonitor = createNetworkMonitor();

  async function getFullMetrics(): Promise<SystemMetrics> {
    const cpuUsagePercent = cpuMonitor.getCpuUsage();
    const cpuModel = cpuMonitor.getCpuModel();
    const cpuCores = cpuMonitor.getCpuCoreCount();
    const mem = getMemoryUsage();
    const net = await networkMonitor.measureNetwork();
    const uptimeFormatted = formatUptime();

    return {
      cpuUsagePercent,
      cpuModel,
      cpuCores,
      memoryUsedGB: mem.usedGB,
      memoryTotalGB: mem.totalGB,
      memoryUsagePercent: mem.percent,
      internetSpeedMbps: net.speedMbps,
      networkLatencyMs: net.latencyMs,
      networkStatus: net.status,
      uptimeFormatted,
    };
  }

  return {
    getFullMetrics,
    getCpuUsage: cpuMonitor.getCpuUsage,
    getCpuModel: cpuMonitor.getCpuModel,
    getCpuCoreCount: cpuMonitor.getCpuCoreCount,
    getMemoryUsage,
    measureNetwork: networkMonitor.measureNetwork,
    formatUptime,
  };
}

