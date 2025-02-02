import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class Jirachi extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'G';

  public cardType: CardType = CardType.METAL;

  public hp: number = 70;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Stellar Veil',
    powerType: PowerType.ABILITY,
    text: 'Attacks from your opponent\'s Basic Pokémon can\'t put damage counters on your Benched Pokémon.'
  }
  ];

  public attacks = [{
    name: 'Charge Energy',
    cost: [CardType.COLORLESS],
    damage: 0,
    text: 'Search your deck for up to 2 Basic Energy cards, reveal them, and put them into your hand. Then, shuffle your deck.'
  }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '126';

  public name: string = 'Jirachi';

  public fullName: string = 'Jirachi PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutCountersEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);


      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      const targetPlayer = StateUtils.findOwner(state, effect.target);

      let isJirachiInPlay = false;
      targetPlayer.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isJirachiInPlay = true;
        }
      });

      if (!isJirachiInPlay) {
        return state;
      }

      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard && sourceCard.stage === Stage.BASIC) {

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
        effect.preventDefault = true;
      }
    }
    return state;
  }
}
