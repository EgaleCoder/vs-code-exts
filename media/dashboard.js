/**
 * EGALE CODERS Real-Time Dashboard UI Script
 */

(function () {
  // DOM Elements
  const valNetSpeed = document.getElementById('val-net-speed');
  const valNetPing = document.getElementById('val-net-ping');
  const badgeNet = document.getElementById('badge-net');
  const barNet = document.getElementById('bar-net');

  const valCpu = document.getElementById('val-cpu');
  const valCores = document.getElementById('val-cores');
  const badgeCpu = document.getElementById('badge-cpu');
  const barCpu = document.getElementById('bar-cpu');

  const valMem = document.getElementById('val-mem');
  const valMemDetail = document.getElementById('val-mem-detail');
  const badgeMem = document.getElementById('badge-mem');
  const barMem = document.getElementById('bar-mem');

  const infoCpuModel = document.getElementById('info-cpu-model');
  const infoUptime = document.getElementById('info-uptime');

  // Handle messages from Extension Host
  window.addEventListener('message', (event) => {
    const msg = event.data;
    if (msg.type === 'updateMetrics') {
      const data = msg.data;

      // 1. Internet Speed & Latency
      if (valNetSpeed) valNetSpeed.textContent = data.internetSpeedMbps.toFixed(1);
      if (valNetPing) valNetPing.textContent = `${data.networkLatencyMs} ms`;
      if (badgeNet) {
        badgeNet.textContent = data.networkStatus;
        badgeNet.style.color = data.networkStatus === 'ONLINE' ? '#39ff14' : '#ff4500';
        badgeNet.style.borderColor = data.networkStatus === 'ONLINE' ? 'rgba(57, 255, 20, 0.3)' : 'rgba(255, 69, 0, 0.4)';
      }
      if (barNet) {
        // Map 0 - 150 Mbps to 0 - 100%
        const netPercent = Math.min(100, Math.max(10, Math.round((data.internetSpeedMbps / 150) * 100)));
        barNet.style.width = `${netPercent}%`;
      }

      // 2. CPU Usage
      if (valCpu) valCpu.textContent = data.cpuUsagePercent;
      if (valCores) valCores.textContent = `${data.cpuCores} Cores`;
      if (badgeCpu) {
        if (data.cpuUsagePercent > 80) {
          badgeCpu.textContent = 'HIGH';
          badgeCpu.style.color = '#ff4500';
        } else if (data.cpuUsagePercent > 45) {
          badgeCpu.textContent = 'BUSY';
          badgeCpu.style.color = '#ffd700';
        } else {
          badgeCpu.textContent = 'NORMAL';
          badgeCpu.style.color = '#39ff14';
        }
      }
      if (barCpu) {
        barCpu.style.width = `${data.cpuUsagePercent}%`;
      }

      // 3. Memory Usage
      if (valMem) valMem.textContent = data.memoryUsagePercent;
      if (valMemDetail) valMemDetail.textContent = `${data.memoryUsedGB} / ${data.memoryTotalGB} GB`;
      if (badgeMem) {
        if (data.memoryUsagePercent > 85) {
          badgeMem.textContent = 'CRITICAL';
          badgeMem.style.color = '#ff4500';
        } else if (data.memoryUsagePercent > 65) {
          badgeMem.textContent = 'ELEVATED';
          badgeMem.style.color = '#ffd700';
        } else {
          badgeMem.textContent = 'HEALTHY';
          badgeMem.style.color = '#39ff14';
        }
      }
      if (barMem) {
        barMem.style.width = `${data.memoryUsagePercent}%`;
      }

      // 4. Footer Info
      if (infoCpuModel) infoCpuModel.textContent = data.cpuModel.split(' ')[0] || 'CPU';
      if (infoUptime) infoUptime.textContent = `UP: ${data.uptimeFormatted}`;
    }
  });
})();
