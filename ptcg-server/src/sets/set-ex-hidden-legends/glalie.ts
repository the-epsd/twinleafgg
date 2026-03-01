import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Glalie extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Snorunt';
  public cardType: CardType = W;
  public hp: number = 80;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Ice Wall',
    powerType: PowerType.POKEBODY,
    text: 'Any damage done to Glalie by attacks from your opponent\'s Pokémon with any Special Energy cards attached to it is reduced by 40 (after applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Heavy Blizzard',
    cost: [W],
    damage: 50,
    text: 'Flip a coin. If heads, put 1 damage counter on each of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'HL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Glalie';
  public fullName: string = 'Glalie HL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this && !IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
      if (effect.source.cards.some(card => card.energyType === EnergyType.SPECIAL)) {
        effect.damage -= 40;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          const opponent = StateUtils.getOpponent(state, player);

          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
            if (cardList !== opponent.active) {
              const countersEffect = new PutCountersEffect(effect, 10);
              countersEffect.target = cardList;
              store.reduceEffect(state, countersEffect);
            }
          });
        }
      });
    }

    return state;
  }
}