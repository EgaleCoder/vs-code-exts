# 🦅 vs-code-exts — EGALE CODERS

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extensions-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Functional Architecture](https://img.shields.io/badge/Architecture-100%25%20Functional-brightgreen.svg)]()
[![Latest Release](https://img.shields.io/github/v/release/EgaleCoder/vs-code-exts?color=blue&logo=github&label=Latest%20Release)](https://github.com/EgaleCoder/vs-code-exts/releases/latest)
[![Release Extension](https://github.com/EgaleCoder/vs-code-exts/actions/workflows/release.yml/badge.svg)](https://github.com/EgaleCoder/vs-code-exts/actions/workflows/release.yml)
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

#### 📸 UI Preview:
<p align="center">
  <img src="./egale-pulse/media/screenshots/statusbar-preview.png" alt="EGALE PULSE Status Bar Preview" width="550" />
  <br/>
  <img src="./egale-pulse/media/screenshots/dashboard-preview.png" alt="EGALE PULSE Dashboard Preview" width="380" />
</p>

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

## ⚡ Automated CI/CD Releases

This repository is equipped with an automated GitHub Actions pipeline ([`release.yml`](.github/workflows/release.yml)) for continuous integration and automated GitHub Releases:

1. **Automatic Release on Push**: Whenever code is pushed to `main` (affecting `egale-pulse/**`), the workflow automatically:
   - Sets up Node.js 20.
   - Installs dependencies cleanly (`npm ci`).
   - Compiles TypeScript source code (`npm run compile`).
   - Packages the extension into a `.vsix` bundle using `@vscode/vsce`.
   - Reads the extension version dynamically from [`egale-pulse/package.json`](./egale-pulse/package.json).
   - Creates a git tag and a **GitHub Release** named `EGALE PULSE v<version>`.
   - Sets the release as the **Latest Release** on GitHub.
   - Attaches the downloadable `.vsix` file to the release assets with auto-generated release notes.
2. **Manual Trigger**: The pipeline can also be run on-demand via the GitHub Actions **Run workflow** button.

### 📦 Installing the `.vsix` Extension

1. Download the latest `.vsix` file from [GitHub Releases](https://github.com/EgaleCoder/vs-code-exts/releases/latest).
2. In Visual Studio Code, open the Extensions view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Click the **`...`** (Views and More Actions) menu in the top-right corner of the Extensions panel.
4. Select **Install from VSIX...** and select the downloaded file.

---

## 📄 License

Distributed under the MIT License. See [LICENSE](./LICENSE) for details.

<p align="center">
  Crafted with 🦅 by <strong>EGALE CODERS</strong>
</p>
