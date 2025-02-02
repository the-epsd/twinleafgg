import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { DiscardToHandEffect } from '../../game/store/effects/play-card-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Toedscruel extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Toedscool';

  public cardType: CardType = G;

  public hp: number = 120;

  public weakness = [{ type: R }];

  public retreat = [C, C];

  public powers =
    [{
      name: 'Slime Mold Colony',
      powerType: PowerType.ABILITY,
      text: 'Cards in your opponent\'s discard pile can\'t be put into their hand by an effect of your opponent\'s Abilities or Trainer cards.'
    }];

  public attacks = [
    {
      name: 'Scratch',
      cost: [G, C, C],
      damage: 80,
      text: 'Heal 30 damage from this Pokémon.',
    }
  ];

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '17';

  public set = 'PAR';

  public name: string = 'Toedscruel';

  public fullName: string = 'Toedscruel PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DiscardToHandEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isToedscruelInPlay = false;
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isToedscruelInPlay = true;
        }
      });

      if (!isToedscruelInPlay) {
        return state;
      }

      if (isToedscruelInPlay) {
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