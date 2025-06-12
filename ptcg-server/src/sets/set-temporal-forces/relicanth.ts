import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckTableStateEffect, CheckPokemonAttacksEffect } from '../../game/store/effects/check-effects';
import {IS_ABILITY_BLOCKED} from '../../game/store/prefabs/prefabs';

export class Relicanth extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 100;

  public weakness = [{ type: CardType.GRASS }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Memory Dive',
    useWhenInPlay: false,
    powerType: PowerType.ABILITY,
    text: 'Each of your evolved Pokémon can use any attack from its previous Evolutions. (You still need the necessary Energy to use each attack.)'
  }];

  public attacks = [
    {
      name: 'Razor Fin',
      cost: [CardType.FIGHTING, CardType.COLORLESS],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public setNumber = '84';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Relicanth';

  public fullName: string = 'Relicanth TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)){ return state; }


      let isRelicanthInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isRelicanthInPlay = true;
        }
      });

      if (!isRelicanthInPlay) {
        return state;
      }

      // Enable showAllStageAbilities for evolved Pokémon
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.stage !== Stage.BASIC) {
          player.showAllStageAbilities = true;
        }
      });

      return state;
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isRelicanthInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isRelicanthInPlay = true;
        }
      });

      if (!isRelicanthInPlay) {
        return state;
      }

      // Add attacks from previous evolutions to evolved Pokémon
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.stage !== Stage.BASIC) {
          // Get all previous evolution attacks
          for (const evolutionCard of cardList.cards) {
            if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== card) {
              effect.attacks.push(...(evolutionCard.attacks || []));
            }
          }
        }
      });
    }

    return state;
  }
}