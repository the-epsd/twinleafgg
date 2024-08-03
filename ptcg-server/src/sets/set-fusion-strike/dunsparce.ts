import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { PlayerType, StateUtils } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';


export class Dunsparce extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Mysterious Nest',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'C Pokémon in play (both yours and your opponent\'s) have no Weakness.'
  }];

  public attacks = [
    {
      name: 'Rollout',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: ''
    }];

  public regulationMark = 'E';

  public set: string = 'FST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '207';

  public name: string = 'Dunsparce';

  public fullName: string = 'Dunsparce FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.getOpponent(state, player);

      let hasDunsparceInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          hasDunsparceInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          hasDunsparceInPlay = true;
        }
      });

      if (!hasDunsparceInPlay) {
        return state;
      }

      if (hasDunsparceInPlay) {
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          state = store.reduceEffect(state, stub);
        } catch {
          return state;
        }

        [player, opponent].forEach(p => {
          p.forEachPokemon(p === player ? PlayerType.BOTTOM_PLAYER : PlayerType.TOP_PLAYER, cardList => {
            if (cardList.getPokemonCard()?.cardType === CardType.COLORLESS) {
              effect.weakness = [];
            }
          });
        });
      }
    }
    return state;
  }
}