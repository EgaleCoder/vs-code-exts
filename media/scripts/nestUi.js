/**
 * EgaleCoder Sidebar Nest UI Script
 */

(function () {
  const vscode = acquireVsCodeApi();

  const nestAlt = document.getElementById('nest-alt');
  const nestSpeed = document.getElementById('nest-speed');
  const nestBugs = document.getElementById('nest-bugs');
  const nestLines = document.getElementById('nest-lines');
  const staminaPct = document.getElementById('stamina-pct');
  const staminaFill = document.getElementById('stamina-fill');
  const mascotMood = document.getElementById('mascot-mood');
  const mascotIcon = document.getElementById('mascot-icon');
  const patrolBtnText = document.getElementById('patrol-btn-text');

  const btnLaunchSky = document.getElementById('btn-launch-sky');
  const btnTogglePatrol = document.getElementById('btn-toggle-patrol');
  const btnHunt = document.getElementById('btn-hunt');
  const btnScreech = document.getElementById('btn-screech');
  const btnFeed = document.getElementById('btn-feed');
  const skinSelect = document.getElementById('nest-skin-select');
  const themeSelect = document.getElementById('nest-theme-select');

  // Button Listeners
  btnLaunchSky?.addEventListener('click', () => {
    vscode.postMessage({ type: 'action', command: 'egalecoder.summon' });
  });

  btnTogglePatrol?.addEventListener('click', () => {
    vscode.postMessage({ type: 'action', command: 'egalecoder.toggleEditorPatrol' });
  });

  btnHunt?.addEventListener('click', () => {
    vscode.postMessage({ type: 'action', command: 'egalecoder.huntBugs' });
  });

  btnScreech?.addEventListener('click', () => {
    vscode.postMessage({ type: 'action', command: 'egalecoder.screech' });
  });

  btnFeed?.addEventListener('click', () => {
    vscode.postMessage({ type: 'action', command: 'egalecoder.feed' });
  });

  skinSelect?.addEventListener('change', (e) => {
    vscode.postMessage({ type: 'changeSkin', skin: e.target.value });
  });

  themeSelect?.addEventListener('change', (e) => {
    vscode.postMessage({ type: 'changeTheme', theme: e.target.value });
  });

  // Handle messages from Extension Host
  window.addEventListener('message', (event) => {
    const data = event.data;
    if (data.type === 'updateTelemetry') {
      if (nestAlt) nestAlt.textContent = `${data.altitude.toLocaleString()} ft`;
      if (nestSpeed) nestSpeed.textContent = `${data.speedMph} mph`;
      if (nestBugs) nestBugs.textContent = data.bugsCaught;
      if (nestLines) nestLines.textContent = data.linesPatrolled;
      if (staminaPct) staminaPct.textContent = `${data.stamina}%`;
      if (staminaFill) staminaFill.style.width = `${data.stamina}%`;
      if (mascotMood) mascotMood.textContent = `Status: ${data.mood}`;

      if (patrolBtnText) {
        patrolBtnText.textContent = data.patrolActive ? 'Pause In-Editor Soaring' : 'Start In-Editor Soaring';
      }

      if (data.patrolActive) {
        mascotIcon?.classList.add('soaring-anim');
      } else {
        mascotIcon?.classList.remove('soaring-anim');
      }
    }
  });
})();
