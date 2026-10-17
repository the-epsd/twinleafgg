import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MoveCardsEffect } from '../../../game/store/effects/game-effects';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';
import { IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Milotic extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Feebas';
  public cardType: CardType[] = [W];
  public hp: number = 120;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Mentally Calm',
    powerType: PowerType.ABILITY,
    text: 'Your opponent\'s Pokémon in play and all attached cards can\'t be put into your opponent\'s hand.'
  }];

  public attacks = [{
    name: 'Hydro Splash',
    cost: [W, C, C],
    damage: 100,
    text: ''
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Milotic';
  public fullName: string = 'Milotic TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mentally Calm — block scooping opponent's in-play Pokémon (and attachments) to hand
    if (effect instanceof MoveCardsEffect) {
      for (const owner of state.players) {
        let isMiloticInPlay = false;
        owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
          if (card === this) {
            isMiloticInPlay = true;
          }
        });
        if (!isMiloticInPlay || IS_ABILITY_BLOCKED(store, state, owner, this)) {
          continue;
        }

        const opponent = StateUtils.getOpponent(state, owner);
        if (effect.destination !== opponent.hand) {
          continue;
        }
        if (!(effect.source instanceof PokemonCardList)) {
          continue;
        }

        const isOpponentInPlaySlot =
          effect.source === opponent.active || opponent.bench.includes(effect.source);
        if (isOpponentInPlaySlot) {
          effect.preventDefault = true;
          break;
        }
      }
    }

    return state;
  }
}
