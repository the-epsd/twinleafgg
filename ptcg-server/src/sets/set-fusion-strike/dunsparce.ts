import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PokemonCardList, StateUtils } from '../../game';
import { CheckPokemonStatsEffect, CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';


export class Dunsparce extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Mysterious Nest',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'C Pokémon in play (both yours and your opponent\'s) have no Weakness.'
  }];

  public attacks = [
    {
      name: 'Rollout',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 30,
      text: ''
    }];

  public regulationMark = 'E';

  public set: string = 'FST';

  public set2: string = 'fusionstrike';

  public setNumber: string = '207';

  public name: string = 'Dunsparce';

  public fullName: string = 'Dunsparce FST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      if (effect instanceof CheckPokemonStatsEffect) {

        const cardList = StateUtils.findCardList(state, effect.card);
        if (cardList instanceof PokemonCardList) {
          const checkPokemonType = new CheckPokemonTypeEffect(cardList);
          store.reduceEffect(state, checkPokemonType);
        }
      
        // We are not blocking the Abilities from Non-Basic Pokemon
        if (effect.card.cardType !== CardType.COLORLESS) {
          return state;
        } else {
          effect.weakness = [];
        }
      
        return state;
      }
      return state;
    }
    return state;
  }
}