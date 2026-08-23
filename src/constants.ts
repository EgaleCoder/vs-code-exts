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
} as const;

export type EagleSkin = 'golden' | 'cyber' | 'bald' | 'phoenix' | 'pixel';
export type SkyTheme = 'cyberpunk' | 'sunset' | 'daylight' | 'midnight';
export type FlightSpeed = 'relaxed' | 'normal' | 'turbo' | 'hypersonic';

export interface EagleTelemetry {
  altitude: number; // in feet (e.g. 1200 - 9500)
  speedMph: number; // in mph (e.g. 45 - 220)
  stamina: number; // 0 - 100%
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
