import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PowerType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class SamiyasChatot2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Oblivious',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Samiya\'s Chatot by attacks from your opponent\'s Evolved Pokémon is reduced by 20 (after applying Weakness and Resistance).'
  }];

  public attacks = [
    {
      name: 'Claw',
      cost: [C],
      damage: 20,
      text: 'Flip a coin. If tails, this attack does nothing.'
    }
  ];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '152';
  public name: string = 'Samiya\'s Chatot';
  public fullName: string = 'Samiya\'s Chatot PCGP 152';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if ((effect instanceof DealDamageEffect || effect instanceof PutDamageEffect) && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      if (effect.source.getPokemons().length > 1) {
        effect.damage -= 20;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}

