import { CardType, SpecialCondition, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../../game/store/effects/game-phase-effects';
import { Player, PlayerType, PowerType, StateUtils, StoreLike, State } from '../../../game';
import {
  ADD_CONFUSION_TO_PLAYER_ACTIVE,
  AFTER_ATTACK,
  COIN_FLIP_PROMPT,
  IS_ABILITY_BLOCKED,
} from '../../../game/store/prefabs/prefabs';

export class Parasect extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Paras';
  public hp: number = 100;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Panic Spores',
    powerType: PowerType.ABILITY,
    text: 'Put 2 damage counters on your opponent\'s Confused Pokémon between turns.'
  }];

  public attacks = [{
    name: 'Mysterious Powder',
    cost: [G, C],
    damage: 30,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Confused.'
  }];

  public set: string = 'TEU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Parasect';
  public fullName: string = 'Parasect TEU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Panic Spores
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let parasectOwner: Player | null = null;
      [player, opponent].forEach(p => {
        p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            parasectOwner = p;
          }
        });
      });

      if (!parasectOwner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, parasectOwner, this)) {
        return state;
      }

      const parasectOpponent = StateUtils.getOpponent(state, parasectOwner);
      parasectOpponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        if (cardList.specialConditions.includes(SpecialCondition.CONFUSED)) {
          store.reduceEffect(
            state,
            new PlaceDamageCountersEffect(parasectOwner!, cardList, 20, this, this.powers[0]),
          );
        }
      });
    }

    // Mysterious Powder
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
