import { Injectable } from '@angular/core';
import { Object3D } from 'three';
import gsap from 'gsap';

@Injectable()
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
   * Evolution animation (spin, scale, and glow)
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
        // Rise up
        .to(card.position, {
          y: 2,
          duration: 0.4,
          ease: 'power2.out'
        })
        // Triple spin
        .to(card.rotation, {
          y: Math.PI * 3,
          duration: 0.8,
          ease: 'power2.inOut'
        }, '<')
        // Scale up
        .to(card.scale, {
          x: 1.3,
          y: 1.3,
          z: 1.3,
          duration: 0.4,
          ease: 'back.out(1.7)'
        }, '<')
        // Settle back down
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
   * Animate card being drawn to hand
   */
  drawToHandAnimation(card: Object3D, targetPosition: { x: number; y: number; z: number }): Promise<void> {
    card.position.set(18, 0.1, 12); // Start at deck position
    card.scale.setScalar(0);

    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        .to(card.scale, {
          x: 1.2, y: 1.2, z: 1.2,
          duration: 0.3,
          ease: 'back.out(1.7)'
        })
        .to(card.position, {
          x: targetPosition.x,
          y: targetPosition.y,
          z: targetPosition.z,
          duration: 0.5,
          ease: 'power2.inOut'
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
