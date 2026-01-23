import { Injectable } from '@angular/core';
import { Object3D } from 'three';
import gsap from 'gsap';

@Injectable()
export class Board3dAnimationService {
  private activeAnimations: gsap.core.Timeline[] = [];

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
    });
  }

  /**
   * Attack animation (lunge toward target)
   */
  attackAnimation(attacker: Object3D, defender: Object3D): Promise<void> {
    const originalZ = attacker.position.z;
    const targetZ = defender.position.z;
    const lungeDistance = targetZ > originalZ ? 5 : -5;

    return new Promise(resolve => {
      const timeline = gsap.timeline({
        onComplete: () => {
          this.removeAnimation(timeline);
          resolve();
        }
      });

      timeline
        // Lunge forward
        .to(attacker.position, {
          z: originalZ + lungeDistance,
          y: 0.5,
          duration: 0.3,
          ease: 'power2.out'
        })
        // Return with elastic bounce
        .to(attacker.position, {
          z: originalZ,
          y: 0.1,
          duration: 0.4,
          ease: 'elastic.out(1, 0.5)'
        });

      this.activeAnimations.push(timeline);
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
   * Check if any animations are currently active
   */
  hasActiveAnimations(): boolean {
    return this.activeAnimations.length > 0;
  }

  /**
   * Kill all active animations
   */
  killAllAnimations(): void {
    this.activeAnimations.forEach(animation => {
      animation.kill();
    });
    this.activeAnimations = [];
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
