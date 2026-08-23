import * as vscode from 'vscode';
import { COMMANDS, EXTENSION_NAME } from '../constants';

export class StatusBarManager implements vscode.Disposable {
  private _statusBarItem: vscode.StatusBarItem;
  private _isPatrolling = false;
  private _bugsCaught = 0;
  private _speed = 95;

  constructor() {
    this._statusBarItem = vscode.window.createStatusBarItem(
      vscode.StatusBarAlignment.Right,
      100
    );
    this._statusBarItem.command = 'egalecoder.showQuickMenu';
    this.updateStatus();
    this._statusBarItem.show();
  }

  public setPatrolActive(active: boolean): void {
    this._isPatrolling = active;
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
        label: '$(heart) Feed EgaleCoder Snack',
        description: 'Boost energy and restore stamina',
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
  }
}
