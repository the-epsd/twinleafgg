import gsap from 'gsap';
import {
  Matrix4,
  Object3D,
  PerspectiveCamera,
  Quaternion,
  Scene,
  Vector3,
} from 'three';

/**
 * When false, board card clicks use the regular {@link CardInfoPopup} modal.
 * 3D inspect code remains in place for a later re-enable.
 */
export const BOARD3D_CARD_INFO_INSPECT_ENABLED = false;

/**
 * PTCGO-like inspect: ~40–45% viewport height, right third, mild tip/yaw/roll.
 * Board cards are typically scale ~1–1.5 at rest.
 */
export const CARD_INSPECT_SCALE = 2.15;

const ENTER_DURATION_SEC = 0.38;
const EXIT_DURATION_SEC = 0.32;

/** Camera-space placement: forward / right / up from the camera. */
const INSPECT_CAM_FORWARD = 24;
const INSPECT_CAM_RIGHT = 5.2;
const INSPECT_CAM_UP = 0.15;

/**
 * Local euler offsets after camera-facing upright base (radians).
 * Slightly horizontal lean; left edge back; mild clockwise roll.
 */
const INSPECT_TIP_BACK = -0.55;
/** Positive around card-up (-Z) puts the left edge farther (right edge nearer). */
const INSPECT_YAW = -0.28;
/** Negative around face (+Y) = clockwise on screen. */
const INSPECT_ROLL = -0.14;

type InspectSnapshot = {
  parent: Object3D | null;
  position: Vector3;
  quaternion: Quaternion;
  scale: Vector3;
};

/**
 * Animates a board/hand card into a camera-relative inspect pose and back.
 * Damage / energy overlays ride along via the card group's overlayAnchor.
 */
export class Board3dCardInspectService {
  private inspectedCard: Object3D | null = null;
  private snapshot: InspectSnapshot | null = null;
  private activeTween: gsap.core.Timeline | null = null;
  private enterGeneration = 0;

  private readonly scratchDir = new Vector3();
  private readonly scratchRight = new Vector3();
  private readonly scratchUp = new Vector3();
  private readonly scratchPos = new Vector3();
  private readonly scratchQuat = new Quaternion();
  private readonly scratchMatrix = new Matrix4();
  private readonly scratchX = new Vector3();
  private readonly scratchY = new Vector3();
  private readonly scratchZ = new Vector3();
  private readonly localRot = new Quaternion();

  isInspecting(): boolean {
    return this.inspectedCard != null;
  }

  getInspectedCard(): Object3D | null {
    return this.inspectedCard;
  }

  /** Mesh id used by state sync (`userData.cardId`). */
  getInspectedCardId(): string | null {
    const id = this.inspectedCard?.userData?.cardId;
    return typeof id === 'string' ? id : null;
  }

  /**
   * Lift {@param card} into the inspect pose. If another card is already inspecting, exits it first.
   */
  async enterInspect(
    card: Object3D,
    scene: Scene,
    camera: PerspectiveCamera,
  ): Promise<void> {
    if (this.inspectedCard === card && this.snapshot) {
      return;
    }
    if (this.inspectedCard && this.inspectedCard !== card) {
      await this.exitInspect();
    }

    const gen = ++this.enterGeneration;
    this.killActiveTween();

    gsap.killTweensOf(card.position);
    gsap.killTweensOf(card.rotation);
    gsap.killTweensOf(card.quaternion);
    gsap.killTweensOf(card.scale);

    this.snapshot = {
      parent: card.parent,
      position: card.position.clone(),
      quaternion: card.quaternion.clone(),
      scale: card.scale.clone(),
    };
    this.inspectedCard = card;
    card.userData.inspecting = true;

    // World-space flight root so hand / zone parents do not flatten the motion.
    scene.attach(card);

    this.computeInspectPose(camera, this.scratchPos, this.scratchQuat);

    await new Promise<void>((resolve) => {
      if (gen !== this.enterGeneration) {
        resolve();
        return;
      }
      const timeline = gsap.timeline({
        onComplete: () => {
          if (this.activeTween === timeline) {
            this.activeTween = null;
          }
          resolve();
        },
      });
      this.activeTween = timeline;
      timeline.to(
        card.position,
        {
          x: this.scratchPos.x,
          y: this.scratchPos.y,
          z: this.scratchPos.z,
          duration: ENTER_DURATION_SEC,
          ease: 'power2.out',
        },
        0,
      );
      const startQuat = card.quaternion.clone();
      const endQuat = this.scratchQuat.clone();
      const qProgress = { t: 0 };
      timeline.to(
        qProgress,
        {
          t: 1,
          duration: ENTER_DURATION_SEC,
          ease: 'power2.out',
          onUpdate: () => {
            card.quaternion.slerpQuaternions(startQuat, endQuat, qProgress.t);
          },
        },
        0,
      );
      timeline.to(
        card.scale,
        {
          x: CARD_INSPECT_SCALE,
          y: CARD_INSPECT_SCALE,
          z: CARD_INSPECT_SCALE,
          duration: ENTER_DURATION_SEC,
          ease: 'power2.out',
        },
        0,
      );
    });
  }

  /** Reverse to the rest pose and restore the original parent. */
  async exitInspect(): Promise<void> {
    this.enterGeneration++;
    const card = this.inspectedCard;
    const snap = this.snapshot;
    if (!card || !snap) {
      this.clearState();
      return;
    }

    this.killActiveTween();
    gsap.killTweensOf(card.position);
    gsap.killTweensOf(card.rotation);
    gsap.killTweensOf(card.quaternion);
    gsap.killTweensOf(card.scale);

    await new Promise<void>((resolve) => {
      const timeline = gsap.timeline({
        onComplete: () => {
          if (this.activeTween === timeline) {
            this.activeTween = null;
          }
          if (snap.parent) {
            snap.parent.attach(card);
          }
          card.position.copy(snap.position);
          card.quaternion.copy(snap.quaternion);
          card.scale.copy(snap.scale);
          card.userData.inspecting = false;
          this.clearState();
          resolve();
        },
      });
      this.activeTween = timeline;

      // Animate in current (scene) parent toward the rest world pose, then reattach.
      const restWorldPos = snap.position.clone();
      const restWorldQuat = snap.quaternion.clone();
      if (snap.parent) {
        snap.parent.localToWorld(restWorldPos);
        snap.parent.getWorldQuaternion(this.scratchQuat);
        restWorldQuat.premultiply(this.scratchQuat);
      }

      timeline.to(
        card.position,
        {
          x: restWorldPos.x,
          y: restWorldPos.y,
          z: restWorldPos.z,
          duration: EXIT_DURATION_SEC,
          ease: 'power2.inOut',
        },
        0,
      );
      const startQuat = card.quaternion.clone();
      const qProgress = { t: 0 };
      timeline.to(
        qProgress,
        {
          t: 1,
          duration: EXIT_DURATION_SEC,
          ease: 'power2.inOut',
          onUpdate: () => {
            card.quaternion.slerpQuaternions(startQuat, restWorldQuat, qProgress.t);
          },
        },
        0,
      );
      timeline.to(
        card.scale,
        {
          x: snap.scale.x,
          y: snap.scale.y,
          z: snap.scale.z,
          duration: EXIT_DURATION_SEC,
          ease: 'power2.inOut',
        },
        0,
      );
    });
  }

  dispose(): void {
    this.killActiveTween();
    const card = this.inspectedCard;
    const snap = this.snapshot;
    if (card && snap) {
      gsap.killTweensOf(card.position);
      gsap.killTweensOf(card.rotation);
      gsap.killTweensOf(card.quaternion);
      gsap.killTweensOf(card.scale);
      if (snap.parent) {
        snap.parent.attach(card);
      }
      card.position.copy(snap.position);
      card.quaternion.copy(snap.quaternion);
      card.scale.copy(snap.scale);
      card.userData.inspecting = false;
    }
    this.clearState();
  }

  private computeInspectPose(
    camera: PerspectiveCamera,
    outPos: Vector3,
    outQuat: Quaternion,
  ): void {
    camera.updateMatrixWorld(true);
    camera.getWorldDirection(this.scratchDir);
    this.scratchRight.setFromMatrixColumn(camera.matrixWorld, 0).normalize();
    this.scratchUp.setFromMatrixColumn(camera.matrixWorld, 1).normalize();

    outPos
      .copy(camera.position)
      .addScaledVector(this.scratchDir, INSPECT_CAM_FORWARD)
      .addScaledVector(this.scratchRight, INSPECT_CAM_RIGHT)
      .addScaledVector(this.scratchUp, INSPECT_CAM_UP);

    // Camera-facing upright base.
    // Group face normal is +Y (mesh rotated -π/2 on X); card top is -Z.
    this.scratchY.copy(camera.position).sub(outPos).normalize();
    this.scratchZ.copy(this.scratchUp).negate();
    this.scratchX.crossVectors(this.scratchY, this.scratchZ).normalize();
    if (this.scratchX.lengthSq() < 1e-6) {
      this.scratchX.copy(this.scratchRight);
    }
    this.scratchZ.crossVectors(this.scratchX, this.scratchY).normalize();
    this.scratchMatrix.makeBasis(this.scratchX, this.scratchY, this.scratchZ);
    outQuat.setFromRotationMatrix(this.scratchMatrix);

    // PTCGO offsets in card-local space (applied after base).
    this.localRot.setFromAxisAngle(this.scratchX.set(0.75, 0, 0), INSPECT_TIP_BACK);
    outQuat.multiply(this.localRot);
    // Card-up axis is -Z: yaw so the left edge sits farther back (right edge nearer).
    this.localRot.setFromAxisAngle(this.scratchX.set(0, 0, -1.25), INSPECT_YAW);
    outQuat.multiply(this.localRot);
    // Clockwise on screen when facing the card ≈ negative around face (+Y).
    this.localRot.setFromAxisAngle(this.scratchX.set(0, 1.25, 0), INSPECT_ROLL);
    outQuat.multiply(this.localRot);
  }

  private killActiveTween(): void {
    if (this.activeTween) {
      this.activeTween.kill();
      this.activeTween = null;
    }
  }

  private clearState(): void {
    this.inspectedCard = null;
    this.snapshot = null;
  }
}
