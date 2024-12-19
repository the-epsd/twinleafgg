import { Effect } from '../effects/effect';
import { AttackEffect, PowerEffect } from '../effects/game-effects';
import { Marker } from '../state/card-marker';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { Card } from './card';
import { SuperType, Stage, PokemonType, CardType, CardTag, Format } from './card-types';
import { Attack, Weakness, Resistance, Power } from './pokemon-types';
import { TrainerCard } from './trainer-card';

export abstract class PokemonCard extends Card {

  public superType: SuperType = SuperType.POKEMON;

  public cardType: CardType = CardType.NONE;

  public additionalCardTypes?: CardType[];

  public cardTag: CardTag[] = [];

  public pokemonType: PokemonType = PokemonType.NORMAL;

  public evolvesFrom: string = '';

  public stage: Stage = Stage.BASIC;

  public retreat: CardType[] = [];

  public hp: number = 0;

  public weakness: Weakness[] = [];

  public resistance: Resistance[] = [];

  public powers: Power[] = [];

  public attacks: Attack[] = [];

  public format: Format = Format.NONE;

  public marker = new Marker();

  public movedToActiveThisTurn = false;

  public tools: TrainerCard[] = [];

  public archetype: CardType[] = [];

  public canAttackTwice?: boolean;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect) {
      for (let i = 0; i < this.attacks.length; i++) {
        const attackEffect = this.attacks[i].effect;
        // console.log(this.attacks[i].name);
        if (effect.attack === this.attacks[i] && attackEffect !== undefined && typeof attackEffect === 'function') {
          // console.log(attackEffect);
          // console.log('we made it to handling!');
          attackEffect(store, state, effect);
        }
      }
    }
    else if (effect instanceof PowerEffect) {
      for (let i = 0; i < this.powers.length; i++) {
        if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
          return effect.power.effect(store, state, effect);
        }
      }

      for (let i = 0; i < this.tools.length; i++) {
        if (effect.power === this.powers[i] && effect.power.effect !== undefined) {
          return effect.power.effect(store, state, effect);
        }
      }
    }
    return state;
  }
}
