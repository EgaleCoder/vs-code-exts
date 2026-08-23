/**
 * EgaleCoder Aerodynamic Flight Physics Engine
 */

export interface Vector2D {
  x: number;
  y: number;
}

export interface FlightState {
  position: Vector2D;
  velocity: Vector2D;
  target: Vector2D | null;
  angle: number; // in radians
  wingFlapPhase: number; // 0 to 2*PI
  flapSpeed: number;
  isGliding: boolean;
  speed: number;
  altitude: number;
  stamina: number;
  diving: boolean;
}

export class EaglePhysics {
  public static readonly GRAVITY = 0.08;
  public static readonly DRAG = 0.985;
  public static readonly CRUISE_SPEED = 4.5;
  public static readonly MAX_DIVE_SPEED = 12.0;
  public static readonly TURN_RATE = 0.07;

  public static createInitialState(width: number, height: number): FlightState {
    return {
      position: { x: width * 0.2, y: height * 0.4 },
      velocity: { x: 3.5, y: -0.5 },
      target: null,
      angle: 0,
      wingFlapPhase: 0,
      flapSpeed: 0.15,
      isGliding: false,
      speed: 3.5,
      altitude: 1500,
      stamina: 100,
      diving: false,
    };
  }

  public static updateFlight(
    state: FlightState,
    bounds: { width: number; height: number },
    speedMultiplier: number = 1.0
  ): void {
    const baseMaxSpeed = state.diving ? this.MAX_DIVE_SPEED : this.CRUISE_SPEED * speedMultiplier;

    if (state.target) {
      // Seek target (cursor or bug)
      const dx = state.target.x - state.position.x;
      const dy = state.target.y - state.position.y;
      const dist = Math.hypot(dx, dy);

      if (dist > 15) {
        const desiredAngle = Math.atan2(dy, dx);
        // Smoothly rotate toward desired angle
        let angleDiff = desiredAngle - state.angle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;

        state.angle += angleDiff * this.TURN_RATE;

        // Accelerate in forward direction
        const accel = state.diving ? 0.35 : 0.18;
        state.velocity.x += Math.cos(state.angle) * accel;
        state.velocity.y += Math.sin(state.angle) * accel;
      } else {
        // Reached target
        state.target = null;
        state.diving = false;
      }
    } else {
      // Free cruise flight
      // Add subtle turbulence/lift
      if (Math.random() < 0.02) {
        state.velocity.y -= 0.6; // Thermal updraft
      }

      // Smooth wander angle changes
      state.angle += (Math.random() - 0.5) * 0.05;
      state.velocity.x += Math.cos(state.angle) * 0.1;
      state.velocity.y += Math.sin(state.angle) * 0.1;
    }

    // Apply drag and gravity
    state.velocity.y += this.GRAVITY * 0.5;
    state.velocity.x *= this.DRAG;
    state.velocity.y *= this.DRAG;

    // Cap velocity
    const currentSpeed = Math.hypot(state.velocity.x, state.velocity.y);
    if (currentSpeed > baseMaxSpeed) {
      state.velocity.x = (state.velocity.x / currentSpeed) * baseMaxSpeed;
      state.velocity.y = (state.velocity.y / currentSpeed) * baseMaxSpeed;
    }

    // Update position
    state.position.x += state.velocity.x;
    state.position.y += state.velocity.y;
    state.speed = currentSpeed;
    state.angle = Math.atan2(state.velocity.y, state.velocity.x);

    // Screen boundary wrapping and soft bounce
    const margin = 50;
    if (state.position.x < -margin) state.position.x = bounds.width + margin;
    if (state.position.x > bounds.width + margin) state.position.x = -margin;

    if (state.position.y < margin) {
      state.velocity.y += 0.5;
    } else if (state.position.y > bounds.height - margin) {
      state.velocity.y -= 0.8; // Avoid hitting bottom
    }

    // Wing flapping animation cycle
    // Gliding occurs when moving fast or descending gently
    if (state.velocity.y > 0 && currentSpeed > 3.0 && !state.diving) {
      state.isGliding = true;
      state.wingFlapPhase = 0; // Hold wings outstretched
    } else {
      state.isGliding = false;
      const flapRate = Math.max(0.08, currentSpeed * 0.035);
      state.wingFlapPhase = (state.wingFlapPhase + flapRate) % (Math.PI * 2);
    }

    // Altitude calculation
    state.altitude = Math.round(1000 + (bounds.height - state.position.y) * 8);
  }
}
