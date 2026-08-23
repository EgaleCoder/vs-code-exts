/**
 * EgaleCoder Flight Engine (60fps Canvas Animation & Interaction)
 */

(function () {
  const vscode = acquireVsCodeApi();
  const canvas = document.getElementById('sky-canvas');
  const ctx = canvas.getContext('2d');

  // UI Elements
  const statAlt = document.getElementById('stat-alt');
  const statSpeed = document.getElementById('stat-speed');
  const statBugs = document.getElementById('stat-bugs');
  const statStamina = document.getElementById('stat-stamina');
  const badgeMode = document.getElementById('hud-mode-badge');
  const speechBubble = document.getElementById('eagle-speech-bubble');
  const speechText = document.getElementById('speech-text');

  const btnHunt = document.getElementById('btn-hunt');
  const btnScreech = document.getElementById('btn-screech');
  const btnFeed = document.getElementById('btn-feed');
  const btnDive = document.getElementById('btn-dive');
  const btnSound = document.getElementById('btn-sound');
  const selectSkin = document.getElementById('select-skin');
  const selectTheme = document.getElementById('select-theme');

  // State
  let skin = 'golden';
  let theme = 'cyberpunk';
  let soundEnabled = true;
  let speedMultiplier = 1.0;
  let bugsCaughtCount = 0;
  let stamina = 100;

  // Flight Physics
  const eagle = {
    x: 200,
    y: 200,
    vx: 4.0,
    vy: -0.5,
    targetX: null,
    targetY: null,
    angle: 0,
    bankAngle: 0,
    wingPhase: 0,
    wingSpan: 48,
    isGliding: false,
    isDiving: false,
    speedMph: 95,
    altitudeFt: 2450,
  };

  // Systems
  const particles = [];
  const clouds = [];
  const bugs = [];
  const windLines = [];

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initClouds();
  }

  window.addEventListener('resize', resizeCanvas);
  resizeCanvas();

  // Cloud Generation
  function initClouds() {
    clouds.length = 0;
    const numClouds = Math.floor(canvas.width / 220);
    const keywords = ['TypeScript', 'Async', 'Soar', 'EgaleCoder', 'CleanCode', 'FastBuild', 'GitPush', 'ZeroBug', 'Scalable'];

    for (let i = 0; i < numClouds; i++) {
      clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height * 0.7),
        radius: 40 + Math.random() * 45,
        speed: 0.3 + Math.random() * 0.5,
        keyword: keywords[i % keywords.length],
        alpha: 0.15 + Math.random() * 0.25,
      });
    }
  }

  // Particle Generation
  function spawnParticle(x, y, type) {
    const colors = {
      golden: ['#FFD700', '#FFA500', '#FFF8DC', 'rgba(255, 215, 0, 0.6)'],
      cyber: ['#00FFFF', '#FF00FF', '#7B68EE', '#00FF7F'],
      bald: ['#FFFFFF', '#D2B48C', '#8B4513', '#FFD700'],
      phoenix: ['#FF4500', '#FF8C00', '#FFD700', '#FF1493'],
      pixel: ['#39FF14', '#00FFFF', '#FFFF00', '#FF007F'],
    };
    const palette = colors[skin] || colors.golden;
    const color = palette[Math.floor(Math.random() * palette.length)];

    particles.push({
      x,
      y,
      vx: (Math.random() - 0.5) * 2 - eagle.vx * 0.2,
      vy: (Math.random() - 0.5) * 2 - eagle.vy * 0.2,
      radius: Math.random() * 3.5 + 1.5,
      color,
      alpha: 1.0,
      life: 1.0,
      decay: 0.02 + Math.random() * 0.03,
      type: type || 'spark',
    });
  }

  function spawnBugExplosion(x, y) {
    for (let i = 0; i < 24; i++) {
      const angle = (Math.PI * 2 * i) / 24;
      const speed = Math.random() * 5 + 2;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: Math.random() * 4 + 2,
        color: '#00FF66',
        alpha: 1.0,
        life: 1.0,
        decay: 0.03,
        type: 'burst',
      });
    }
  }

  // Draw Background / Sky Theme
  function drawSky() {
    let gradient;
    if (theme === 'cyberpunk') {
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#09081E');
      gradient.addColorStop(0.5, '#1A0B2E');
      gradient.addColorStop(0.85, '#4A0E4E');
      gradient.addColorStop(1, '#8B0058');
    } else if (theme === 'sunset') {
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#2C1B4D');
      gradient.addColorStop(0.4, '#B83B5E');
      gradient.addColorStop(0.75, '#F08A5D');
      gradient.addColorStop(1, '#FFEAA7');
    } else if (theme === 'daylight') {
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#0F52BA');
      gradient.addColorStop(0.4, '#1E90FF');
      gradient.addColorStop(0.8, '#87CEEB');
      gradient.addColorStop(1, '#E0F7FA');
    } else {
      // midnight
      gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
      gradient.addColorStop(0, '#03050C');
      gradient.addColorStop(0.5, '#090E20');
      gradient.addColorStop(1, '#151D3B');
    }

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cyberpunk grid horizon
    if (theme === 'cyberpunk') {
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.15)';
      ctx.lineWidth = 1;
      const horizonY = canvas.height * 0.85;
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(canvas.width / 2, horizonY - 100);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = horizonY; y < canvas.height; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }
    }
  }

  // Draw Clouds
  function drawClouds() {
    for (const cloud of clouds) {
      cloud.x -= cloud.speed;
      if (cloud.x + cloud.radius * 2 < 0) {
        cloud.x = canvas.width + cloud.radius * 2;
        cloud.y = Math.random() * (canvas.height * 0.7);
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${cloud.alpha})`;
      ctx.beginPath();
      ctx.arc(cloud.x, cloud.y, cloud.radius, 0, Math.PI * 2);
      ctx.arc(cloud.x + cloud.radius * 0.6, cloud.y - cloud.radius * 0.2, cloud.radius * 0.7, 0, Math.PI * 2);
      ctx.arc(cloud.x - cloud.radius * 0.6, cloud.y - cloud.radius * 0.1, cloud.radius * 0.65, 0, Math.PI * 2);
      ctx.fill();

      // Cloud keyword snippet
      ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.font = '11px monospace';
      ctx.fillText(`<${cloud.keyword}/>`, cloud.x - 30, cloud.y + 4);
    }
  }

  // Draw Huntable Bugs
  function drawBugs() {
    for (let i = bugs.length - 1; i >= 0; i--) {
      const bug = bugs[i];
      if (bug.caught) continue;

      bug.x += Math.sin(Date.now() * 0.003 + i) * 0.8;
      bug.y += Math.cos(Date.now() * 0.002 + i) * 0.5;

      const pulse = 1 + Math.sin(Date.now() * 0.01 + i) * 0.2;
      const size = 18 * pulse;

      // Glow circle
      ctx.fillStyle = bug.severity === 'error' ? 'rgba(255, 59, 48, 0.3)' : 'rgba(255, 204, 0, 0.3)';
      ctx.beginPath();
      ctx.arc(bug.x, bug.y, size + 8, 0, Math.PI * 2);
      ctx.fill();

      // Bug Icon
      ctx.font = `${size}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('🐛', bug.x, bug.y);

      // Message label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '10px sans-serif';
      ctx.fillText(`${bug.filename}:${bug.line}`, bug.x, bug.y + size + 10);

      // Check collision with eagle
      const dist = Math.hypot(eagle.x - bug.x, eagle.y - bug.y);
      if (dist < 45) {
        // Eagle snatches bug!
        bug.caught = true;
        bugsCaughtCount++;
        statBugs.textContent = bugsCaughtCount;
        spawnBugExplosion(bug.x, bug.y);

        if (window.audioSynthesizer) {
          window.audioSynthesizer.playBugCatch();
        }

        showSpeech(`⚡ Snagged bug at ${bug.filename}:${bug.line}!`);
        vscode.postMessage({ command: 'bugCaught', bug });

        bugs.splice(i, 1);
      }
    }
  }

  // Draw Eagle with Skins & Flapping
  function drawEagle() {
    ctx.save();
    ctx.translate(eagle.x, eagle.y);
    ctx.rotate(eagle.angle);

    const flapOffset = Math.sin(eagle.wingPhase) * (eagle.isGliding ? 2 : 18);

    // Color definitions per skin
    let bodyColor = '#8B4513';
    let headColor = '#FFFFFF';
    let wingColor1 = '#5C2C16';
    let wingColor2 = '#D2691E';
    let beakColor = '#FFD700';
    let eyeColor = '#FFFF00';

    if (skin === 'golden') {
      bodyColor = '#D4AF37';
      headColor = '#FFD700';
      wingColor1 = '#B8860B';
      wingColor2 = '#FFA500';
      beakColor = '#FFF8DC';
      eyeColor = '#FFFFFF';
    } else if (skin === 'cyber') {
      bodyColor = '#1A1A2E';
      headColor = '#00FFFF';
      wingColor1 = '#7B68EE';
      wingColor2 = '#FF00FF';
      beakColor = '#00FFCC';
      eyeColor = '#FF0055';
    } else if (skin === 'phoenix') {
      bodyColor = '#8B0000';
      headColor = '#FF4500';
      wingColor1 = '#FF8C00';
      wingColor2 = '#FFD700';
      beakColor = '#FFFF00';
      eyeColor = '#FFFFFF';
    } else if (skin === 'pixel') {
      bodyColor = '#00AA00';
      headColor = '#39FF14';
      wingColor1 = '#006600';
      wingColor2 = '#7FFF00';
      beakColor = '#FFFF00';
      eyeColor = '#000000';
    }

    // Shadow on ground/clouds
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, 50, 30, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    // Left Wing (top in 2D side-angle)
    ctx.fillStyle = wingColor1;
    ctx.beginPath();
    ctx.moveTo(-10, -5);
    ctx.quadraticCurveTo(-15, -45 - flapOffset, 15, -35 - flapOffset * 0.8);
    ctx.quadraticCurveTo(5, -15, 10, -5);
    ctx.fill();

    // Right Wing (bottom)
    ctx.fillStyle = wingColor2;
    ctx.beginPath();
    ctx.moveTo(-10, 5);
    ctx.quadraticCurveTo(-15, 45 + flapOffset, 15, 35 + flapOffset * 0.8);
    ctx.quadraticCurveTo(5, 15, 10, 5);
    ctx.fill();

    // Feather tips
    ctx.strokeStyle = headColor;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(15, -35 - flapOffset * 0.8);
    ctx.lineTo(22, -30 - flapOffset * 0.8);
    ctx.moveTo(15, 35 + flapOffset * 0.8);
    ctx.lineTo(22, 30 + flapOffset * 0.8);
    ctx.stroke();

    // Eagle Body
    ctx.fillStyle = bodyColor;
    ctx.beginPath();
    ctx.ellipse(0, 0, 26, 12, 0, 0, Math.PI * 2);
    ctx.fill();

    // Tail Feathers
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.moveTo(-22, -6);
    ctx.lineTo(-38, -12);
    ctx.lineTo(-35, 0);
    ctx.lineTo(-38, 12);
    ctx.lineTo(-22, 6);
    ctx.closePath();
    ctx.fill();

    // Head
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.ellipse(20, -2, 12, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Beak (Curved Sharp Talon)
    ctx.fillStyle = beakColor;
    ctx.beginPath();
    ctx.moveTo(28, -5);
    ctx.lineTo(40, -1);
    ctx.lineTo(28, 4);
    ctx.closePath();
    ctx.fill();

    // Sharp Eye
    ctx.fillStyle = eyeColor;
    ctx.beginPath();
    ctx.arc(24, -4, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(25, -4, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Talons
    ctx.fillStyle = beakColor;
    ctx.beginPath();
    ctx.moveTo(-2, 10);
    ctx.lineTo(4, 16);
    ctx.lineTo(8, 10);
    ctx.fill();

    // Cyber Visor / Flame Aura glow
    if (skin === 'cyber') {
      ctx.strokeStyle = '#00FFFF';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(24, -4, 6, -0.5, 0.5);
      ctx.stroke();
    } else if (skin === 'phoenix') {
      ctx.strokeStyle = '#FF4500';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    ctx.restore();
  }

  // Draw Particle Engine
  function drawParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      p.alpha = Math.max(0, p.life);

      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }

      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1.0;
    }
  }

  // Speech bubble helper
  let speechTimeout = null;
  function showSpeech(text) {
    speechText.textContent = text;
    speechBubble.classList.remove('hidden');
    if (speechTimeout) clearTimeout(speechTimeout);
    speechTimeout = setTimeout(() => {
      speechBubble.classList.add('hidden');
    }, 4500);
  }

  // Game Loop
  let lastFlapSoundTime = 0;

  function update() {
    const maxSpeed = eagle.isDiving ? 14 * speedMultiplier : 5.5 * speedMultiplier;

    // Target Following
    if (eagle.targetX !== null && eagle.targetY !== null) {
      const dx = eagle.targetX - eagle.x;
      const dy = eagle.targetY - eagle.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 20) {
        const targetAngle = Math.atan2(dy, dx);
        let diff = targetAngle - eagle.angle;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        eagle.angle += diff * 0.08;
        const accel = eagle.isDiving ? 0.45 : 0.22;
        eagle.vx += Math.cos(eagle.angle) * accel;
        eagle.vy += Math.sin(eagle.angle) * accel;
      } else {
        eagle.targetX = null;
        eagle.targetY = null;
        eagle.isDiving = false;
      }
    } else {
      // Natural Gliding / Cruising
      eagle.angle += (Math.random() - 0.5) * 0.04;
      eagle.vx += Math.cos(eagle.angle) * 0.12;
      eagle.vy += Math.sin(eagle.angle) * 0.12;

      // Soft boundaries
      if (eagle.y < 80) eagle.vy += 0.4;
      if (eagle.y > canvas.height - 100) eagle.vy -= 0.6;
    }

    // Drag & Physics
    eagle.vx *= 0.985;
    eagle.vy *= 0.985;
    eagle.vy += 0.04; // subtle gravity

    const curSpeed = Math.hypot(eagle.vx, eagle.vy);
    if (curSpeed > maxSpeed) {
      eagle.vx = (eagle.vx / curSpeed) * maxSpeed;
      eagle.vy = (eagle.vy / curSpeed) * maxSpeed;
    }

    eagle.x += eagle.vx;
    eagle.y += eagle.vy;
    eagle.angle = Math.atan2(eagle.vy, eagle.vx);

    // Screen wrapping
    if (eagle.x < -60) eagle.x = canvas.width + 60;
    if (eagle.x > canvas.width + 60) eagle.x = -60;

    // Wing flapping
    if (eagle.vy > 0 && curSpeed > 4.0 && !eagle.isDiving) {
      eagle.isGliding = true;
      badgeMode.textContent = 'GLIDING';
      badgeMode.style.background = 'rgba(0, 255, 255, 0.2)';
    } else {
      eagle.isGliding = false;
      badgeMode.textContent = eagle.isDiving ? 'DIVING ⚡' : 'SOARING';
      badgeMode.style.background = eagle.isDiving ? 'rgba(255, 69, 0, 0.3)' : 'rgba(255, 215, 0, 0.2)';

      const flapRate = Math.max(0.1, curSpeed * 0.035);
      eagle.wingPhase = (eagle.wingPhase + flapRate) % (Math.PI * 2);

      // Sound trigger on downward wing stroke
      if (Math.sin(eagle.wingPhase) > 0.95 && Date.now() - lastFlapSoundTime > 400 && window.audioSynthesizer) {
        window.audioSynthesizer.playWingFlap();
        lastFlapSoundTime = Date.now();
      }
    }

    // Spawn flight particle trail
    if (Math.random() < 0.7) {
      spawnParticle(eagle.x - Math.cos(eagle.angle) * 20, eagle.y - Math.sin(eagle.angle) * 20);
    }

    // Update Telemetry
    eagle.speedMph = Math.round(curSpeed * 18);
    eagle.altitudeFt = Math.round(1200 + (canvas.height - eagle.y) * 9);

    statAlt.textContent = `${eagle.altitudeFt.toLocaleString()} FT`;
    statSpeed.textContent = `${eagle.speedMph} MPH`;
  }

  function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    drawSky();
    drawClouds();
    drawParticles();
    drawBugs();
    drawEagle();

    update();
    requestAnimationFrame(render);
  }

  // Interactive Cursor Commands
  canvas.addEventListener('click', (e) => {
    eagle.targetX = e.clientX;
    eagle.targetY = e.clientY;
    eagle.isDiving = true;
    spawnParticle(e.clientX, e.clientY, 'burst');
  });

  canvas.addEventListener('mousemove', (e) => {
    // If holding Shift, follow cursor
    if (e.shiftKey) {
      eagle.targetX = e.clientX;
      eagle.targetY = e.clientY;
    }
  });

  // Action Button Listeners
  btnHunt.addEventListener('click', () => {
    if (bugs.length > 0) {
      // Target first available bug
      eagle.targetX = bugs[0].x;
      eagle.targetY = bugs[0].y;
      eagle.isDiving = true;
      showSpeech('🦅 Locking onto syntax bug! Diving in 3... 2... 1!');
    } else {
      showSpeech('🦅 Searching radar for bugs in airspace...');
      vscode.postMessage({ command: 'huntBug' });
    }
  });

  btnScreech.addEventListener('click', () => {
    if (window.audioSynthesizer) {
      window.audioSynthesizer.playScreech();
    }
    showSpeech('🦅 SCREEEECH! Fly high, refactor often!');
    vscode.postMessage({ command: 'screechRequest' });
  });

  btnFeed.addEventListener('click', () => {
    stamina = 100;
    statStamina.textContent = '100%';
    spawnBugExplosion(eagle.x, eagle.y);
    showSpeech('🍗 Mmm! EgaleCoder energy restored to 100%!');
  });

  btnDive.addEventListener('click', () => {
    eagle.isDiving = true;
    eagle.targetX = canvas.width / 2;
    eagle.targetY = canvas.height - 120;
    if (window.audioSynthesizer) {
      window.audioSynthesizer.playScreech();
    }
  });

  btnSound.addEventListener('click', () => {
    if (window.audioSynthesizer) {
      soundEnabled = window.audioSynthesizer.toggleSound();
      btnSound.textContent = soundEnabled ? '🔊' : '🔇';
      vscode.postMessage({ command: 'syncConfig', key: 'egalecoder.soundEnabled', value: soundEnabled });
    }
  });

  selectSkin.addEventListener('change', (e) => {
    skin = e.target.value;
    vscode.postMessage({ command: 'syncConfig', key: 'egalecoder.eagleSkin', value: skin });
  });

  selectTheme.addEventListener('change', (e) => {
    theme = e.target.value;
    vscode.postMessage({ command: 'syncConfig', key: 'egalecoder.skyTheme', value: theme });
  });

  // Handle messages from Extension Host
  window.addEventListener('message', (event) => {
    const msg = event.data;
    switch (msg.command) {
      case 'initState':
        if (msg.skin) {
          skin = msg.skin;
          selectSkin.value = skin;
        }
        if (msg.theme) {
          theme = msg.theme;
          selectTheme.value = theme;
        }
        if (msg.sound !== undefined && window.audioSynthesizer) {
          window.audioSynthesizer.setSound(msg.sound);
          btnSound.textContent = msg.sound ? '🔊' : '🔇';
        }
        if (msg.speed) {
          const multipliers = { relaxed: 0.6, normal: 1.0, turbo: 1.8, hypersonic: 3.0 };
          speedMultiplier = multipliers[msg.speed] || 1.0;
        }
        if (msg.bugs && msg.bugs.length > 0) {
          msg.bugs.forEach((b, idx) => {
            bugs.push({
              ...b,
              x: 100 + (idx * 160) % (canvas.width - 200),
              y: 120 + Math.random() * (canvas.height - 240),
            });
          });
        }
        break;

      case 'spawnBugs':
        if (msg.bugs) {
          msg.bugs.forEach((b, idx) => {
            bugs.push({
              ...b,
              x: 100 + (idx * 160) % (canvas.width - 200),
              y: 120 + Math.random() * (canvas.height - 240),
            });
          });
          if (bugs.length > 0) {
            eagle.targetX = bugs[0].x;
            eagle.targetY = bugs[0].y;
            eagle.isDiving = true;
          }
        }
        break;

      case 'triggerScreech':
        if (window.audioSynthesizer) window.audioSynthesizer.playScreech();
        showSpeech('🦅 SCREEEECH! Code fearless, soar high!');
        break;

      case 'feed':
        stamina = 100;
        statStamina.textContent = '100%';
        spawnBugExplosion(eagle.x, eagle.y);
        showSpeech('🍗 Snack ingested! Ready for supersonic patrol!');
        break;

      case 'setSkin':
        skin = msg.skin;
        selectSkin.value = skin;
        break;

      case 'setTheme':
        theme = msg.theme;
        selectTheme.value = theme;
        break;
    }
  });

  // Notify extension host ready
  vscode.postMessage({ command: 'ready' });

  // Start Animation Loop
  requestAnimationFrame(render);
})();
