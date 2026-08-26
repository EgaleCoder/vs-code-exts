import * as vscode from 'vscode';

/**
 * Generates the dashboard Webview HTML template with localized assets.
 */
export function getDashboardHtml(webview: vscode.Webview, extensionUri: vscode.Uri): string {
  const logoUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'icons', 'ECLogo.png'));
  const cssUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'css', 'dashboard.css'));
  const jsUri = webview.asWebviewUri(vscode.Uri.joinPath(extensionUri, 'media', 'js', 'dashboard.js'));

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${cssUri}">
  <title>EGALE PULSE</title>
</head>
<body>
  <div class="widget-card">
    
    <!-- Top Logo Section -->
    <div class="logo-wrapper">
      <div class="logo-glow"></div>
      <img src="${logoUri}" alt="EGALE PULSE Logo" class="logo-img" />
    </div>

    <!-- Impressive Brand Title -->
    <h1 class="brand-title">EGALE PULSE</h1>
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

