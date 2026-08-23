import * as vscode from 'vscode';

export interface HuntableBug {
  id: string;
  filename: string;
  message: string;
  line: number;
  severity: 'error' | 'warning' | 'info';
  caught: boolean;
}

export class BugHunter {
  private static bugIdCounter = 0;

  /**
   * Scan active or all workspace diagnostics for huntable bugs.
   */
  public static scanDiagnostics(): HuntableBug[] {
    const allDiagnostics = vscode.languages.getDiagnostics();
    const huntable: HuntableBug[] = [];

    for (const [uri, diagnostics] of allDiagnostics) {
      const filename = uri.path.split('/').pop() || 'workspace';
      // Filter out empty or noise
      for (const diag of diagnostics) {
        if (huntable.length >= 20) {
          break;
        }

        let severity: 'error' | 'warning' | 'info' = 'info';
        if (diag.severity === vscode.DiagnosticSeverity.Error) {
          severity = 'error';
        } else if (diag.severity === vscode.DiagnosticSeverity.Warning) {
          severity = 'warning';
        }

        huntable.push({
          id: `bug-${++this.bugIdCounter}`,
          filename,
          message: diag.message.slice(0, 60),
          line: diag.range.start.line + 1,
          severity,
          caught: false,
        });
      }
    }

    // If no real diagnostics exist, provide fun synthetic bugs to hunt!
    if (huntable.length === 0) {
      const mockBugs = [
        { msg: 'Uncaught NullPointerException in the stratosphere', sev: 'error' as const },
        { msg: 'Wild memory leak floating in the clouds', sev: 'warning' as const },
        { msg: 'Rogue semicolon spotted drifting east', sev: 'info' as const },
        { msg: 'Infinite recursion updraft detected', sev: 'error' as const },
        { msg: 'Unused import taking up airspace', sev: 'warning' as const },
        { msg: 'Legacy Callback Hell vortex ahead', sev: 'error' as const },
        { msg: 'Missing await causing altitude loss', sev: 'error' as const },
      ];

      for (let i = 0; i < 4; i++) {
        const sample = mockBugs[Math.floor(Math.random() * mockBugs.length)];
        huntable.push({
          id: `bug-${++this.bugIdCounter}`,
          filename: 'cloud.ts',
          message: sample.msg,
          line: Math.floor(Math.random() * 200) + 1,
          severity: sample.sev,
          caught: false,
        });
      }
    }

    return huntable;
  }
}
