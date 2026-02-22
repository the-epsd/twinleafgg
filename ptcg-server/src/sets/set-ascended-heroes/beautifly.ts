import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';

import { ShowCardsPrompt } from '../../game/store/prompts/show-cards-prompt';
import { GameMessage, StateUtils, SuperType } from '../../game';
import { COIN_FLIP_PROMPT, ADD_PARALYZED_TO_PLAYER_ACTIVE, AFTER_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beautifly extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Silcoon';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C];

  public attacks = [
    {
      name: 'Stun Spore',
      cost: [G],
      damage: 40,
      text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
    },
    {
      name: 'Energy Straw',
      cost: [G],
      damage: 80,
      damageCalculation: 'x',
      text: 'Your opponent reveals their hand, and this attack does 80 damage for each Energy card you find there.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Beautifly';
  public fullName: string = 'Beautifly M2a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Stun Spore - coin flip for paralysis
    if (AFTER_ATTACK(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Energy Straw - reveal hand and count Energy cards
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Reveal opponent's hand
      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
        opponent.hand.cards
      ), () => {
        // Count Energy cards in opponent's hand
        let energyCount = 0;
        opponent.hand.cards.forEach(card => {
          if (card.superType === SuperType.ENERGY) {
            energyCount++;
          }
        });

        // Calculate damage: 80 per Energy card
        effect.damage = 80 * energyCount;
      });
    }
    return state;
  }
}