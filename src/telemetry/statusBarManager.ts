import * as vscode from 'vscode';
import { COMMANDS, EXTENSION_NAME } from '../constants';
import { BatteryManager, BatteryStats } from './batteryManager';

export class StatusBarManager implements vscode.Disposable {
  private _statusBarItem: vscode.StatusBarItem;
  private _batteryStatusItem: vscode.StatusBarItem;
  private _isPatrolling = false;
  private _bugsCaught = 0;
  private _speed = 95;
  private _batteryManager: BatteryManager;
  private _batteryLevel: number = 100;

  constructor() {
    this._batteryManager = new BatteryManager();

    // Main status bar item (left side)
    this._statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this._statusBarItem.command = 'egalecoder.showQuickMenu';

    // Battery status bar item (right side, more prominent)
    this._batteryStatusItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      101
    );
    this._batteryStatusItem.command = 'egalecoder.feed';

    this.updateStatus();
    this._statusBarItem.show();
    this._batteryStatusItem.show();

    // Subscribe to battery changes
    this._batteryManager.onBatteryChange((stats) => {
      this._batteryLevel = stats.currentLevel;
      this._updateBatteryStatus(stats);
    });
  }

  public setPatrolActive(active: boolean): void {
    this._isPatrolling = active;
    if (active) {
      this._batteryManager.activateFeature('editorPatrol');
    } else {
      this._batteryManager.deactivateFeature('editorPatrol');
    }
    this.updateStatus();
  }

  public incrementBugsCaught(): void {
    this._bugsCaught++;
    this.updateStatus();
  }

  public setSpeed(speed: number): void {
    this._speed = Math.round(speed);
    this.updateStatus();
  }

  public activateFeature(feature: 'skyFlight' | 'bugHunting' | 'audioEffects'): void {
    this._batteryManager.activateFeature(feature);
  }

  public deactivateFeature(feature: 'skyFlight' | 'bugHunting' | 'audioEffects'): void {
    this._batteryManager.deactivateFeature(feature);
  }

  public getBatteryManager(): BatteryManager {
    return this._batteryManager;
  }

  public getBatteryLevel(): number {
    return this._batteryLevel;
  }

  private _updateBatteryStatus(stats: BatteryStats): void {
    const batteryPercent = Math.round(stats.currentLevel);
    const icon = this._getBatteryIcon(batteryPercent);

    this._batteryStatusItem.text = `${icon} ${batteryPercent}%`;
    this._batteryStatusItem.tooltip = `🔋 EgaleCoder Battery: ${batteryPercent}%\n\nActive Features: ${Array.from(this._getActiveFeatures()).join(', ') || 'None'}\n\nClick to feed snack and restore energy!`;

    // Change color based on battery level
    if (batteryPercent <= 5) {
      this._batteryStatusItem.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.errorBackground'
      );
    } else if (batteryPercent <= 20) {
      this._batteryStatusItem.backgroundColor = new vscode.ThemeColor(
        'statusBarItem.warningBackground'
      );
    } else {
      this._batteryStatusItem.backgroundColor = undefined;
    }
  }

  private _getBatteryIcon(percent: number): string {
    if (percent >= 80) {
      return '🔋'; // Full battery
    } else if (percent >= 60) {
      return '🔋'; // High
    } else if (percent >= 40) {
      return '⚡'; // Medium
    } else if (percent >= 20) {
      return '⚠️'; // Low
    } else {
      return '🔴'; // Critical
    }
  }

  private _getActiveFeatures(): Set<string> {
    // This would ideally come from BatteryManager, but for now we track locally
    const features = new Set<string>();
    if (this._isPatrolling) features.add('Patrol');
    return features;
  }

  private updateStatus(): void {
    if (this._isPatrolling) {
      this._statusBarItem.text = `$(rocket) 🦅 EgaleCoder: [Patrolling | ${this._speed}mph]`;
      this._statusBarItem.tooltip = `${EXTENSION_NAME} is soaring across your code lines!\nClick to open quick flight menu.`;
      this._statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    } else {
      this._statusBarItem.text = `🦅 EgaleCoder [Bugs: ${this._bugsCaught}]`;
      this._statusBarItem.tooltip = `${EXTENSION_NAME} Ready to soar.\nClick to open quick flight menu.`;
      this._statusBarItem.backgroundColor = undefined;
    }
  }

  public async showQuickMenu(): Promise<void> {
    const items: vscode.QuickPickItem[] = [
      {
        label: '$(rocket) Summon Sky Flight Mode',
        description: 'Open full workspace interactive flight canvas & mini-game',
        detail: COMMANDS.SUMMON,
      },
      {
        label: this._isPatrolling ? '$(debug-pause) Pause In-Editor Soaring' : '$(play) Start In-Editor Soaring',
        description: 'Let EgaleCoder fly line-by-line in active code editor',
        detail: COMMANDS.TOGGLE_EDITOR_PATROL,
      },
      {
        label: '$(bug) Hunt Workspace Linter Bugs',
        description: 'Eagle dives to hunt syntax errors and diagnostics',
        detail: COMMANDS.HUNT_BUGS,
      },
      {
        label: '$(megaphone) Eagle Screech & Wisdom',
        description: 'Play eagle screech sound and get inspirational coder quote',
        detail: COMMANDS.SCREECH,
      },
      {
        label: `🔋 Feed EgaleCoder Snack (Current Battery: ${Math.round(this._batteryLevel)}%)`,
        description: 'Boost energy and restore 20% battery',
        detail: COMMANDS.FEED,
      },
      {
        label: '$(paintcan) Change Eagle Skin',
        description: 'Switch between Golden, Cyber Raptor, Bald Eagle, Phoenix, Pixel',
        detail: COMMANDS.CHANGE_SKIN,
      },
      {
        label: '$(home) Open Nest Sidebar',
        description: 'Focus Activity Bar telemetry and flight controls',
        detail: COMMANDS.TOGGLE_NEST,
      },
    ];

    const selected = await vscode.window.showQuickPick(items, {
      placeHolder: '🦅 EgaleCoder Flight Command Center',
    });

    if (selected && selected.detail) {
      vscode.commands.executeCommand(selected.detail);
    }
  }

  public dispose(): void {
    this._statusBarItem.dispose();
    this._batteryStatusItem.dispose();
    this._batteryManager.dispose();
  }
}
