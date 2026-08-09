import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { AbstractAttackEffect, ApplyWeaknessEffect } from '../../../game/store/effects/attack-effects';

export class GiratinaEX extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 170;
  public weakness = [{ type: Y }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Renegade Pulse',
    powerType: PowerType.ABILITY,
    text: 'Prevent all effects of attacks, including damage, done to this Pokémon by your opponent\'s Mega Evolution Pokémon.'
  }];

  public attacks = [{
    name: 'Chaos Wheel',
    cost: [G, P, C, C],
    damage: 100,
    text: 'Your opponent can\'t play any Pokémon Tool, Special Energy, or Stadium cards from his or her hand during his or her next turn.'
  }];

  public set: string = 'AOR';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Giratina-EX';
  public fullName: string = 'Giratina EX AOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Renegade Pulse
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const sourceCard = effect.source.getPokemonCard();

      if (sourceCard?.tags.includes(CardTag.MEGA)) {
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        effect.preventDefault = true;
      }
    }

    // Chaos Wheel
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, {
        tool: true,
        specialEnergy: true,
        stadium: true,
      });
    }

    return state;
  }
}