import { Injectable } from '@angular/core';
import { CardType } from 'ptcg-server';

export interface AttackEffectConfig {
  primaryColor: string;
  secondaryColor: string;
  particleCount: number;
  animationDuration: number;
  particleSize: string;
}

@Injectable({
  providedIn: 'root'
})
export class AttackEffectService {

  /**
   * Get effect configuration for a specific CardType
   */
  public getEffectConfig(cardType: CardType): AttackEffectConfig {
    const configs: { [key: number]: AttackEffectConfig } = {
      [CardType.GRASS]: {
        primaryColor: '#4ade80', // green-400
        secondaryColor: '#22c55e', // green-500
        particleCount: 15,
        animationDuration: 1200,
        particleSize: '8px'
      },
      [CardType.FIRE]: {
        primaryColor: '#f97316', // orange-500
        secondaryColor: '#ef4444', // red-500
        particleCount: 18,
        animationDuration: 1300,
        particleSize: '10px'
      },
      [CardType.WATER]: {
        primaryColor: '#3b82f6', // blue-500
        secondaryColor: '#60a5fa', // blue-400
        particleCount: 16,
        animationDuration: 1200,
        particleSize: '9px'
      },
      [CardType.LIGHTNING]: {
        primaryColor: '#eab308', // yellow-500
        secondaryColor: '#fbbf24', // amber-400
        particleCount: 20,
        animationDuration: 1100,
        particleSize: '6px'
      },
      [CardType.PSYCHIC]: {
        primaryColor: '#a855f7', // purple-500
        secondaryColor: '#c084fc', // purple-400
        particleCount: 14,
        animationDuration: 1250,
        particleSize: '8px'
      },
      [CardType.FIGHTING]: {
        primaryColor: '#f97316', // orange-500
        secondaryColor: '#dc2626', // red-600
        particleCount: 16,
        animationDuration: 1200,
        particleSize: '10px'
      },
      [CardType.DARK]: {
        primaryColor: '#6366f1', // indigo-500
        secondaryColor: '#1e1b4b', // indigo-900
        particleCount: 12,
        animationDuration: 1300,
        particleSize: '9px'
      },
      [CardType.METAL]: {
        primaryColor: '#94a3b8', // slate-400
        secondaryColor: '#64748b', // slate-500
        particleCount: 14,
        animationDuration: 1200,
        particleSize: '8px'
      },
      [CardType.COLORLESS]: {
        primaryColor: '#e2e8f0', // slate-200
        secondaryColor: '#cbd5e1', // slate-300
        particleCount: 10,
        animationDuration: 1100,
        particleSize: '7px'
      },
      [CardType.FAIRY]: {
        primaryColor: '#f472b6', // pink-400
        secondaryColor: '#ec4899', // pink-500
        particleCount: 16,
        animationDuration: 1200,
        particleSize: '8px'
      },
      [CardType.DRAGON]: {
        primaryColor: '#8b5cf6', // violet-500
        secondaryColor: '#ec4899', // pink-500
        particleCount: 18,
        animationDuration: 1400,
        particleSize: '9px'
      }
    };

    return configs[cardType] || {
      primaryColor: '#ffffff',
      secondaryColor: '#e2e8f0',
      particleCount: 10,
      animationDuration: 1000,
      particleSize: '8px'
    };
  }

  /**
   * Check if a CardType has a valid effect configuration
   */
  public hasEffect(cardType: CardType): boolean {
    return cardType !== CardType.NONE && 
           cardType !== CardType.ANY && 
           this.getEffectConfig(cardType).primaryColor !== '#ffffff';
  }
}
