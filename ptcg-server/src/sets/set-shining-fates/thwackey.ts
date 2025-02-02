import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';

export class Thwackey extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 90;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public weakness = [{ type: CardType.FIRE }];
  public evolvesFrom = 'Grookey';

  public powers = [{
    name: 'Lay of the Land',
    powerType: PowerType.ABILITY,
    text: 'If you have a Stadium in play, this Pokemon has no Retreat Cost.'
  }];

  public attacks = [
    {
      name: 'Branch Poke',
      cost: [CardType.COLORLESS],
      damage: 20,
      text: ''
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'SHF';
  public name: string = 'Thwackey';
  public fullName: string = 'Thwackey SHF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '12';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
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

      // Getting stadium in play
      const stadiumCard = StateUtils.getStadiumCard(state);

      // If no stadium in play, return state
      if (stadiumCard === undefined) {
        return state;
      }

      // Figuring out owner of Stadium
      const cardList = StateUtils.findCardList(state, stadiumCard);
      const stadiumOwner = StateUtils.findOwner(state, cardList);

      // If stadium in play, remove retreat cost from Thwackey in play
      if (stadiumCard !== undefined && stadiumOwner === player) {
        effect.cost = [];
      }
    }
    return state;
  }
}