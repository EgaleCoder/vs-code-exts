import * as vscode from 'vscode';
import { getDashboardHtml } from './dashboardHtml';
import { SystemMetrics } from '../../types/metrics';

export interface DashboardPanelManager {
  openOrShow: () => void;
  sendMetrics: (metrics: SystemMetrics) => void;
  dispose: () => void;
}

/**
 * Functional manager for the standalone webview dashboard panel.
 */
export function createDashboardPanelManager(extensionUri: vscode.Uri): DashboardPanelManager {
  let currentPanel: vscode.WebviewPanel | undefined = undefined;

  function openOrShow(): void {
    const column = vscode.ViewColumn.Beside;

    if (currentPanel) {
      currentPanel.reveal(column);
      return;
    }

    currentPanel = vscode.window.createWebviewPanel(
      'egalePulse.dashboard',
      '🦅 EGALE PULSE',
      column,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
      }
    );

    currentPanel.webview.html = getDashboardHtml(currentPanel.webview, extensionUri);

    currentPanel.onDidDispose(() => {
      currentPanel = undefined;
    });
  }

  function sendMetrics(metrics: SystemMetrics): void {
    if (currentPanel) {
      currentPanel.webview.postMessage({
        type: 'updateMetrics',
        data: metrics,
      });
    }
  }

  function dispose(): void {
    if (currentPanel) {
      currentPanel.dispose();
      currentPanel = undefined;
    }
  }

  return {
    openOrShow,
    sendMetrics,
    dispose,
  };
}

