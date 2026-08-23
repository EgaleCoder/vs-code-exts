import * as vscode from 'vscode';
import { SystemMetrics, SystemMonitor } from './systemMonitor';

let statusBarItem: vscode.StatusBarItem;
let systemMonitor: SystemMonitor;
let updateInterval: NodeJS.Timeout | null = null;
let currentPanel: vscode.WebviewPanel | undefined = undefined;
let webviewViewProvider: EgaleCodersViewProvider | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
  console.log('🦅 EGALE CODERS System Telemetry Extension is active.');

  systemMonitor = new SystemMonitor();

  // 1. Create Status Bar Item (Bottom Right Corner)
  statusBarItem = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right,
    100
  );
  statusBarItem.command = 'egalecoder.openDashboard';
  statusBarItem.text = '$(pulse) EGALE CODERS: Initializing...';
  statusBarItem.tooltip = 'EGALE CODERS: Real-Time Network, CPU & Memory Monitor. Click to open full dashboard.';
  statusBarItem.show();
  context.subscriptions.push(statusBarItem);

  // 2. Register Webview View Provider (for Sidebar / Activity Bar)
  webviewViewProvider = new EgaleCodersViewProvider(context.extensionUri, systemMonitor);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider('egalecoder.dashboardView', webviewViewProvider)
  );

  // 3. Register Command to open Dashboard Webview Panel
  context.subscriptions.push(
    vscode.commands.registerCommand('egalecoder.openDashboard', () => {
      openOrShowDashboard(context.extensionUri);
    })
  );

  // 4. Start Real-time Telemetry Polling (every 1.5s)
  startMetricsPolling();

  context.subscriptions.push({
    dispose: () => {
      if (updateInterval) {
        clearInterval(updateInterval);
      }
    },
  });
}

function startMetricsPolling() {
  const update = async () => {
    try {
      const metrics = await systemMonitor.getFullMetrics();

      // Update Bottom-Right Status Bar
      const netIcon = metrics.networkStatus === 'ONLINE' ? '🌐' : '⚠️';
      statusBarItem.text = `$(pulse) EGALE CODERS: ${netIcon} ${metrics.internetSpeedMbps} Mbps | ⚡ ${metrics.cpuUsagePercent}% | 🧠 ${metrics.memoryUsagePercent}%`;
      statusBarItem.tooltip = new vscode.MarkdownString(
        `### 🦅 EGALE CODERS Real-Time Telemetry\n\n` +
        `* **🌐 Internet Speed:** ${metrics.internetSpeedMbps} Mbps (${metrics.networkLatencyMs}ms latency)\n` +
        `* **⚡ CPU Usage:** ${metrics.cpuUsagePercent}% (${metrics.cpuCores} Cores)\n` +
        `* **🧠 Memory Usage:** ${metrics.memoryUsedGB} GB / ${metrics.memoryTotalGB} GB (${metrics.memoryUsagePercent}%)\n` +
        `* **⏱️ System Uptime:** ${metrics.uptimeFormatted}\n\n` +
        `_Click to open EGALE CODERS visual dashboard._`
      );

      // Push to Webview Panel if open
      if (currentPanel) {
        currentPanel.webview.postMessage({
          type: 'updateMetrics',
          data: metrics,
        });
      }

      // Push to Webview View if visible
      webviewViewProvider?.sendMetrics(metrics);
    } catch (err) {
      console.error('Failed to update system metrics:', err);
    }
  };

  // Run initial update immediately
  update();
  updateInterval = setInterval(update, 1500);
}

function openOrShowDashboard(extensionUri: vscode.Uri) {
  const column = vscode.ViewColumn.Beside;

  if (currentPanel) {
    currentPanel.reveal(column);
    return;
  }

  currentPanel = vscode.window.createWebviewPanel(
    'egalecoder.dashboard',
    '🦅 EGALE CODERS',
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

class EgaleCodersViewProvider implements vscode.WebviewViewProvider {
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _monitor: SystemMonitor
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ) {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')],
    };

    webviewView.webview.html = getDashboardHtml(webviewView.webview, this._extensionUri);

    // Send initial snapshot
    this._monitor.getFullMetrics().then((metrics) => {
      this.sendMetrics(metrics);
    });
  }

  public sendMetrics(metrics: SystemMetrics) {
    if (this._view) {
      this._view.webview.postMessage({
        type: 'updateMetrics',
        data: metrics,
      });
    }
  }
}

function getDashboardHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const logoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'icons', 'ECLogo.png'));
  const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'dashboard.css'));
  const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'dashboard.js'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${cssUri}">
  <title>EGALE CODERS</title>
</head>
<body>
  <div class="widget-card">
    
    <!-- Top Logo Section -->
    <div class="logo-wrapper">
      <div class="logo-glow"></div>
      <img src="${logoUri}" alt="EGALE CODERS Logo" class="logo-img" />
    </div>

    <!-- Impressive & Cool Brand Name -->
    <h1 class="brand-title">EGALE CODERS</h1>
    <div class="brand-subtitle">
      <span class="status-dot"></span> Real-Time System Intelligence
    </div>

    <!-- Real-Time Analysis Grid -->
    <div class="metrics-container">
      
      <!-- 1. Internet Speed & Latency -->
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-label-group">
            <span class="metric-icon">🌐</span>
            <span class="metric-name">Internet Speed</span>
          </div>
          <span class="metric-badge" id="badge-net">ONLINE</span>
        </div>
        <div class="metric-body">
          <div>
            <span class="metric-value" id="val-net-speed">--</span>
            <span class="metric-unit">Mbps</span>
          </div>
          <span class="metric-sub" id="val-net-ping">-- ms ping</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar bar-network" id="bar-net" style="width: 50%;"></div>
        </div>
      </div>

      <!-- 2. CPU Usage -->
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-label-group">
            <span class="metric-icon">⚡</span>
            <span class="metric-name">CPU Usage</span>
          </div>
          <span class="metric-badge" id="badge-cpu">NORMAL</span>
        </div>
        <div class="metric-body">
          <div>
            <span class="metric-value" id="val-cpu">--</span>
            <span class="metric-unit">%</span>
          </div>
          <span class="metric-sub" id="val-cores">-- Cores</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar bar-cpu" id="bar-cpu" style="width: 25%;"></div>
        </div>
      </div>

      <!-- 3. Memory Usage -->
      <div class="metric-card">
        <div class="metric-header">
          <div class="metric-label-group">
            <span class="metric-icon">🧠</span>
            <span class="metric-name">Memory Usage</span>
          </div>
          <span class="metric-badge" id="badge-mem">HEALTHY</span>
        </div>
        <div class="metric-body">
          <div>
            <span class="metric-value" id="val-mem">--</span>
            <span class="metric-unit">%</span>
          </div>
          <span class="metric-sub" id="val-mem-detail">-- / -- GB</span>
        </div>
        <div class="progress-track">
          <div class="progress-bar bar-mem" id="bar-mem" style="width: 35%;"></div>
        </div>
      </div>

    </div>

    <!-- Footer System Specs -->
    <div class="footer-info">
      <span id="info-cpu-model">PROCESSOR</span>
      <span id="info-uptime">UP: 0h 0m</span>
    </div>

  </div>

  <script src="${jsUri}"></script>
</body>
</html>`;
}

export function deactivate() {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
}
