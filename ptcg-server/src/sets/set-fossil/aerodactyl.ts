import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Aerodactyl extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Mysterious Fossil';

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 60;

  public weakness = [{ type: CardType.GRASS }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Prehistoric Power',
      powerType: PowerType.POKEPOWER,
      text: 'No more Evolution cards can be played. This power stops working while Aerodactyl is Asleep, Confused, or Paralyzed.',
    },
  ];

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: '',
    },
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '1';

  public name: string = 'Aerodactyl';

  public fullName: string = 'Aerodactyl FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EvolveEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isAerodactylInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isAerodactylInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isAerodactylInPlay = true;
        }
      });

      if (!isAerodactylInPlay) {
        return state;
      }

      if (isAerodactylInPlay) {

        const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

        if (cardList.specialConditions.includes(SpecialCondition.ASLEEP)) {
          return state;
        }
        if (cardList.specialConditions.includes(SpecialCondition.CONFUSED)) {
          return state;
        }
        if (cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
          return state;
        }

        // Try reducing ability
        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }
    return state;
  }
}
