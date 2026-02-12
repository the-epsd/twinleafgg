import { Component, Input, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { CardType } from 'ptcg-server';
import { AttackEffectService, AttackEffectConfig } from '../../../../shared/services/attack-effect.service';

@Component({
  selector: 'ptcg-attack-effect-overlay',
  templateUrl: './attack-effect-overlay.component.html',
  styleUrls: ['./attack-effect-overlay.component.scss']
})
export class AttackEffectOverlayComponent implements OnInit, OnDestroy {
  @Input() cardType: CardType;
  @ViewChild('particleContainer', { static: true }) particleContainer: ElementRef;

  public config: AttackEffectConfig;
  public particles: number[] = [];
  private animationTimeout: any;

  constructor(private attackEffectService: AttackEffectService) { }

  ngOnInit(): void {
    if (!this.cardType) {
      return;
    }

    this.config = this.attackEffectService.getEffectConfig(this.cardType);
    
    // Generate particle array
    this.particles = Array.from({ length: this.config.particleCount }, (_, i) => i);

    // Auto-cleanup after animation completes
    this.animationTimeout = setTimeout(() => {
      // Component will be removed by parent
    }, this.config.animationDuration);
  }

  ngOnDestroy(): void {
    if (this.animationTimeout) {
      clearTimeout(this.animationTimeout);
    }
  }

  /**
   * Get CSS custom properties for dynamic styling
   */
  getStyle(): { [key: string]: string } {
    if (!this.config) {
      return {};
    }

    return {
      '--primary-color': this.config.primaryColor,
      '--secondary-color': this.config.secondaryColor,
      '--particle-size': this.config.particleSize,
      '--animation-duration': `${this.config.animationDuration}ms`
    };
  }

  /**
   * Get random delay for particle animation (0 to 300ms)
   */
  getParticleDelay(index: number): number {
    return (index * 20) % 300;
  }

  /**
   * Get random horizontal offset for particle (-50% to 50%)
   */
  getParticleOffsetX(index: number): number {
    return ((index * 37) % 100) - 50;
  }

  /**
   * Get random vertical offset for particle (-50% to 50%)
   */
  getParticleOffsetY(index: number): number {
    return ((index * 23) % 100) - 50;
  }
}
