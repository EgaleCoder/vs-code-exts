# 🦅 vs-code-exts — EGALE CODERS

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> A sleek, high-performance Visual Studio Code extension providing **Real-Time System Intelligence (Internet Speed, CPU Usage, and Memory Usage)** with the **EGALE CODERS** branding and bottom-right corner dashboard.

---

## 📦 Extension Overview

<div align="center">
  <img src="./media/icons/ECLogo.png" width="120" alt="EGALE CODERS Logo" />
  <h1>EGALE CODERS</h1>
  <p><strong>Real-Time System Intelligence & Telemetry for Visual Studio Code</strong></p>
</div>

---

## ✨ Features

1. 🌐 **Real-Time Internet Speed & Latency**:
   - Live download/upload throughput measured in **Mbps**.
   - Ping response latency in **ms**.
   - Connection stability and network status badge (`ONLINE` / `LATENCY HIGH` / `OFFLINE`).

2. ⚡ **Real-Time CPU Usage**:
   - Real-time total CPU load percentage (`%`).
   - Active core detection and dynamic multi-core monitor.
   - Animated visual load bar.

3. 🧠 **Real-Time Memory (RAM) Usage**:
   - Accurate RAM utilization in **GB** (`Used / Total GB`) and percentage (`%`).
   - Dynamic memory health status indicator (`HEALTHY` / `ELEVATED` / `CRITICAL`).

4. 📍 **Bottom-Right Corner Integration**:
   - **Status Bar Item**: Always-on live metrics directly in the bottom-right corner of VS Code:
     `$(pulse) EGALE CODERS: 🌐 85.4 Mbps | ⚡ 14% | 🧠 38%`
   - **Interactive Dashboard**: Click the status bar or press `Ctrl+Alt+E` to reveal the visual dashboard featuring the `ECLogo.png` logo, the stylized **EGALE CODERS** typography, and real-time live analysis cards.

---

## 📁 Simple & Clean Project Structure

```
vs-code-exts/
├── .vscode/
│   ├── launch.json              # F5 Extension Debugging configuration
│   └── tasks.json               # Build & watch tasks
├── media/
│   ├── icons/
│   │   └── ECLogo.png           # EGALE CODERS Official Logo
│   ├── dashboard.css            # Futuristic glassmorphism styling & Orbitron typography
│   └── dashboard.js             # Live metric animation & UI script
├── src/
│   ├── extension.ts             # Extension activation, status bar & webview manager
│   └── systemMonitor.ts         # Real-time CPU, RAM & Internet Speed telemetry engine
├── package.json                 # Extension manifest & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── CHANGELOG.md                 # Version changelog
├── LICENSE                      # MIT License
├── README.md                    # Git repository documentation
└── README_EXTENSION.md          # VS Code marketplace documentation
```

---

## 🚀 How to Run in VS Code

### 1. Development Mode (F5)
1. Open this repository folder in VS Code: `code .`
2. Press **`F5`** on your keyboard (or click **Run and Debug** -> **Run EGALE CODERS Extension**).
3. A new **`[Extension Development Host]`** window will open.
4. Check the bottom-right corner for the live **EGALE CODERS** telemetry bar, or press **`Ctrl+Alt+E`** to open the full dashboard!

### 2. Package to `.vsix`
```bash
# Package into .vsix
npx @vscode/vsce package
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.

<p align="center">
  Crafted with 🦅 by <strong>EGALE CODERS</strong>
</p>
