import * as os from 'os';

/**
 * Formats system uptime in seconds to human-readable string 'Xh Ym'.
 */
export function formatUptime(uptimeSeconds: number = os.uptime()): string {
  const hours = Math.floor(uptimeSeconds / 3600);
  const mins = Math.floor((uptimeSeconds % 3600) / 60);
  return `${hours}h ${mins}m`;
}

