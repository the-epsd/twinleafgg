import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Huntail extends PokemonCard {
  public tags = [CardTag.FUSION_STRIKE];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Clamperl';
  public cardType: CardType = W;
  public hp: number = 110;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Single Strike Jammer',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Single Strike Pokémon\'s attacks cost [C] more.'
  }];

  public attacks = [{
    name: 'Cavernous Chomp',
    cost: [W, C, C],
    damage: 80,
    text: ''
  }];

  public regulationMark: string = 'E';
  public set: string = 'FST';
  public setNumber: string = '66';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Huntail';
  public fullName: string = 'Huntail FST 66';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Single Strike Jammer
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const attackingPokemon = player.active.getPokemonCard();

      if (!attackingPokemon || !attackingPokemon.tags.includes(CardTag.SINGLE_STRIKE)) {
        return state;
      }

      let huntailInPlay = false;

      state.players.forEach(p => {
        if (p !== player) {
          p.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            if (card === this) {
              huntailInPlay = true;
            }
          });
        }
      });

      if (!huntailInPlay) {
        return state;
      }

      let huntailOwner = state.players.find(p => p !== player);
      if (!huntailOwner) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, huntailOwner, this)) {
        return state;
      }
      effect.cost.push(CardType.COLORLESS);
    }

    return state;
  }
}
