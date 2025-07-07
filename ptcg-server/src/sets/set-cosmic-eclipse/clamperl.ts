import { PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND, IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Clamperl extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 50;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Evolutionary Advantage',
    powerType: PowerType.ABILITY,
    text: 'If you go second, this Pokémon can evolve during your first turn.',
  }];

  public attacks = [{ name: 'Sparkling Pearl', cost: [W], damage: 10, text: '' }];

  public set: string = 'CES';
  public name: string = 'Clamperl';
  public fullName: string = 'Clamperl CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;
      if (IS_ABILITY_BLOCKED(store, state, player, this))
        return state;
      CAN_EVOLVE_ON_FIRST_TURN_GOING_SECOND(state, player, cardList);
    }
    return state;
  }
}