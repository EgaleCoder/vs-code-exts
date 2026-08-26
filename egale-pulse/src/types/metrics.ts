export type NetworkStatus = 'ONLINE' | 'LATENCY HIGH' | 'OFFLINE';

export interface CpuSnapshot {
  idle: number;
  total: number;
}

export interface MemoryMetrics {
  usedGB: number;
  totalGB: number;
  percent: number;
}

export interface NetworkMetrics {
  speedMbps: number;
  latencyMs: number;
  status: NetworkStatus;
}

export interface SystemMetrics {
  cpuUsagePercent: number;
  cpuModel: string;
  cpuCores: number;
  memoryUsedGB: number;
  memoryTotalGB: number;
  memoryUsagePercent: number;
  internetSpeedMbps: number;
  networkLatencyMs: number;
  networkStatus: NetworkStatus;
  uptimeFormatted: string;
}

