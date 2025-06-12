import { PlayerType, PowerType, StateUtils } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckTableStateEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Sudowoodo extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = F;

  public hp: number = 100;

  public weakness = [{ type: W }];

  public retreat = [C, C];

  public powers = [{
    name: 'Roadblock',
    powerType: PowerType.ABILITY,
    text: 'Your opponent can\'t have more than 4 Benched Pokémon. If they have 5 or more Benched Pokémon, they discard Benched Pokémon until they have 4 Pokémon on the Bench. If more than one effect changes the number of Benched Pokémon allowed, use the smaller number.'
  }];

  public attacks = [{
    name: 'Rock Throw',
    cost: [F, C],
    damage: 40,
    text: ''
  }];

  public set: string = 'GRI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '66';

  public name: string = 'Sudowoodo';

  public fullName: string = 'Sudowoodo GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      let isOpponentSudowoodoInPlay = false;
      owner.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isOpponentSudowoodoInPlay = true;
        }
      });

      if (!isOpponentSudowoodoInPlay) {
        return state;
      }

      if (!IS_ABILITY_BLOCKED(store, state, player, this)) {
        effect.benchSizes = state.players.map((player, index) => {
          if (player === owner) {
            return effect.benchSizes[index];
          }
          return Math.min(effect.benchSizes[index], 4);
        });
      }
    }
    return state;
  }
}
