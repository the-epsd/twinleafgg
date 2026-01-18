import { PlayerType, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED, MULTIPLE_COIN_FLIPS_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { MoveCardsEffect } from '../../game/store/effects/game-effects';

export class Milotic extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public evolvesFrom: string = 'Feebas';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Dew Guard',
    powerType: PowerType.ABILITY,
    text: 'Whenever your opponent plays a Supporter card from their hand, prevent all effects of that card done to you or your hand.'
  }];

  public attacks = [{
    name: 'Double Smash',
    cost: [W, C],
    damage: 70,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 70 damage for each heads.'
  }];

  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '38';
  public name: string = 'Milotic';
  public fullName: string = 'Milotic EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof MoveCardsEffect) {
      // Check if a Supporter is being played
      if (effect.sourceCard instanceof TrainerCard && effect.sourceCard.trainerType === TrainerType.SUPPORTER) {
        // Find the player who owns the source card (the one playing the Supporter)
        const sourceCardList = StateUtils.findCardList(state, effect.sourceCard);
        const sourcePlayer = StateUtils.findOwner(state, sourceCardList);
        const targetPlayer = StateUtils.getOpponent(state, sourcePlayer);

        // Check if Milotic is in play for the target player (the one being protected)
        let isMiloticInPlay = false;
        targetPlayer.forEachPokemon(PlayerType.ANY, (list, card) => {
          if (card === this) {
            if (IS_ABILITY_BLOCKED(store, state, targetPlayer, this)) {
              return;
            }
            isMiloticInPlay = true;
          }
        });

        if (!isMiloticInPlay) {
          return state;
        }

        if (effect.source === targetPlayer.hand) {
          effect.preventDefault = true;
          return state;
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => {
          if (r) heads++;
        });

        effect.damage = 70 * heads;
      });
    }

    return state;
  }
}
