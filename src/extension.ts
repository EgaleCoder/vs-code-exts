import * as vscode from 'vscode';
import { COMMANDS, CONFIG_KEYS, EXTENSION_NAME, EagleSkin, SkyTheme } from './constants';
import { EditorFlightPatrol } from './flight/editorPatrol';
import { FlightPanelManager } from './flight/flightPanel';
import { NestViewProvider } from './sidebar/nestViewProvider';
import { StatusBarManager } from './telemetry/statusBarManager';
import { getRandomEagleQuote } from './utils/quotes';

let editorPatrol: EditorFlightPatrol | undefined;
let statusBar: StatusBarManager | undefined;
let nestProvider: NestViewProvider | undefined;

export function activate(context: vscode.ExtensionContext): void {
  console.log(`🦅 ${EXTENSION_NAME} extension is now active! Soaring high across the workspace.`);

  // Initialize Status Bar Manager
  statusBar = new StatusBarManager();
  context.subscriptions.push(statusBar);

  // Initialize In-Editor Flight Patrol
  editorPatrol = new EditorFlightPatrol();
  context.subscriptions.push(editorPatrol);

  editorPatrol.onPatrolStateChange((isActive) => {
    statusBar?.setPatrolActive(isActive);
    updateNestTelemetry();
  });

  // Helper to trigger commands from Sidebar
  const onCommandTriggered = (cmd: string, args?: any) => {
    vscode.commands.executeCommand(cmd, args);
  };

  // Initialize Sidebar Nest View Provider
  nestProvider = new NestViewProvider(context.extensionUri, onCommandTriggered);
  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(NestViewProvider.viewType, nestProvider)
  );

  // Register Commands
  context.subscriptions.push(
    // 1. Summon Sky Flight Webview
    vscode.commands.registerCommand(COMMANDS.SUMMON, () => {
      FlightPanelManager.createOrShow(context.extensionUri);
    }),

    // 2. Toggle In-Editor Soaring
    vscode.commands.registerCommand(COMMANDS.TOGGLE_EDITOR_PATROL, () => {
      if (editorPatrol) {
        editorPatrol.toggle();
      }
    }),

    // 3. Hunt Workspace Bugs
    vscode.commands.registerCommand(COMMANDS.HUNT_BUGS, () => {
      if (FlightPanelManager.currentPanel) {
        FlightPanelManager.currentPanel.huntBugs();
        vscode.window.showInformationMessage(`🦅 ${EXTENSION_NAME}: Scenting bugs in workspace airspace! Dive initiated!`);
      } else {
        const panel = FlightPanelManager.createOrShow(context.extensionUri);
        setTimeout(() => panel.huntBugs(), 600);
      }
    }),

    // 4. Eagle Screech & Wisdom
    vscode.commands.registerCommand(COMMANDS.SCREECH, () => {
      if (FlightPanelManager.currentPanel) {
        FlightPanelManager.currentPanel.playScreech();
      }
      const quote = getRandomEagleQuote();
      vscode.window.showInformationMessage(quote);
    }),

    // 5. Feed Snack
    vscode.commands.registerCommand(COMMANDS.FEED, () => {
      if (FlightPanelManager.currentPanel) {
        FlightPanelManager.currentPanel.feedEagle();
      }
      statusBar?.incrementBugsCaught();
      updateNestTelemetry();
      vscode.window.showInformationMessage(`🦅 EgaleCoder munched a snack! Energy restored to 100%.`);
    }),

    // 6. Focus Nest Sidebar
    vscode.commands.registerCommand(COMMANDS.TOGGLE_NEST, () => {
      vscode.commands.executeCommand('workbench.view.extension.egalecoder-container');
    }),

    // 7. Change Eagle Skin
    vscode.commands.registerCommand(COMMANDS.CHANGE_SKIN, async () => {
      const skins: { label: string; value: EagleSkin; description: string }[] = [
        { label: '👑 Golden Eagle', value: 'golden', description: 'Majestic golden plumage and sunlit particles' },
        { label: '⚡ Cyber Raptor', value: 'cyber', description: 'Neon cyan/magenta cybernetic predator' },
        { label: '🦅 Bald Eagle', value: 'bald', description: 'Classic white head and fierce yellow beak' },
        { label: '🔥 Phoenix Eagle', value: 'phoenix', description: 'Blazing flames and ember sparks' },
        { label: '👾 Pixel Eagle', value: 'pixel', description: 'Retro 8-bit arcade bird' },
      ];

      const selected = await vscode.window.showQuickPick(skins, {
        placeHolder: 'Select a skin for EgaleCoder',
      });

      if (selected) {
        await vscode.workspace
          .getConfiguration()
          .update(CONFIG_KEYS.EAGLE_SKIN, selected.value, vscode.ConfigurationTarget.Global);
        FlightPanelManager.currentPanel?.changeSkin(selected.value);
        vscode.window.showInformationMessage(`🦅 Skin updated to ${selected.label}!`);
      }
    }),

    // 8. Change Sky Theme
    vscode.commands.registerCommand(COMMANDS.CHANGE_THEME, async () => {
      const themes: { label: string; value: SkyTheme; description: string }[] = [
        { label: '🌆 Cyberpunk Sunset', value: 'cyberpunk', description: 'Neon grid and synthwave horizon' },
        { label: '🌅 Golden Hour', value: 'sunset', description: 'Warm orange gradient and drifting clouds' },
        { label: '☀️ Azure Daylight', value: 'daylight', description: 'Crisp bright skies and high altitude' },
        { label: '🌌 Deep Midnight', value: 'midnight', description: 'Star-filled galaxy and nebula auroras' },
      ];

      const selected = await vscode.window.showQuickPick(themes, {
        placeHolder: 'Select an airspace environment',
      });

      if (selected) {
        await vscode.workspace
          .getConfiguration()
          .update(CONFIG_KEYS.SKY_THEME, selected.value, vscode.ConfigurationTarget.Global);
        FlightPanelManager.currentPanel?.changeTheme(selected.value);
        vscode.window.showInformationMessage(`🦅 Airspace theme changed to ${selected.label}!`);
      }
    }),

    // 9. Quick Menu Trigger
    vscode.commands.registerCommand('egalecoder.showQuickMenu', () => {
      statusBar?.showQuickMenu();
    })
  );

  // Periodic telemetry telemetry update
  const timer = setInterval(() => {
    updateNestTelemetry();
  }, 2000);

  context.subscriptions.push({
    dispose: () => clearInterval(timer),
  });
}

function updateNestTelemetry(): void {
  if (!nestProvider) return;

  const isPatrol = editorPatrol?.isActive ?? false;
  const linesCount = editorPatrol?.linesPatrolled ?? 0;
  const bugs = FlightPanelManager.currentPanel?.bugsCaught ?? 0;

  nestProvider.updateTelemetry({
    altitude: isPatrol ? 3200 : 1800,
    speedMph: isPatrol ? 120 : 65,
    stamina: 100,
    bugsCaught: bugs,
    linesPatrolled: linesCount,
    mood: isPatrol ? 'Soaring & Hunting Code' : 'Resting in Nest',
    patrolActive: isPatrol,
  });
}

export function deactivate(): void {
  if (editorPatrol) {
    editorPatrol.stop();
  }
}
