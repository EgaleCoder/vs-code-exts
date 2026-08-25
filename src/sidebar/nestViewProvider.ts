import * as vscode from 'vscode';
import { CONFIG_KEYS, EXTENSION_NAME, EagleSkin, SkyTheme } from '../constants';
import { getNonce, getWebviewUri } from '../utils/webviewUtils';

export class NestViewProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = 'egalecoder.nestView';
  private _view?: vscode.WebviewView;

  constructor(
    private readonly _extensionUri: vscode.Uri,
    private readonly _onCommandTriggered: (cmd: string, args?: any) => void
  ) {}

  public resolveWebviewView(
    webviewView: vscode.WebviewView,
    _context: vscode.WebviewViewResolveContext,
    _token: vscode.CancellationToken
  ): void {
    this._view = webviewView;

    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(this._extensionUri, 'media')],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage((data) => {
      switch (data.type) {
        case 'action':
          this._onCommandTriggered(data.command, data.args);
          break;
        case 'changeSkin':
          vscode.workspace
            .getConfiguration()
            .update(CONFIG_KEYS.EAGLE_SKIN, data.skin, vscode.ConfigurationTarget.Global);
          break;
        case 'changeTheme':
          vscode.workspace
            .getConfiguration()
            .update(CONFIG_KEYS.SKY_THEME, data.theme, vscode.ConfigurationTarget.Global);
          break;
      }
    });
  }

  public updateTelemetry(telemetry: {
    altitude: number;
    speedMph: number;
    stamina: number;
    battery: number;
    bugsCaught: number;
    linesPatrolled: number;
    mood: string;
    patrolActive: boolean;
  }): void {
    if (this._view) {
      this._view.webview.postMessage({
        type: 'updateTelemetry',
        ...telemetry,
      });
    }
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const styleUri = getWebviewUri(webview, this._extensionUri, ['media', 'styles', 'nest.css']);
    const scriptUri = getWebviewUri(webview, this._extensionUri, ['media', 'scripts', 'nestUi.js']);
    const nonce = getNonce();

    const config = vscode.workspace.getConfiguration();
    const currentSkin = config.get<EagleSkin>(CONFIG_KEYS.EAGLE_SKIN, 'golden');
    const currentTheme = config.get<SkyTheme>(CONFIG_KEYS.SKY_THEME, 'cyberpunk');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data: https:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${styleUri}">
  <title>EgaleCoder Nest</title>
</head>
<body>
  <div class="nest-container">
    <!-- Header with Mascot -->
    <div class="mascot-card">
      <div class="eagle-avatar-wrapper">
        <div class="eagle-avatar-glow"></div>
        <div class="eagle-mascot" id="mascot-icon">🦅</div>
      </div>
      <h2 class="title">${EXTENSION_NAME}</h2>
      <p class="subtitle" id="mascot-mood">Status: Soaring Majestically</p>
    </div>

    <!-- Telemetry Grid -->
    <div class="telemetry-grid">
      <div class="telemetry-tile">
        <span class="label">Altitude</span>
        <span class="value" id="nest-alt">2,450 ft</span>
      </div>
      <div class="telemetry-tile">
        <span class="label">Airspeed</span>
        <span class="value" id="nest-speed">95 mph</span>
      </div>
      <div class="telemetry-tile">
        <span class="label">Bugs Caught</span>
        <span class="value highlight" id="nest-bugs">0</span>
      </div>
      <div class="telemetry-tile">
        <span class="label">Lines Patrolled</span>
        <span class="value highlight" id="nest-lines">0</span>
      </div>
    </div>

    <!-- Stamina Meter -->
    <div class="stamina-section">
      <div class="stamina-header">
        <span>Eagle Stamina</span>
        <span id="stamina-pct">100%</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" id="stamina-fill" style="width: 100%;"></div>
      </div>
    </div>

    <!-- Battery Meter -->
    <div class="battery-section">
      <div class="battery-header">
        <span>🔋 Battery Level</span>
        <span id="battery-pct">100%</span>
      </div>
      <div class="progress-bar battery-bar">
        <div class="progress-fill battery-fill" id="battery-fill" style="width: 100%;"></div>
      </div>
      <p class="battery-hint">Drains based on active features. Feed snacks to restore energy!</p>
    </div>

    <!-- Primary Action Controls -->
    <div class="actions-section">
      <button class="btn btn-primary" id="btn-launch-sky">
        <span class="btn-icon">🚀</span> Launch Sky Flight Mode
      </button>
      <button class="btn btn-secondary" id="btn-toggle-patrol">
        <span class="btn-icon">👁️</span> <span id="patrol-btn-text">Start In-Editor Soaring</span>
      </button>
      <div class="btn-row">
        <button class="btn btn-action" id="btn-hunt">
          <span class="btn-icon">🎯</span> Hunt Bugs
        </button>
        <button class="btn btn-action" id="btn-screech">
          <span class="btn-icon">📢</span> Screech
        </button>
        <button class="btn btn-action" id="btn-feed">
          <span class="btn-icon">🍗</span> Feed
        </button>
      </div>
    </div>

    <!-- Customization Options -->
    <div class="custom-section">
      <h3 class="section-title">Eagle Customization</h3>
      <div class="select-group">
        <label for="nest-skin-select">Skin</label>
        <select id="nest-skin-select">
          <option value="golden" ${currentSkin === 'golden' ? 'selected' : ''}>👑 Golden Eagle</option>
          <option value="cyber" ${currentSkin === 'cyber' ? 'selected' : ''}>⚡ Cyber Raptor</option>
          <option value="bald" ${currentSkin === 'bald' ? 'selected' : ''}>🦅 Bald Eagle</option>
          <option value="phoenix" ${currentSkin === 'phoenix' ? 'selected' : ''}>🔥 Phoenix</option>
          <option value="pixel" ${currentSkin === 'pixel' ? 'selected' : ''}>👾 Pixel Eagle</option>
        </select>
      </div>
      <div class="select-group">
        <label for="nest-theme-select">Environment</label>
        <select id="nest-theme-select">
          <option value="cyberpunk" ${currentTheme === 'cyberpunk' ? 'selected' : ''}>🌆 Cyberpunk Sunset</option>
          <option value="sunset" ${currentTheme === 'sunset' ? 'selected' : ''}>🌅 Golden Hour</option>
          <option value="daylight" ${currentTheme === 'daylight' ? 'selected' : ''}>☀️ Azure Daylight</option>
          <option value="midnight" ${currentTheme === 'midnight' ? 'selected' : ''}>🌌 Deep Midnight</option>
        </select>
      </div>
    </div>
  </div>

  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }
}
