import gsap from 'gsap';
import {
  Object3D,
  Vector3,
  Quaternion,
  Scene,
  Mesh,
} from 'three';

/** World Z: flip in the plane of the hand / table (not Y, which tumbles the card edge-on). */
const DRAW_FLIP_AXIS_Z = new Vector3(0, 0, 1);

const HAND_DRAW_SCALE = 1.1;
/** Stage scale during deck→board draw flight (keep in sync with batch spread in board3dController). */
export const HAND_DRAW_STAGE_SCALE = 2.15;

/** Card mesh width in world units at scale 1 (match board-3d-config / hand service). */
const HAND_CARD_MESH_WIDTH_WORLD = 2.75;
/** Center-to-center spacing as a multiple of card width (no overlap, small gap). */
const MULTI_DRAW_CENTER_GAP_RATIO = 1.08;

/**
 * Stage scale and horizontal spacing for multi-draw so a full row fits in {@param maxRowWidthWorld} without overlap.
 */
export function getMultiDrawBatchStageLayout(
  drawCount: number,
  maxRowWidthWorld: number
): { stageScale: number; centerSpread: number } {
  if (drawCount <= 1) {
    return { stageScale: HAND_DRAW_STAGE_SCALE, centerSpread: 0 };
  }
  const denom = 1 + (drawCount - 1) * MULTI_DRAW_CENTER_GAP_RATIO;
  const maxCardWidth = maxRowWidthWorld / denom;
  const idealScale = maxCardWidth / HAND_CARD_MESH_WIDTH_WORLD;
  const stageScale = Math.min(HAND_DRAW_STAGE_SCALE, idealScale);
  const cardWidth = HAND_CARD_MESH_WIDTH_WORLD * stageScale;
  const centerSpread = MULTI_DRAW_CENTER_GAP_RATIO * cardWidth;
  return { stageScale, centerSpread };
}

/** Deck→stage: travel + flip (faster motion; dwell unchanged via {@link DRAW_DECK_TO_STAGE_PHASE_DURATION}). */
const DRAW_DECK_TO_STAGE_TRAVEL_DURATION = 0.18;
/** Stage “pop” scale — same duration so visible time on the board stays consistent. */
const DRAW_DECK_TO_STAGE_SCALE_DURATION = 0.36;
/** Total deck→stage phase before stage→hand (padding keeps dwell when travel is shorter than scale). */
const DRAW_DECK_TO_STAGE_PHASE_DURATION = 0.72;

const DRAW_STAGE_TO_HAND_TRAVEL_DURATION = 0.16;
const DRAW_STAGE_TO_HAND_SCALE_DURATION = 0.14;

/** Stage→hand when all staged cards move together (short, snappy). */
const DRAW_STAGE_TO_HAND_BURST_TRAVEL_DURATION = 0.1;
const DRAW_STAGE_TO_HAND_BURST_SCALE_DURATION = 0.08;

/** After every multi-draw card has reached the stage, hold before the shared hand flight. */
export const MULTI_DRAW_SHARED_STAGED_HOLD_SEC = 0.52;

/** Delay between starting each card’s stage→hand flight in a multi-draw burst (subtle cascade). */
export const MULTI_DRAW_STAGE_TO_HAND_STAGGER_SEC = 0.04;

/** KO: whole Pokémon + attachments fly as one unit to discard. */
const KO_DISCARD_TRAVEL_DURATION_SEC = 0.48;

/** Shorter hold during setup mulligan redraws (full row on stage). */
const MULTI_DRAW_SHARED_STAGED_HOLD_SEC_MULLIGAN = 0.22;

/** Slightly longer row hold for start-of-turn multi-draws vs mid-game. */
const MULTI_DRAW_SHARED_STAGED_HOLD_SEC_TURN_BEGIN = 0.58;

/**
 * Visual style for deck→hand flights so setup mulligans feel distinct from in-game draws.
 * - setupMulligan: faster, less dwell (opening hand / mulligan redraw during {@link GamePhase.SETUP})
 * - turnBegin: start-of-turn draws ({@link GamePhase.PLAYER_TURN} opening)
 * - default: other draws
 */
export type DrawFlightVisualPreset = 'default' | 'setupMulligan' | 'turnBegin';

export function getMultiDrawSharedHoldSec(preset: DrawFlightVisualPreset | undefined): number {
  if (preset === 'setupMulligan') {
    return MULTI_DRAW_SHARED_STAGED_HOLD_SEC_MULLIGAN;
  }
  if (preset === 'turnBegin') {
    return MULTI_DRAW_SHARED_STAGED_HOLD_SEC_TURN_BEGIN;
  }
  return MULTI_DRAW_SHARED_STAGED_HOLD_SEC;
}

function deckToStageTiming(preset: DrawFlightVisualPreset | undefined): {
  travel: number;
  scale: number;
  phaseTotal: number;
} {
  if (preset === 'setupMulligan') {
    return { travel: 0.12, scale: 0.24, phaseTotal: 0.38 };
  }
  if (preset === 'turnBegin') {
    return {
      travel: DRAW_DECK_TO_STAGE_TRAVEL_DURATION,
      scale: DRAW_DECK_TO_STAGE_SCALE_DURATION,
      phaseTotal: 0.88
    };
  }
  return {
    travel: DRAW_DECK_TO_STAGE_TRAVEL_DURATION,
    scale: DRAW_DECK_TO_STAGE_SCALE_DURATION,
    phaseTotal: DRAW_DECK_TO_STAGE_PHASE_DURATION
  };
}

function stageToHandTiming(
  preset: DrawFlightVisualPreset | undefined,
  burst: boolean
): { pos: number; scale: number } {
  if (preset === 'setupMulligan') {
    return {
      pos: burst ? DRAW_STAGE_TO_HAND_BURST_TRAVEL_DURATION : 0.12,
      scale: burst ? DRAW_STAGE_TO_HAND_BURST_SCALE_DURATION : 0.1
    };
  }
  if (preset === 'turnBegin' && !burst) {
    return { pos: 0.2, scale: 0.18 };
  }
  return {
    pos: burst ? DRAW_STAGE_TO_HAND_BURST_TRAVEL_DURATION : DRAW_STAGE_TO_HAND_TRAVEL_DURATION,
    scale: burst ? DRAW_STAGE_TO_HAND_BURST_SCALE_DURATION : DRAW_STAGE_TO_HAND_SCALE_DURATION
  };
}

export class Board3dAnimationService {
  private activeAnimations: gsap.core.Timeline[] = [];
  private hasActiveAnimationsCache: boolean = false;
  private lastAnimationCheck: number = 0;
  private animationCheckInterval: number = 50; // Check every 50ms (20fps check rate)

  /**
   * Play basic Pokemon animation (card drops from above)
   */
  playBasicAnimation(card: Object3D): Promise<void> {
    return new Promise(resolve => {
      // Start position: above board
      card.position.y = 10;
      card.rotation.x = Math.PI * 2;

      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        .to(card.position, {
          y: 0.1,
          duration: 0.6,
          ease: 'bounce.out'
        })
        .to(card.rotation, {
          x: 0,
          duration: 0.6,
          ease: 'power2.out'
        }, '<');

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Evolution animation (spin, scale, and glow) - matches 2D board: 1080deg spin, scale 1.3, ~1.5s total
   */
  evolutionAnimation(card: Object3D): Promise<void> {
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        // Rise up (0.4s)
        .to(card.position, {
          y: 2,
          duration: 0.4,
          ease: 'power2.out'
        })
        // Triple spin (1080deg = 6*PI) + scale up, overlap with rise
        .to(card.rotation, {
          y: Math.PI * 6,
          duration: 0.8,
          ease: 'power2.inOut'
        }, '<')
        .to(card.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 0.4,
          ease: 'back.out(1.7)'
        }, '<')
        // Settle back down (0.3s)
        .to(card.position, {
          y: 0.1,
          duration: 0.3,
          ease: 'power2.in'
        })
        // Return to normal scale
        .to(card.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.2
        }, '<');

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Attack motion: rise, brief hold, slam down with scale bounce.
   */
  playAttackAnimation(card: Object3D): Promise<void> {
    return new Promise(resolve => {
      const baseY = card.position.y;
      const baseScale = card.scale.x;
      const riseDelta = 0.52;
      const peakScale = baseScale * 1.3;
      const slamScale = baseScale * 0.92;
      const bounceScale = baseScale * 1.12;
      const prevRenderOrder = card.renderOrder;

      const timeline = gsap.timeline({
        onComplete: () => {
          card.position.y = baseY;
          card.scale.setScalar(baseScale);
          card.renderOrder = prevRenderOrder;
          this.removeAnimation(timeline);
          resolve();
        },
      });

      card.renderOrder = 100;

      timeline
        .to(card.position, {
          y: baseY + riseDelta,
          duration: 0.35,
          ease: 'power2.out',
        })
        .to(
          card.scale,
          {
            x: peakScale,
            y: peakScale,
            z: peakScale,
            duration: 0.35,
            ease: 'power2.out',
          },
          '<',
        )
        .to({}, { duration: 0.25 })
        .to(card.position, {
          y: baseY,
          duration: 0.15,
          ease: 'power3.in',
        })
        .to(
          card.scale,
          {
            x: slamScale,
            y: slamScale,
            z: slamScale,
            duration: 0.15,
            ease: 'power3.in',
          },
          '<',
        )
        .to(card.scale, {
          x: bounceScale,
          y: bounceScale,
          z: bounceScale,
          duration: 0.1,
          ease: 'power2.out',
        })
        .to(card.scale, {
          x: baseScale,
          y: baseScale,
          z: baseScale,
          duration: 0.15,
          ease: 'power2.out',
        });

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Hover effect (lift and scale up)
   */
  hoverCard(card: Object3D): void {
    gsap.to(card.position, {
      y: 0.5,
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(card.scale, {
      x: 1.1,
      y: 1.1,
      z: 1.1,
      duration: 0.2,
      ease: 'power2.out'
    });
  }

  /**
   * Unhover effect (return to normal)
   */
  unhoverCard(card: Object3D): void {
    gsap.to(card.position, {
      y: 0.1,
      duration: 0.2,
      ease: 'power2.in'
    });

    gsap.to(card.scale, {
      x: 1,
      y: 1,
      z: 1,
      duration: 0.2,
      ease: 'power2.in'
    });
  }

  /**
   * Card draw animation (from deck to hand)
   */
  drawCardAnimation(card: Object3D, targetPosition: { x: number; y: number; z: number }): Promise<void> {
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline.to(card.position, {
        x: targetPosition.x,
        y: targetPosition.y,
        z: targetPosition.z,
        duration: 0.5,
        ease: 'power2.inOut'
      });

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Deck → board stage: move and180° Z flip (reveal at midpoint). Card should start at deck world pose.
   */
  playDrawDeckToStage(
    card: Object3D,
    stageWorld: Vector3,
    options?: {
      onRevealFace?: () => void;
      omitPhasePad?: boolean;
      /** Multi-draw: smaller than {@link HAND_DRAW_STAGE_SCALE} so a row fits without overlap. */
      targetStageScale?: number;
      visualPreset?: DrawFlightVisualPreset;
    }
  ): Promise<void> {
    const onRevealFace = options?.onRevealFace;
    const omitPhasePad = options?.omitPhasePad === true;
    const targetScale = options?.targetStageScale ?? HAND_DRAW_STAGE_SCALE;
    const preset = options?.visualPreset;
    const { travel, scale, phaseTotal } = deckToStageTiming(preset);
    const scaleEase = preset === 'setupMulligan' ? 'power2.out' : 'back.out(1.25)';
    const q0 = new Quaternion();
    const q180 = new Quaternion().setFromAxisAngle(DRAW_FLIP_AXIS_Z, Math.PI);
    const qFlipScratch = new Quaternion();

    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      const flipOnce = { t: 0 };
      let revealApplied = false;

      timeline
        .to(card.position, {
          x: stageWorld.x,
          y: stageWorld.y,
          z: stageWorld.z,
          duration: travel,
          ease: 'power2.inOut'
        })
        .to(
          flipOnce,
          {
            t: 1,
            duration: travel,
            ease: 'power3.inOut',
            onUpdate: () => {
              qFlipScratch.slerpQuaternions(q0, q180, flipOnce.t);
              card.quaternion.copy(qFlipScratch);
              if (!revealApplied && flipOnce.t >= 0.5) {
                revealApplied = true;
                onRevealFace?.();
              }
            }
          },
          '<'
        )
        .to(
          card.scale,
          {
            x: targetScale,
            y: targetScale,
            z: targetScale,
            duration: scale,
            ease: scaleEase
          },
          '<'
        );

      const parallelEnd = Math.max(travel, scale);
      const phasePad = Math.max(0, phaseTotal - parallelEnd);
      if (!omitPhasePad && phasePad > 0) {
        timeline.to({}, { duration: phasePad });
      }

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Stage → hand slot + hand scale. Call after {@link playDrawDeckToStage}. Rotation stays until finishDrawFlight.
   */
  playDrawStageToHand(
    card: Object3D,
    handWorld: Vector3,
    options?: {
      handScale?: number;
      burst?: boolean;
      visualPreset?: DrawFlightVisualPreset;
      /** Seconds before position/scale tweens begin (e.g. multi-draw stagger). */
      delay?: number;
    }
  ): Promise<void> {
    const handScale = options?.handScale ?? HAND_DRAW_SCALE;
    const burst = options?.burst === true;
    const { pos: posDur, scale: scaleDur } = stageToHandTiming(options?.visualPreset, burst);
    const delay = options?.delay ?? 0;

    return new Promise(resolve => {
      const timeline = gsap.timeline({
        delay,
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        .to(card.position, {
          x: handWorld.x,
          y: handWorld.y,
          z: handWorld.z,
          duration: posDur,
          ease: burst ? 'power2.out' : 'power2.inOut'
        })
        .to(
          card.scale,
          {
            x: handScale,
            y: handScale,
            z: handScale,
            duration: scaleDur,
            ease: burst ? 'power2.out' : 'power2.inOut'
          },
          '<'
        );

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Full draw: deck → stage (flip/reveal) → hand slot.
   */
  async playDrawFromDeckToHand(
    card: Object3D,
    stageWorld: Vector3,
    handWorld: Vector3,
    options?: {
      handScale?: number;
      onRevealFace?: () => void;
      visualPreset?: DrawFlightVisualPreset;
    }
  ): Promise<void> {
    const preset = options?.visualPreset;
    await this.playDrawDeckToStage(card, stageWorld, {
      onRevealFace: options?.onRevealFace,
      visualPreset: preset
    });
    await this.playDrawStageToHand(card, handWorld, {
      handScale: options?.handScale,
      visualPreset: preset
    });
  }

  /**
   * Discard animation (fade out)
   */
  discardAnimation(card: Object3D): Promise<void> {
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        .to(card.rotation, {
          x: Math.PI,
          duration: 0.3,
          ease: 'power2.in'
        })
        .to(card.position, {
          y: -2,
          duration: 0.4,
          ease: 'power2.in'
        }, '<0.1');

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Animate drag start (lift and scale)
   */
  dragStartAnimation(card: Object3D): void {
    gsap.to(card.position, {
      y: card.position.y + 1.5,
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(card.scale, {
      x: 1.3, y: 1.3, z: 1.3,
      duration: 0.2,
      ease: 'power2.out'
    });

    gsap.to(card.rotation, {
      x: -0.1,
      duration: 0.2,
      ease: 'power2.out'
    });
  }

  /**
   * Animate drag end (drop)
   */
  dragEndAnimation(card: Object3D): void {
    gsap.to(card.scale, {
      x: 1, y: 1, z: 1,
      duration: 0.2,
      ease: 'power2.in'
    });

    gsap.to(card.rotation, {
      x: 0,
      duration: 0.2,
      ease: 'power2.in'
    });
  }

  /**
   * Hand card released onto the board: arc down to zone, flatten rotation, match board scale/orientation.
   * Card should already be parented to the scene with world-space position.
   */
  playHandCardDropOnBoard(
    card: Object3D,
    targetWorld: Vector3,
    options: { endScale: number; endRotationY: number }
  ): Promise<void> {
    return new Promise(resolve => {
      const midY = Math.max(card.position.y, targetWorld.y) + 0.55;
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        .to(card.position, {
          x: targetWorld.x,
          y: midY,
          z: targetWorld.z,
          duration: 0.38,
          ease: 'power2.out'
        })
        .to(
          card.rotation,
          {
            x: 0,
            y: options.endRotationY,
            z: 0,
            duration: 0.42,
            ease: 'power3.out'
          },
          '<0.02'
        )
        .to(
          card.scale,
          {
            x: options.endScale,
            y: options.endScale,
            z: options.endScale,
            duration: 0.44,
            ease: 'power2.inOut'
          },
          '<'
        )
        .to(card.position, {
          y: targetWorld.y,
          duration: 0.3,
          ease: 'bounce.out'
        });

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Trainer/item finished on supporter slot: arc to discard pile top position (same card mesh).
   */
  playTrainerResolveToDiscard(card: Object3D, targetWorld: Vector3): Promise<void> {
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline.to(card.position, {
        x: targetWorld.x,
        y: targetWorld.y,
        z: targetWorld.z,
        duration: DRAW_STAGE_TO_HAND_TRAVEL_DURATION,
        ease: 'power2.inOut'
      });

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Knock Out: move the Pokémon root (energies, tools, BREAK, and body still parented) to discard in one motion.
   */
  playKnockOutToDiscardSequence(ghostRoot: Object3D, discardWorld: Vector3): Promise<void> {
    ghostRoot.traverse((o) => {
      if (o instanceof Mesh) {
        o.renderOrder = 125;
      }
    });
    ghostRoot.renderOrder = 120;

    const travel = {
      duration: KO_DISCARD_TRAVEL_DURATION_SEC,
      ease: 'power2.inOut' as const,
    };

    return new Promise((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        },
      });

      timeline.to(ghostRoot.position, {
        x: discardWorld.x,
        y: discardWorld.y,
        z: discardWorld.z,
        ...travel,
      });

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Snap card to drop zone with bounce effect
   */
  snapToZone(card: Object3D, targetPosition: { x: number; y: number; z: number }): Promise<void> {
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        // Move to target with slight overshoot on Y
        .to(card.position, {
          x: targetPosition.x,
          y: targetPosition.y + 0.5,
          z: targetPosition.z,
          duration: 0.25,
          ease: 'power2.out'
        })
        // Settle to final position with bounce
        .to(card.position, {
          y: targetPosition.y,
          duration: 0.15,
          ease: 'bounce.out'
        })
        // Scale back to normal
        .to(card.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.2,
          ease: 'power2.out'
        }, '<')
        // Fix rotation
        .to(card.rotation, {
          x: 0,
          duration: 0.2
        }, '<');

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Invalid drop feedback - shake and return
   */
  invalidDropFeedback(card: Object3D, originalPosition: { x: number; y: number; z: number }): Promise<void> {
    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        // Shake left
        .to(card.position, {
          x: card.position.x - 0.5,
          duration: 0.05
        })
        // Shake right
        .to(card.position, {
          x: card.position.x + 1,
          duration: 0.1
        })
        // Shake left
        .to(card.position, {
          x: card.position.x - 0.5,
          duration: 0.1
        })
        // Return to original position
        .to(card.position, {
          x: originalPosition.x,
          y: originalPosition.y,
          z: originalPosition.z,
          duration: 0.3,
          ease: 'power2.out'
        })
        // Scale back to normal
        .to(card.scale, {
          x: 1, y: 1, z: 1,
          duration: 0.3,
          ease: 'power2.out'
        }, '<')
        // Fix rotation
        .to(card.rotation, {
          x: 0,
          duration: 0.3
        }, '<');

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Check if any animations are currently active
   * Uses cached value for performance - call updateAnimationState() to refresh
   */
  hasActiveAnimations(): boolean {
    // Update cache periodically instead of every call
    const currentTime = performance.now();
    if (currentTime - this.lastAnimationCheck >= this.animationCheckInterval) {
      this.updateAnimationState();
      this.lastAnimationCheck = currentTime;
    }
    return this.hasActiveAnimationsCache;
  }

  /**
   * Update the cached animation state
   * Called automatically, but can be called manually for immediate updates
   */
  private updateAnimationState(): void {
    // Filter out completed animations
    this.activeAnimations = this.activeAnimations.filter(anim => {
      return anim.isActive();
    });
    this.hasActiveAnimationsCache = this.activeAnimations.length > 0;
  }

  /**
   * Kill all active animations
   */
  killAllAnimations(): void {
    this.activeAnimations.forEach(animation => {
      animation.kill();
    });
    this.activeAnimations = [];
    this.hasActiveAnimationsCache = false;
  }

  /**
   * Remove animation from active list
   */
  private removeAnimation(timeline: gsap.core.Timeline): void {
    const index = this.activeAnimations.indexOf(timeline);
    if (index > -1) {
      this.activeAnimations.splice(index, 1);
    }
  }
}
