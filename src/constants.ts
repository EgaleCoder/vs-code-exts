/**
 * EgaleCoder Extension Constants and Configuration Keys
 */

export const EXTENSION_ID = 'egalecoder';
export const EXTENSION_NAME = 'EgaleCoder';

export const COMMANDS = {
  SUMMON: 'egalecoder.summon',
  TOGGLE_EDITOR_PATROL: 'egalecoder.toggleEditorPatrol',
  HUNT_BUGS: 'egalecoder.huntBugs',
  SCREECH: 'egalecoder.screech',
  FEED: 'egalecoder.feed',
  TOGGLE_NEST: 'egalecoder.toggleNest',
  CHANGE_SKIN: 'egalecoder.changeSkin',
  CHANGE_THEME: 'egalecoder.changeTheme',
} as const;

export const VIEWS = {
  NEST_VIEW: 'egalecoder.nestView',
} as const;

export const CONFIG_KEYS = {
  FLIGHT_SPEED: 'egalecoder.flightSpeed',
  EAGLE_SKIN: 'egalecoder.eagleSkin',
  SKY_THEME: 'egalecoder.skyTheme',
  SOUND_ENABLED: 'egalecoder.soundEnabled',
  PATROL_SPEED: 'egalecoder.editorPatrolSpeedMs',
  MOTIVATIONAL_QUOTES: 'egalecoder.motivationalQuotes',
  BATTERY_ENABLED: 'egalecoder.batteryEnabled',
  BATTERY_DRAIN_MULTIPLIER: 'egalecoder.batteryDrainMultiplier',
} as const;

export type EagleSkin = 'golden' | 'cyber' | 'bald' | 'phoenix' | 'pixel';
export type SkyTheme = 'cyberpunk' | 'sunset' | 'daylight' | 'midnight';
export type FlightSpeed = 'relaxed' | 'normal' | 'turbo' | 'hypersonic';

export interface EagleTelemetry {
  altitude: number; // in feet (e.g. 1200 - 9500)
  speedMph: number; // in mph (e.g. 45 - 220)
  stamina: number; // 0 - 100%
  battery: number; // 0 - 100% battery level
  bugsCaught: number;
  linesPatrolled: number;
  mood: string;
  skin: EagleSkin;
  theme: SkyTheme;
  patrolActive: boolean;
}

export const SPEED_MULTIPLIERS: Record<FlightSpeed, number> = {
  relaxed: 0.6,
  normal: 1.0,
  turbo: 1.8,
  hypersonic: 3.0,
};

// Battery consumption rates (% per minute)
export const BATTERY_CONSUMPTION = {
  SKY_FLIGHT: 8,      // High-performance 60fps canvas + audio synthesis
  EDITOR_PATROL: 3,   // Line-by-line soaring and editor decorations
  BUG_HUNTING: 2,     // Diagnostic scanning and dive animations
  AUDIO_EFFECTS: 1,   // Audio synthesis and sound playback
  IDLE: 0.5,          // Baseline consumption (monitoring, idle state)
} as const;

// Battery restoration amounts
export const BATTERY_RESTORATION = {
  FEED_SNACK: 20,     // Regular snack restores 20%
  FULL_RESTORE: 100,  // Full battery (used on session start)
} as const;

// Battery warning thresholds
export const BATTERY_WARNINGS = {
  CRITICAL: 5,        // Below 5% - auto-disable sky flight
  LOW: 20,            // Below 20% - show warning
} as const;
