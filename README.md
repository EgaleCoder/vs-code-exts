# 🦅 vs-code-exts

[![VS Code Extension](https://img.shields.io/badge/VS%20Code-Extension-007ACC?logo=visualstudiocode&logoColor=white)](https://code.visualstudio.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Build Status](https://img.shields.io/badge/Build-Passing-brightgreen.svg)]()

> A premier monorepo collection of creative, interactive, and high-performance Visual Studio Code extensions crafted with TypeScript by **EgaleCoder**.

---

## 📦 Featured Extensions

| Extension | Version | Description | Quick Link |
| :--- | :---: | :--- | :--- |
| **🦅 EgaleCoder** | `0.1.0` | Magnificent flying eagle workspace companion & code patrol with 60fps flight physics, linter bug hunting, and synthesized audio. | [Extension Docs](./README_EXTENSION.md) |

---

## 🦅 Flagship Extension: EgaleCoder

**EgaleCoder** turns your Visual Studio Code workspace into an active airspace. Whether you need a majestic coding companion soaring in a full-canvas flight simulator, an in-editor raptor swooping along your lines of code to spot bugs, or inspirational raptor wisdom after a tough debugging session, EgaleCoder is built for you!

```
                    _--_
                   /   - \
                  /  _ -_ \
  _______________/  /    \ \_______________
 <______________   /      \   ______________>
                \  \      /  /
                 \  -_  _-  /
                  \   --   /
                   \______/
                     🦅
```

### Key Capabilities

* 🚀 **Full Workspace Sky Flight**: 60fps HTML5 Canvas flight simulation with realistic aerodynamics, banking turns, wing flaps, day/sunset/cyberpunk themes, and particle trails.
* 👁️ **In-Editor Code Soaring**: Real-time editor decorations where EgaleCoder soars through your active document, perches on comments, highlights syntax errors, and tracks your cursor.
* 🎯 **Linter Bug Hunting**: Detects diagnostics/syntax errors from your workspace and dives at supersonic speed with talons ready to eliminate them.
* 📢 **Procedural Audio Synthesizer**: Piercing eagle screeches, wing flap whooshes, and bug-catch chimes generated natively using the Web Audio API without bulky audio assets.
* 🏰 **Activity Bar Nest & Telemetry HUD**: Monitor airspeed, altitude, stamina, and caught bugs in real time.
* 🎨 **5 Custom Skins**: *Golden Eagle*, *Cyber Raptor*, *Bald Eagle*, *Phoenix Flame*, and *Pixel Eagle*.

---

## 📁 Repository Structure

```
vs-code-exts/
├── .vscode/                     # VS Code IDE launch & task configurations
│   ├── launch.json              # F5 Extension Host debugging
│   └── tasks.json               # TypeScript compile and watch tasks
├── media/                       # Webview assets and client scripts
│   ├── icons/                   # Vector SVG icons (eagle, nest, activity bar)
│   ├── scripts/                 # Webview scripts (Canvas flight engine, Web Audio synth, Nest UI)
│   │   ├── audioFx.js           # Procedural sound synthesizer
│   │   ├── flightCanvas.js      # 60fps canvas engine & particle system
│   │   └── nestUi.js            # Sidebar telemetry sync
│   └── styles/                  # Glassmorphism & dark-mode CSS styles
│       ├── flight.css           # Full flight HUD styling
│       └── nest.css             # Activity bar sidebar styling
├── src/                         # TypeScript extension source code
│   ├── extension.ts             # Extension activation & command registry
│   ├── constants.ts             # Command IDs, telemetry interfaces & defaults
│   ├── flight/
│   │   ├── editorPatrol.ts      # In-Editor line-by-line soaring controller
│   │   ├── flightPanel.ts       # Workspace Sky Flight WebviewPanel manager
│   │   └── physics.ts           # Aerodynamic physics & vector mathematics
│   ├── sidebar/
│   │   └── nestViewProvider.ts  # WebviewViewProvider for Activity Bar Nest
│   ├── telemetry/
│   │   └── statusBarManager.ts  # Status bar widget & QuickPick launcher
│   └── utils/
│       ├── bugHunter.ts         # VS Code diagnostic scanner
│       ├── quotes.ts            # Developer wisdom & screech quotes
│       └── webviewUtils.ts      # CSP Nonce & Webview URI helpers
├── package.json                 # Extension manifest, scripts & dependencies
├── tsconfig.json                # TypeScript compiler configuration
├── CHANGELOG.md                 # Release history
├── README.md                    # Git repository guide (This file)
└── README_EXTENSION.md          # Visual Studio Marketplace documentation
```

---

## 🛠️ Developer Setup & Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) `>= 18.0.0`
* [npm](https://www.npmjs.com/) `>= 9.0.0`
* [Visual Studio Code](https://code.visualstudio.com/) `>= 1.80.0`

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/EgaleCoder/vs-code-exts.git

# 2. Enter the project directory
cd vs-code-exts

# 3. Install dependencies
npm install
```

### Compiling & Watching

```bash
# Compile TypeScript to /out
npm run compile

# Run continuous watch compiler
npm run watch

# Run TypeScript linter / type check
npm run lint
```

### Debugging in VS Code

1. Open this repository in Visual Studio Code: `code .`
2. Press **`F5`** (or go to `Run and Debug` -> `Run EgaleCoder Extension`).
3. A new **Extension Development Host** window will open with EgaleCoder loaded.
4. Press `Ctrl+Alt+E` (or `Cmd+Alt+E` on macOS) to summon EgaleCoder!

---

## 📦 Packaging to `.vsix`

To package this extension into an installable `.vsix` file:

```bash
# Install vsce globally (if not already installed)
npm install -g @vscode/vsce

# Package extension
npx @vscode/vsce package
```

Then install the generated `.vsix` in VS Code via `Extensions -> ... -> Install from VSIX...`.

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingEagleFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingEagleFeature'`)
4. Push to the Branch (`git push origin feature/AmazingEagleFeature`)
5. Open a Pull Request

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

<p align="center">
  Crafted with 🦅 by <strong>EgaleCoder</strong> • Soar High and Code Fearlessly!
</p>
