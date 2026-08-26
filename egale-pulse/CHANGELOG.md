# Changelog

All notable changes to the **EGALE PULSE** extension will be documented in this file.

## [0.3.0] - 2026-08-26

### 🚀 100% Functional Architecture & Clean Modular Restructure
- **Pure Functional Refactor**: Eliminated all OOP classes (`SystemMonitor`, `EgaleCodersViewProvider`) in favor of modular factory functions, pure calculations, closures, and TypeScript interfaces (`createSystemMonitor`, `createStatusBarManager`, `createDashboardPanelManager`, `createSidebarViewProvider`, `createCpuMonitor`, `createNetworkMonitor`, `getMemoryUsage`, `formatUptime`).
- **Domain-Driven Directory Structure**:
  - `src/types/`: Centralized TypeScript interfaces for metrics and telemetry states.
  - `src/telemetry/`: Individual functional modules for CPU, Memory, Network, and Uptime calculations.
  - `src/ui/`: Status Bar manager and Webview views (`dashboardHtml`, `dashboardPanel`, `sidebarView`).
  - `media/`: Segregated subdirectories for `css/`, `js/`, and `icons/`.
- **Branding Update**: Named and configured extension as **`EGALE PULSE`** with backward compatibility for existing command triggers.

## [0.2.0] - 2026-08-24

### ⚡ Simplified Real-Time System Intelligence Release
- **Official Branding**: Integrated `ECLogo.png` logo with futuristic `Orbitron` typography for **"EGALE CODERS"**.
- **Real-Time Internet Speed**: Live measurement of Mbps throughput, ms latency ping, and network status.
- **Real-Time CPU Usage**: Multi-core CPU load % calculation and animated progress bar.
- **Real-Time Memory Usage**: Live RAM used vs. total GB and % utilization.
- **Bottom-Right Corner Status Bar**: Live widget updating every 1.5s in the bottom right corner of VS Code.
- **Interactive Dashboard**: Full visual telemetry card accessible via click or `Ctrl+Alt+E`.

