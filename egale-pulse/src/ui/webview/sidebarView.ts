import * as vscode from 'vscode';
import { getDashboardHtml } from './dashboardHtml';
import { SystemMetrics } from '../../types/metrics';
import { SystemMonitorService } from '../../telemetry/systemMonitor';

export interface SidebarViewProviderService extends vscode.WebviewViewProvider {
  sendMetrics: (metrics: SystemMetrics) => void;
}

/**
 * Functional factory providing the WebviewView provider for Sidebar / Activity Bar without using any class.
 */
export function createSidebarViewProvider(
  extensionUri: vscode.Uri,
  systemMonitor: SystemMonitorService
): SidebarViewProviderService {
  let view: vscode.WebviewView | undefined = undefined;

  function resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
    };

    webviewView.webview.html = getDashboardHtml(webviewView.webview, extensionUri);

    // Push initial snapshot immediately
    systemMonitor.getFullMetrics().then((metrics) => {
      sendMetrics(metrics);
    });
  }

  function sendMetrics(metrics: SystemMetrics): void {
    if (view) {
      view.webview.postMessage({
        type: 'updateMetrics',
        data: metrics,
      });
    }
  }

  return {
    resolveWebviewView,
    sendMetrics,
  };
}

