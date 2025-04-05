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
      effect.benchSizes = state.players.map((player, index) => {
        // Return original bench size if Ability is blocked
        if (IS_ABILITY_BLOCKED(store, state, player, this)) {
          return 5;
        }

        // Check for Sudowoodo on opponent's board
        let isSudowoodoInPlay = false;
        const opponent = StateUtils.getOpponent(state, player);
        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
          const pokemon = cardList.getPokemonCard();
          if (!!pokemon && pokemon.name === 'Sudowoodo' && pokemon.powers.map(p => p.name).includes(this.powers[0].name)) {
            isSudowoodoInPlay = true;
          }
        });

        // Modify bench size
        if (isSudowoodoInPlay) {
          return 4;
        }

        // Return original bench size
        return 5;
      });
    }

    return state;
  }
}