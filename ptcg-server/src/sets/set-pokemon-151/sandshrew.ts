import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { TrainerToDeckEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Sandshrew extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = F;

  public hp: number = 60;

  public weakness = [{ type: G }];

  public retreat = [C];

  public powers =
    [{
      name: 'Sand Screen',
      powerType: PowerType.ABILITY,
      text: 'Trainer cards in your opponent\'s discard pile can\'t be put into their deck by an effect of your opponent\'s Item or Supporter cards.'
    }];

  public attacks = [
    {
      name: 'Scratch',
      cost: [C, C],
      damage: 30,
      text: '',
    }
  ];

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '27';

  public set = 'MEW';

  public name: string = 'Sandshrew';

  public fullName: string = 'Sandshrew MEW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof TrainerToDeckEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isSandshrewInPlay = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isSandshrewInPlay = true;
        }
      });

      if (!isSandshrewInPlay) {
        return state;
      }

      if (isSandshrewInPlay) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const stub = new PowerEffect(opponent, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        effect.preventDefault = true;
      }
    }

    return state;
  }
}