import * as vscode from 'vscode';
import { SystemMetrics } from '../types/metrics';

export interface StatusBarManager {
  item: vscode.StatusBarItem;
  update: (metrics: SystemMetrics) => void;
  show: () => void;
  hide: () => void;
  dispose: () => void;
}

/**
 * Creates and manages the bottom-right status bar item for Egale Pulse.
 */
export function createStatusBarManager(commandId: string = 'egalePulse.openDashboard'): StatusBarManager {
  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );

  item.command = commandId;
  item.text = '$(pulse) EGALE PULSE: Initializing...';
  item.tooltip = 'EGALE PULSE: Real-Time Network, CPU & Memory Monitor. Click to open full dashboard.';

  function update(metrics: SystemMetrics): void {
    const netIcon = metrics.networkStatus === 'ONLINE' ? '🌐' : '⚠️';
    item.text = `$(pulse) EGALE PULSE: ${netIcon} ${metrics.internetSpeedMbps} Mbps | ⚡ ${metrics.cpuUsagePercent}% | 🧠 ${metrics.memoryUsagePercent}%`;
    
    const tooltipMarkdown = new vscode.MarkdownString(
      `### 🦅 EGALE PULSE Telemetry\n\n` +
      `* **🌐 Internet Speed:** ${metrics.internetSpeedMbps} Mbps (${metrics.networkLatencyMs}ms ping)\n` +
      `* **⚡ CPU Usage:** ${metrics.cpuUsagePercent}% (${metrics.cpuCores} Cores)\n` +
      `* **🧠 Memory Usage:** ${metrics.memoryUsedGB} GB / ${metrics.memoryTotalGB} GB (${metrics.memoryUsagePercent}%)\n` +
      `* **⏱️ System Uptime:** ${metrics.uptimeFormatted}\n\n` +
      `_Click to open the EGALE PULSE visual dashboard._`
    );

    item.tooltip = tooltipMarkdown;
  }

  return {
    item,
    update,
    show: () => item.show(),
    hide: () => item.hide(),
    dispose: () => item.dispose(),
  };
}

