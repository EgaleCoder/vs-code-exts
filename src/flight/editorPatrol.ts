import * as vscode from 'vscode';
import { CONFIG_KEYS, EXTENSION_NAME } from '../constants';
import { getRandomEagleQuote } from '../utils/quotes';

export class EditorFlightPatrol implements vscode.Disposable {
  private decorationType: vscode.TextEditorDecorationType | null = null;
  private perchDecorationType: vscode.TextEditorDecorationType | null = null;
  private trailDecorationType: vscode.TextEditorDecorationType | null = null;
  private intervalTimer: NodeJS.Timeout | null = null;
  private isPatrolling = false;
  private currentLine = 0;
  private targetLine = 0;
  private linesPatrolledCount = 0;
  private onPatrolStateChangeEmitter = new vscode.EventEmitter<boolean>();
  public readonly onPatrolStateChange = this.onPatrolStateChangeEmitter.event;

  constructor() {
    this.createDecorations();
  }

  private createDecorations(): void {
    // Eagle avatar decoration (soaring on the active line)
    this.decorationType = vscode.window.createTextEditorDecorationType({
      before: {
        contentText: ' 🦅 ',
        color: '#FFD700',
        fontWeight: 'bold',
      },
      rangeBehavior: vscode.DecorationRangeBehavior.ClosedClosed,
      isWholeLine: false,
      overviewRulerColor: '#FFD700',
      overviewRulerLane: vscode.OverviewRulerLane.Right,
    });

    // Trail left behind the eagle
    this.trailDecorationType = vscode.window.createTextEditorDecorationType({
      backgroundColor: 'rgba(255, 215, 0, 0.08)',
      isWholeLine: true,
    });

    // Perch icon when eagle spots a comment or function
    this.perchDecorationType = vscode.window.createTextEditorDecorationType({
      after: {
        contentText: ' ✨ [EgaleCoder Airspace]',
        color: '#DAA520',
        fontStyle: 'italic',
      },
    });
  }

  public get isActive(): boolean {
    return this.isPatrolling;
  }

  public get linesPatrolled(): number {
    return this.linesPatrolledCount;
  }

  public toggle(): boolean {
    if (this.isPatrolling) {
      this.stop();
      vscode.window.showInformationMessage(`🦅 ${EXTENSION_NAME}: In-Editor Soaring Paused.`);
      return false;
    } else {
      this.start();
      vscode.window.showInformationMessage(`🦅 ${EXTENSION_NAME}: In-Editor Code Soaring Engaged! Watch your code lines.`);
      return true;
    }
  }

  public start(): void {
    if (this.isPatrolling) return;
    this.isPatrolling = true;
    this.onPatrolStateChangeEmitter.fire(true);

    const activeEditor = vscode.window.activeTextEditor;
    if (activeEditor) {
      this.currentLine = activeEditor.selection.active.line;
    } else {
      this.currentLine = 0;
    }

    const config = vscode.workspace.getConfiguration();
    const intervalMs = config.get<number>(CONFIG_KEYS.PATROL_SPEED, 350);

    this.intervalTimer = setInterval(() => {
      this.stepFlight();
    }, intervalMs);
  }

  public stop(): void {
    if (!this.isPatrolling) return;
    this.isPatrolling = false;
    this.onPatrolStateChangeEmitter.fire(false);

    if (this.intervalTimer) {
      clearInterval(this.intervalTimer);
      this.intervalTimer = null;
    }

    this.clearDecorations();
  }

  private stepFlight(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor || editor.document.lineCount === 0) {
      return;
    }

    const doc = editor.document;
    const totalLines = doc.lineCount;

    // Pick new target if reached or randomly swoop
    if (this.currentLine === this.targetLine || Math.random() < 0.1) {
      // Find interesting lines: lines with diagnostics, comments, or functions
      const candidateLines: number[] = [];
      const startScan = Math.max(0, this.currentLine - 30);
      const endScan = Math.min(totalLines - 1, this.currentLine + 30);

      for (let i = startScan; i <= endScan; i++) {
        const text = doc.lineAt(i).text.trim();
        if (text.startsWith('//') || text.startsWith('/*') || text.includes('function') || text.includes('class') || text.includes('const') || text.includes('export')) {
          candidateLines.push(i);
        }
      }

      if (candidateLines.length > 0 && Math.random() < 0.7) {
        this.targetLine = candidateLines[Math.floor(Math.random() * candidateLines.length)];
      } else {
        this.targetLine = Math.floor(Math.random() * totalLines);
      }
    }

    // Move smoothly towards target
    if (this.currentLine < this.targetLine) {
      this.currentLine += Math.min(2, this.targetLine - this.currentLine);
    } else if (this.currentLine > this.targetLine) {
      this.currentLine -= Math.min(2, this.currentLine - this.targetLine);
    }

    this.currentLine = Math.max(0, Math.min(totalLines - 1, this.currentLine));
    this.linesPatrolledCount++;

    const line = doc.lineAt(this.currentLine);
    const eaglePos = new vscode.Position(this.currentLine, Math.min(line.text.length, 4));
    const range = new vscode.Range(eaglePos, eaglePos);

    const hoverMsg = new vscode.MarkdownString(
      `### 🦅 EgaleCoder In-Flight Patrol\n\n` +
      `* **Altitude:** ${1500 + this.currentLine * 25} ft\n` +
      `* **Airspeed:** ${85 + (this.currentLine % 30)} mph\n` +
      `* **Wisdom:** _"${getRandomEagleQuote()}"_\n\n` +
      `[Summon Sky Mode](command:egalecoder.summon) | [Hunt Bugs](command:egalecoder.huntBugs)`
    );
    hoverMsg.isTrusted = true;

    const decorationOptions: vscode.DecorationOptions = {
      range,
      hoverMessage: hoverMsg,
    };

    if (this.decorationType) {
      editor.setDecorations(this.decorationType, [decorationOptions]);
    }

    // Add trail effect (previous 3 lines)
    if (this.trailDecorationType) {
      const trailRanges: vscode.Range[] = [];
      for (let i = 1; i <= 3; i++) {
        const trailLine = this.currentLine - i;
        if (trailLine >= 0 && trailLine < totalLines) {
          trailRanges.push(doc.lineAt(trailLine).range);
        }
      }
      editor.setDecorations(this.trailDecorationType, trailRanges);
    }

    // If current line has a comment or function header, perch!
    const trimmed = line.text.trim();
    if (this.perchDecorationType) {
      if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.includes('function ') || trimmed.includes('class ')) {
        editor.setDecorations(this.perchDecorationType, [{ range: line.range }]);
      } else {
        editor.setDecorations(this.perchDecorationType, []);
      }
    }
  }

  public clearDecorations(): void {
    const editor = vscode.window.activeTextEditor;
    if (!editor) return;

    if (this.decorationType) editor.setDecorations(this.decorationType, []);
    if (this.trailDecorationType) editor.setDecorations(this.trailDecorationType, []);
    if (this.perchDecorationType) editor.setDecorations(this.perchDecorationType, []);
  }

  public dispose(): void {
    this.stop();
    this.decorationType?.dispose();
    this.trailDecorationType?.dispose();
    this.perchDecorationType?.dispose();
    this.onPatrolStateChangeEmitter.dispose();
  }
}
