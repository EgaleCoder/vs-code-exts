# 🦅 vs-code-exts — EGALE CODERS

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extensions-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Functional Architecture](https://img.shields.io/badge/Architecture-100%25%20Functional-brightgreen.svg)]()
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> Official multi-extension repository for **EGALE CODERS**. This monorepo hosts high-performance, functional VS Code extensions designed for developers.

---

## 📦 Extensions Portfolio

### 1. 🦅 [EGALE PULSE (`egale-pulse`)](./egale-pulse)
> **Real-Time System Intelligence & Telemetry for VS Code**

* **100% Functional Architecture**: Built purely with TypeScript functions, stateful closures, and interfaces (zero classes).
* **🌐 Internet Speed & Latency**: Real-time throughput in Mbps, ms ping latency, and online/offline status indicators.
* **⚡ CPU Performance**: Multi-core CPU load calculation and animated progress visualization.
* **🧠 Memory Telemetry**: Live RAM utilization (used / total GB and percentage) with health alerts.
* **📍 Corner Status Bar & Dashboard**: Bottom-right live status bar item and full glassmorphism telemetry dashboard (`Ctrl+Alt+E`).

---

## 🔮 Future Extensions Roadmap

This repository is structured to scale and host upcoming extensions built by **EGALE CODERS**, such as:
- **`egale-snippets`**: Smart developer code snippet collections & AI-assisted template generation.
- **`egale-theme`**: Cyberpunk & futuristic glassmorphism themes for Visual Studio Code.
- **`egale-tools`**: Productivity and workflow automation utilities for developer environments.

---

## 📁 Repository Structure

```
vs-code-exts/
├── .vscode/                     # Multi-extension launch & build task configurations
│   ├── launch.json              # F5 debug launcher for workspace extensions
│   └── tasks.json               # NPM compile & watch tasks
├── egale-pulse/                 # 🦅 EGALE PULSE Extension Folder
│   ├── .vscode/                 # Extension-specific tasks
│   ├── media/                   # Assets (css, js, icons)
│   │   ├── css/
│   │   ├── js/
│   │   └── icons/
│   ├── src/                     # 100% Functional source code
│   │   ├── telemetry/           # CPU, Memory, Network, and Uptime functions
│   │   ├── types/               # TypeScript interfaces & state definitions
│   │   ├── ui/                  # Status bar and Webview managers
│   │   │   └── webview/
│   │   └── extension.ts         # Extension activation entry point
│   ├── package.json             # Extension manifest & commands
│   ├── tsconfig.json            # TypeScript configuration
│   ├── CHANGELOG.md             # Version changelog
│   ├── LICENSE                  # MIT License
│   └── README.md                # Detailed extension documentation
├── LICENSE                      # Repository MIT License
└── README.md                    # Monorepo documentation & roadmap
```

---

## 🛠️ Adding a New Extension

To add a new extension to this repository:
1. Create a dedicated folder for the new extension (e.g. `vs-code-exts/my-new-extension`).
2. Follow the 100% functional architecture standard (pure functions, closures, domain-driven folders `src/types`, `src/ui`, etc.).
3. Add a debug configuration to root `.vscode/launch.json` and `.vscode/tasks.json`.
4. Document the extension in its own `README.md` and link it in the root `README.md`.

---

## 🚀 Running & Developing Extensions

1. Open this repository in VS Code:
   ```bash
   code .
   ```
2. Press **`F5`** (or select **Run EGALE PULSE Extension** in the Run & Debug view).
3. An Extension Development Host will launch with the extension active in the bottom-right status bar.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

<p align="center">
  Crafted with 🦅 by <strong>EGALE CODERS</strong>
</p>
