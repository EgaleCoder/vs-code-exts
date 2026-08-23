import * as vscode from 'vscode';
import { CONFIG_KEYS, EXTENSION_NAME, EagleSkin, SkyTheme } from '../constants';
import { BugHunter } from '../utils/bugHunter';
import { getRandomEagleQuote } from '../utils/quotes';
import { getNonce, getWebviewUri } from '../utils/webviewUtils';

export class FlightPanelManager {
  public static currentPanel: FlightPanelManager | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionUri: vscode.Uri;
  private _disposables: vscode.Disposable[] = [];
  private _bugsCaughtTotal = 0;

  private constructor(panel: vscode.WebviewPanel, extensionUri: vscode.Uri) {
    this._panel = panel;
    this._extensionUri = extensionUri;

    this._update();

    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      (message) => {
        this._handleMessage(message);
      },
      null,
      this._disposables
    );
  }

  public static createOrShow(extensionUri: vscode.Uri): FlightPanelManager {
    const column = vscode.window.activeTextEditor
      ? vscode.window.activeTextEditor.viewColumn
      : undefined;

    if (FlightPanelManager.currentPanel) {
      FlightPanelManager.currentPanel._panel.reveal(column);
      return FlightPanelManager.currentPanel;
    }

    const panel = vscode.window.createWebviewPanel(
      'egalecoder.flightPanel',
      '🦅 EgaleCoder Sky Flight',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [vscode.Uri.joinPath(extensionUri, 'media')],
      }
    );

    FlightPanelManager.currentPanel = new FlightPanelManager(panel, extensionUri);
    return FlightPanelManager.currentPanel;
  }

  public get bugsCaught(): number {
    return this._bugsCaughtTotal;
  }

  public huntBugs(): void {
    const bugs = BugHunter.scanDiagnostics();
    this._panel.webview.postMessage({
      command: 'spawnBugs',
      bugs,
    });
  }

  public playScreech(): void {
    this._panel.webview.postMessage({
      command: 'triggerScreech',
    });
  }

  public feedEagle(): void {
    this._panel.webview.postMessage({
      command: 'feed',
    });
  }

  public changeSkin(skin: EagleSkin): void {
    this._panel.webview.postMessage({
      command: 'setSkin',
      skin,
    });
  }

  public changeTheme(theme: SkyTheme): void {
    this._panel.webview.postMessage({
      command: 'setTheme',
      theme,
    });
  }

  private _handleMessage(message: { command: string; [key: string]: any }): void {
    switch (message.command) {
      case 'ready': {
        const config = vscode.workspace.getConfiguration();
        const skin = config.get<EagleSkin>(CONFIG_KEYS.EAGLE_SKIN, 'golden');
        const theme = config.get<SkyTheme>(CONFIG_KEYS.SKY_THEME, 'cyberpunk');
        const sound = config.get<boolean>(CONFIG_KEYS.SOUND_ENABLED, true);
        const speed = config.get<string>(CONFIG_KEYS.FLIGHT_SPEED, 'normal');
        const bugs = BugHunter.scanDiagnostics();

        this._panel.webview.postMessage({
          command: 'initState',
          skin,
          theme,
          sound,
          speed,
          bugs,
        });
        break;
      }
      case 'bugCaught': {
        this._bugsCaughtTotal++;
        const bug = message.bug;
        if (bug && bug.filename && bug.filename !== 'cloud.ts') {
          vscode.window.showInformationMessage(
            `🦅 EgaleCoder snatched a bug in ${bug.filename}:${bug.line} - "${bug.message}"!`
          );
        }
        break;
      }
      case 'screechRequest': {
        const quote = getRandomEagleQuote();
        vscode.window.showInformationMessage(quote);
        break;
      }
      case 'syncConfig': {
        if (message.key && message.value !== undefined) {
          vscode.workspace.getConfiguration().update(message.key, message.value, vscode.ConfigurationTarget.Global);
        }
        break;
      }
    }
  }

  private _update(): void {
    const webview = this._panel.webview;
    this._panel.title = `🦅 ${EXTENSION_NAME} Sky Flight`;
    this._panel.webview.html = this._getHtmlForWebview(webview);
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    const scriptUri = getWebviewUri(webview, this._extensionUri, ['media', 'scripts', 'flightCanvas.js']);
    const audioUri = getWebviewUri(webview, this._extensionUri, ['media', 'scripts', 'audioFx.js']);
    const stylesUri = getWebviewUri(webview, this._extensionUri, ['media', 'styles', 'flight.css']);
    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src ${webview.cspSource} 'unsafe-inline'; script-src 'nonce-${nonce}'; img-src ${webview.cspSource} data: https:;">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="${stylesUri}">
  <title>EgaleCoder Sky Flight</title>
</head>
<body>
  <div id="flight-container">
    <canvas id="sky-canvas"></canvas>

    <!-- Top Telemetry HUD -->
    <div class="hud-top glass-panel">
      <div class="hud-brand">
        <span class="hud-icon">🦅</span>
        <span class="hud-title">EgaleCoder</span>
        <span class="hud-badge" id="hud-mode-badge">SOARING</span>
      </div>
      <div class="hud-stats">
        <div class="stat-pill"><span class="stat-label">ALT</span> <span class="stat-val" id="stat-alt">2,450 FT</span></div>
        <div class="stat-pill"><span class="stat-label">SPEED</span> <span class="stat-val" id="stat-speed">95 MPH</span></div>
        <div class="stat-pill"><span class="stat-label">BUGS SNATCHED</span> <span class="stat-val" id="stat-bugs">0</span></div>
        <div class="stat-pill"><span class="stat-label">STAMINA</span> <span class="stat-val" id="stat-stamina">100%</span></div>
      </div>
    </div>

    <!-- Floating Interactive Controls -->
    <div class="hud-bottom glass-panel">
      <button class="action-btn" id="btn-hunt" title="Hunt bugs in airspace">🎯 Hunt Bugs</button>
      <button class="action-btn" id="btn-screech" title="Eagle Screech & Wisdom">📢 Screech</button>
      <button class="action-btn" id="btn-feed" title="Feed snack / Boost energy">🍗 Feed</button>
      <button class="action-btn" id="btn-dive" title="High speed swoop">⚡ Dive Swoop</button>
      <div class="divider"></div>
      <select class="hud-select" id="select-skin" title="Select Eagle Skin">
        <option value="golden">👑 Golden Eagle</option>
        <option value="cyber">⚡ Cyber Raptor</option>
        <option value="bald">🦅 Bald Eagle</option>
        <option value="phoenix">🔥 Phoenix</option>
        <option value="pixel">👾 Pixel Eagle</option>
      </select>
      <select class="hud-select" id="select-theme" title="Select Sky Theme">
        <option value="cyberpunk">🌆 Cyberpunk Sunset</option>
        <option value="sunset">🌅 Golden Hour</option>
        <option value="daylight">☀️ Azure Daylight</option>
        <option value="midnight">🌌 Deep Midnight</option>
      </select>
      <button class="icon-btn" id="btn-sound" title="Toggle Sound FX">🔊</button>
    </div>

    <!-- Speech / Quote Notification Banner -->
    <div id="eagle-speech-bubble" class="speech-bubble hidden">
      <span id="speech-text">🦅 Screeech! Fly high and code clean!</span>
    </div>
  </div>

  <script nonce="${nonce}" src="${audioUri}"></script>
  <script nonce="${nonce}" src="${scriptUri}"></script>
</body>
</html>`;
  }

  public dispose(): void {
    FlightPanelManager.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }
}
