import gsap from 'gsap';
import {
  Object3D,
  Vector3,
  Quaternion,
  Scene,
  Mesh,
  PlaneGeometry,
  MeshBasicMaterial,
  DoubleSide,
  Texture,
} from 'three';
import type { Board3dCard } from '../board-3d-card';
import { CARD_HEIGHT } from '../board-3d-overlay-layout';
import { energyIconLocalPosition, ENERGY_SPRITE_HEIGHT } from '../board-3d-energy-sprite';

/** World Z: flip in the plane of the hand / table (not Y, which tumbles the card edge-on). */
const DRAW_FLIP_AXIS_Z = new Vector3(0, 0, 1);

const HAND_DRAW_SCALE = 1.1;
/** Stage scale during deck→board draw flight (keep in sync with batch spread in board3dController). */
export const HAND_DRAW_STAGE_SCALE = 2.15;

/** Total duration (seconds) of {@link Board3dAnimationService.playAttackAnimation}; keep in sync with server attack WaitPrompt. */
export const BOARD3D_ATTACK_ANIMATION_DURATION_SEC = 1.35;

/** Total duration (seconds) of {@link Board3dAnimationService.playAbilityActivationAnimation}. */
export const BOARD3D_ABILITY_ANIMATION_DURATION_SEC = 0.9;

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
  private activeAbilityTimeline: gsap.core.Timeline | null = null;
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
   * Evolution: strong vertical lift on world Y, fast spin on group Z, constant slot scale (no scale pulse).
   * Full white overlay from frame one; opacity fades to 0 while the card lowers back into its slot.
   */
  evolutionAnimation(card: Object3D): Promise<void> {
    return new Promise(resolve => {
      const easeAngularBoard = 'cubic-bezier(0.4, 0, 0.1, 1)';
      const totalDuration = 1.5;
      const peakAt = 0.6;
      const settleStart = 0.63;
      const settleDuration = 0.195;
      const holdPad = totalDuration - (peakAt + settleDuration);

      const baseY = card.position.y;
      const startRotZ = card.rotation.z;
      /** Full rotations about Z during rise phase (10π rad = 5 turns). */
      const evolutionSpinZRad = Math.PI * 10;
      /** World Y lift at peak (large arc above the slot). */
      const peakDeltaY = 5.5;
      const peakY = baseY + peakDeltaY;
      const prevRenderOrder = card.renderOrder;

      const board3dCard = card.userData.board3dCard as Board3dCard | undefined;
      const evolutionFlashMeshes: Mesh[] = [];
      let flashMat: MeshBasicMaterial | null = null;
      if (board3dCard) {
        const geomFront = new PlaneGeometry(2.5, 3.5);
        const geomBack = new PlaneGeometry(2.5, 3.5);
        flashMat = new MeshBasicMaterial({
          color: 0xffffff,
          transparent: true,
          opacity: 0,
          depthWrite: false,
          depthTest: true,
        });
        const meshFront = new Mesh(geomFront, flashMat);
        meshFront.renderOrder = 12;
        meshFront.position.set(0, 0, 0.025);

        const meshBack = new Mesh(geomBack, flashMat);
        meshBack.renderOrder = 12;
        meshBack.rotation.y = Math.PI;
        meshBack.position.set(0, 0, -0.025);

        const cardMesh = board3dCard.getMesh();
        cardMesh.add(meshFront);
        cardMesh.add(meshBack);
        evolutionFlashMeshes.push(meshFront, meshBack);
        flashMat.opacity = 1;
      }

      const disposeFlash = (): void => {
        for (const m of evolutionFlashMeshes) {
          m.parent?.remove(m);
          m.geometry.dispose();
        }
        evolutionFlashMeshes.length = 0;
        flashMat?.dispose();
        flashMat = null;
      };

      const timeline = gsap.timeline({
        onComplete: () => {
          disposeFlash();
          card.position.y = baseY;
          card.rotation.z = startRotZ;
          card.renderOrder = prevRenderOrder;
          this.removeAnimation(timeline);
          resolve();
        }
      });

      card.renderOrder = 1000;

      timeline
        .to(card.position, {
          y: peakY,
          duration: peakAt,
          ease: easeAngularBoard,
        }, 0)
        .to(
          card.rotation,
          {
            z: startRotZ + evolutionSpinZRad,
            duration: peakAt,
            ease: easeAngularBoard,
          },
          0,
        );

      if (flashMat) {
        timeline.to(flashMat, {
          opacity: 0,
          duration: settleDuration,
          ease: easeAngularBoard,
        }, settleStart);
      }

      timeline
        .to(
          card.position,
          {
            y: baseY,
            duration: settleDuration,
            ease: easeAngularBoard,
          },
          settleStart,
        );

      if (holdPad > 0) {
        timeline.to({}, { duration: holdPad }, settleStart + settleDuration);
      }

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Attack motion: same keyframe proportions as Angular `board-card.component.scss` `@keyframes attackAnimation`,
   * stretched to {@link BOARD3D_ATTACK_ANIMATION_DURATION_SEC}, `cubic-bezier(0.4, 0, 0.1, 1)`.
   */
  playAttackAnimation(card: Object3D): Promise<void> {
    return new Promise(resolve => {
      const easeAttack = 'cubic-bezier(0.4, 0, 0.1, 1)';
      const totalDuration = BOARD3D_ATTACK_ANIMATION_DURATION_SEC;
      /** Segment lengths (fractions of total match SCSS keyframe stops). */
      const d01 = 0.35 * totalDuration;
      const d12 = 0.25 * totalDuration;
      const d23 = 0.15 * totalDuration;
      const d34 = 0.10 * totalDuration;
      const d45 = 0.15 * totalDuration;

      const baseY = card.position.y;
      const baseScale = card.scale.x;
      /** Ref: variables.scss — card max 100px wide, $card-aspect-ratio 1.37; Angular uses -30px on Y. */
      const riseDelta = (30 / (100 * 1.37)) * 3.5;
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

      const t60 = d01 + d12;
      const t75 = t60 + d23;
      const t85 = t75 + d34;

      timeline.to(card.position, { y: baseY + riseDelta, duration: d01, ease: easeAttack }, 0);
      timeline.to(
        card.scale,
        { x: peakScale, y: peakScale, z: peakScale, duration: d01, ease: easeAttack },
        0,
      );
      timeline.to({}, { duration: d12 }, d01);
      timeline.to(card.position, { y: baseY, duration: d23, ease: easeAttack }, t60);
      timeline.to(
        card.scale,
        { x: slamScale, y: slamScale, z: slamScale, duration: d23, ease: easeAttack },
        t60,
      );
      timeline.to(
        card.scale,
        { x: bounceScale, y: bounceScale, z: bounceScale, duration: d34, ease: easeAttack },
        t75,
      );
      timeline.to(
        card.scale,
        { x: baseScale, y: baseScale, z: baseScale, duration: d45, ease: easeAttack },
        t85,
      );

      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /**
   * Ability activation timing: lift render order for the spotlight cutout, then hold for the DOM overlay duration.
   */
  playAbilityActivationAnimation(card: Object3D): Promise<void> {
    return new Promise(resolve => {
      if (this.activeAbilityTimeline) {
        this.activeAbilityTimeline.kill();
        this.activeAbilityTimeline = null;
      }

      const prevRenderOrder = card.renderOrder;
      card.renderOrder = 100;

      const timeline = gsap.timeline({
        onComplete: () => {
          card.renderOrder = prevRenderOrder;
          this.activeAbilityTimeline = null;
          this.removeAnimation(timeline);
          resolve();
        },
        onKill: () => {
          card.renderOrder = prevRenderOrder;
          this.activeAbilityTimeline = null;
        },
      });

      timeline.to({}, { duration: BOARD3D_ABILITY_ANIMATION_DURATION_SEC });

      this.activeAbilityTimeline = timeline;
      this.activeAnimations.push(timeline);
      this.updateAnimationState();
    });
  }

  /** Wall-clock wait used when the board mesh is not ready; matches {@link BOARD3D_ABILITY_ANIMATION_DURATION_SEC}. */
  createAbilityActivationFallbackWait(): () => Promise<void> {
    return () =>
      new Promise((resolve) => {
        window.setTimeout(resolve, BOARD3D_ABILITY_ANIMATION_DURATION_SEC * 1000);
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
   * Energy from hand: arc onto the host Pokémon, then shrink/warp into the bottom energy icon slot.
   */
  playEnergyAttachToPokemon(
    flyingCard: Board3dCard,
    hostBoardCard: Board3dCard,
    energySlotIndex: number,
    energyIconTexture: Texture,
  ): Promise<void> {
    const cardGroup = flyingCard.getGroup();
    const overlayAnchor = hostBoardCard.getOverlayAnchor();
    const slotLocal = energyIconLocalPosition(energySlotIndex);
    const iconScale = ENERGY_SPRITE_HEIGHT / CARD_HEIGHT;
    const morphDuration = 0.48;
    /** When scale is nearly at icon size: snap icon in and drop the card mesh. */
    const handoffAt = morphDuration * 0.76;
    const iconSnapDuration = 0.07;

    flyingCard.setOutline(false);
    flyingCard.setHolo(null);

    const cardMesh = flyingCard.getMesh();

    // Unlit overlay crossfade (matches energy icons) — avoids a hard swap onto lit card material (reads black).
    const iconTex = energyIconTexture.clone();
    iconTex.repeat.x = -1;
    iconTex.offset.x = 1;
    const iconMat = new MeshBasicMaterial({
      map: iconTex,
      transparent: true,
      opacity: 0,
      side: DoubleSide,
      alphaTest: 0.05,
      depthWrite: false,
    });
    const iconPlane = new Mesh(new PlaneGeometry(2.5, 3.5), iconMat);
    iconPlane.position.set(0, 0, 0.015);
    iconPlane.renderOrder = 11;
    cardMesh.add(iconPlane);

    // Reparent immediately so motion goes straight into the icon slot (no hover beat).
    overlayAnchor.attach(cardGroup);

    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          iconPlane.geometry.dispose();
          iconMat.dispose();
          iconTex.dispose();
          this.removeAnimation(timeline);
          resolve();
        },
      });

      timeline
        .to(cardGroup.position, {
          x: slotLocal.x,
          y: slotLocal.y,
          z: slotLocal.z,
          duration: morphDuration,
          ease: 'power3.inOut',
        })
        .to(
          cardGroup.scale,
          {
            x: iconScale,
            y: iconScale,
            z: iconScale,
            duration: morphDuration,
            ease: 'power3.inOut',
          },
          '<',
        )
        .to(
          iconMat,
          {
            opacity: 1,
            duration: iconSnapDuration,
            ease: 'power2.out',
          },
          handoffAt - iconSnapDuration,
        );

      timeline.add(() => {
        cardGroup.attach(iconPlane);
        cardMesh.visible = false;
      }, handoffAt);

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
    if (this.activeAbilityTimeline) {
      this.activeAbilityTimeline.kill();
      this.activeAbilityTimeline = null;
    }
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
