import * as vscode from 'vscode';
import { CONFIG_KEYS } from '../constants';

export interface BatteryStats {
  currentLevel: number; // 0-100%
  consumption: {
    skyFlight: number; // consumption rate per minute
    editorPatrol: number;
    bugHunting: number;
    audioEffects: number;
    idle: number; // baseline consumption
  };
  totalTimeActive: number; // in minutes
  lastUpdated: number; // timestamp
}

export class BatteryManager implements vscode.Disposable {
  private _batteryLevel: number = 100;
  private _consumption: BatteryStats['consumption'] = {
    skyFlight: 8,      // 8% per minute (high performance canvas + audio)
    editorPatrol: 3,   // 3% per minute (lightweight line-by-line soaring)
    bugHunting: 2,     // 2% per minute (diagnostic scanning)
    audioEffects: 1,   // 1% per minute (audio synthesis)
    idle: 0.5,         // 0.5% per minute (background monitoring)
  };
  private _batteryInterval: NodeJS.Timeout | undefined;
  private _activeFeatures: Set<string> = new Set();
  private _totalTimeActive: number = 0;
  private _disposables: vscode.Disposable[] = [];
  private _listeners: ((stats: BatteryStats) => void)[] = [];

  constructor() {
    this._loadBatteryState();
    this._startBatteryDrain();
  }

  /**
   * Register a feature as active to contribute to battery drain
   */
  public activateFeature(featureName: string): void {
    this._activeFeatures.add(featureName);
  }

  /**
   * Deactivate a feature to stop its battery contribution
   */
  public deactivateFeature(featureName: string): void {
    this._activeFeatures.delete(featureName);
  }

  /**
   * Restore battery when eagle is fed
   */
  public restoreBattery(amount: number = 20): void {
    this._batteryLevel = Math.min(100, this._batteryLevel + amount);
    this._notifyListeners();
  }

  /**
   * Get current battery statistics
   */
  public getStats(): BatteryStats {
    return {
      currentLevel: this._batteryLevel,
      consumption: { ...this._consumption },
      totalTimeActive: this._totalTimeActive,
      lastUpdated: Date.now(),
    };
  }

  /**
   * Calculate current drain rate based on active features
   */
  private _calculateDrainRate(): number {
    let drainRate = this._consumption.idle; // baseline

    if (this._activeFeatures.has('skyFlight')) {
      drainRate += this._consumption.skyFlight;
    }
    if (this._activeFeatures.has('editorPatrol')) {
      drainRate += this._consumption.editorPatrol;
    }
    if (this._activeFeatures.has('bugHunting')) {
      drainRate += this._consumption.bugHunting;
    }
    if (this._activeFeatures.has('audioEffects')) {
      drainRate += this._consumption.audioEffects;
    }

    return drainRate;
  }

  /**
   * Start the battery drain timer (updates every 30 seconds)
   */
  private _startBatteryDrain(): void {
    this._batteryInterval = setInterval(() => {
      const drainRate = this._calculateDrainRate();
      // Drain rate is per minute, so we divide by 2 since interval is every 30 seconds
      const drain = (drainRate / 2) / 100;

      this._batteryLevel = Math.max(0, this._batteryLevel - drain);
      this._totalTimeActive += 0.5; // add 30 seconds

      // Auto-disable sky flight if battery critical
      if (this._batteryLevel < 5 && this._activeFeatures.has('skyFlight')) {
        this.deactivateFeature('skyFlight');
        vscode.window.showWarningMessage(
          '⚡ EgaleCoder: Battery critically low! Sky Flight disabled to preserve energy.'
        );
      }

      // Warning at 20%
      if (this._batteryLevel <= 20 && this._batteryLevel > 19.5) {
        vscode.window.showWarningMessage(
          `⚠️ EgaleCoder: Battery low (${Math.round(this._batteryLevel)}%). Feed a snack to restore energy!`
        );
      }

      this._notifyListeners();
      this._saveBatteryState();
    }, 30000); // Update every 30 seconds
  }

  /**
   * Subscribe to battery changes
   */
  public onBatteryChange(listener: (stats: BatteryStats) => void): vscode.Disposable {
    this._listeners.push(listener);
    return {
      dispose: () => {
        const index = this._listeners.indexOf(listener);
        if (index >= 0) {
          this._listeners.splice(index, 1);
        }
      },
    };
  }

  /**
   * Notify all listeners of battery state change
   */
  private _notifyListeners(): void {
    const stats = this.getStats();
    this._listeners.forEach((listener) => listener(stats));
  }

  /**
   * Save battery state to workspace storage
   */
  private _saveBatteryState(): void {
    // Battery state is ephemeral per session; could be extended to memento storage
    // for now we'll let it reset on extension reload
  }

  /**
   * Load battery state from storage
   */
  private _loadBatteryState(): void {
    // Initialize with full battery; could restore from memento if needed
    this._batteryLevel = 100;
    this._totalTimeActive = 0;
  }

  public dispose(): void {
    if (this._batteryInterval) {
      clearInterval(this._batteryInterval);
    }
    this._listeners = [];
    this._disposables.forEach((d) => d.dispose());
  }
}
