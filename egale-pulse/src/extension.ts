import * as vscode from 'vscode';
import { createSystemMonitor, SystemMonitorService } from './telemetry/systemMonitor';
import { createStatusBarManager, StatusBarManager } from './ui/statusBar';
import { createDashboardPanelManager, DashboardPanelManager } from './ui/webview/dashboardPanel';
import { createSidebarViewProvider, SidebarViewProviderService } from './ui/webview/sidebarView';

let pollingInterval: NodeJS.Timeout | null = null;

/**
 * Starts periodic telemetry polling and dispatches updates to all UI consumers.
 */
function startTelemetryPolling(
  monitor: SystemMonitorService,
  statusBar: StatusBarManager,
  panel: DashboardPanelManager,
  sidebar: SidebarViewProviderService,
  intervalMs: number = 1500
): NodeJS.Timeout {
  const poll = async () => {
    try {
      const metrics = await monitor.getFullMetrics();

      // 1. Update Status Bar
      statusBar.update(metrics);

      // 2. Update Webview Panel if open
      panel.sendMetrics(metrics);

      // 3. Update Sidebar Webview if visible
      sidebar.sendMetrics(metrics);
    } catch (error) {
      console.error('Failed to poll telemetry metrics:', error);
    }
  };

  // Run initial poll immediately
  poll();
  return setInterval(poll, intervalMs);
}

/**
 * Extension activation entry point (Functional architecture).
 */
export function activate(context: vscode.ExtensionContext): void {
  console.log('🦅 EGALE PULSE Telemetry Extension is active.');

  // 1. Instantiate Functional Services
  const systemMonitor = createSystemMonitor();
  const statusBar = createStatusBarManager('egalePulse.openDashboard');
  const panelManager = createDashboardPanelManager(context.extensionUri);
  const sidebarProvider = createSidebarViewProvider(context.extensionUri, systemMonitor);

  // 2. Register Status Bar
  statusBar.show();
  context.subscriptions.push({ dispose: () => statusBar.dispose() });

  // 3. Register Sidebar Webview View Provider
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('egalePulse.dashboardView', sidebarProvider)
  );

  // 4. Register Open Dashboard Commands
  const openDashboardHandler = () => panelManager.openOrShow();
  context.subscriptions.push(
    vscode.commands.registerCommand('egalePulse.openDashboard', openDashboardHandler),
    // Backward compatibility command registration
    vscode.commands.registerCommand('egalecoder.openDashboard', openDashboardHandler)
  );

  // 5. Start Real-time Telemetry Polling
  pollingInterval = startTelemetryPolling(systemMonitor, statusBar, panelManager, sidebarProvider, 1500);

  context.subscriptions.push({
    dispose: () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
        pollingInterval = null;
      }
      panelManager.dispose();
    },
  });
}

/**
 * Extension deactivation lifecycle hook.
 */
export function deactivate(): void {
  if (pollingInterval) {
    clearInterval(pollingInterval);
    pollingInterval = null;
  }
}

