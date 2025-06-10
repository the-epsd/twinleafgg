import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckPokemonTypeEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Jynx extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public hp: number = 60;
  public weakness = [{ type: P }];
  public retreat = [C];

  public powers = [{
    name: 'Stages of Evolution',
    powerType: PowerType.POKEBODY,
    text: 'As long as Jynx is an Evolved Pokémon, you pay [C] less to retreat your [R] and [P] Pokémon.'
  }];

  public attacks = [{
    name: 'Fire Punch',
    cost: [R, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'DF';
  public setNumber: string = '17';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jynx';
  public fullName: string = 'Jynx DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      const active = effect.player.active.getPokemonCard();

      if (owner !== player || active === undefined) {
        return state;
      }

      let isJynxInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this && cardList.getPokemons().length > 1) {
          isJynxInPlay = true;
        }
      });

      if (!isJynxInPlay) {
        return state;
      }

      let cardTypes = [active.cardType];
      const checkPokemonType = new CheckPokemonTypeEffect(player.active);
      store.reduceEffect(state, checkPokemonType);
      cardTypes = checkPokemonType.cardTypes;

      if (!IS_POKEBODY_BLOCKED(store, state, player, this) && (cardTypes.includes(CardType.PSYCHIC) || cardTypes.includes(CardType.FIRE))) {
        const colorlessIndex = effect.cost.lastIndexOf(CardType.COLORLESS);
        if (colorlessIndex !== -1) {
          effect.cost.splice(colorlessIndex, 1);
        }
      }
    }

    return state;
  }
}