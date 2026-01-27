import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT, ADD_MARKER, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';

export class Pinsir extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Power Pinch',
      cost: [C, C],
      damage: 0,
      text: 'Flip 2 coins. For each heads, discard an Energy attached to the Defending Pokemon.'
    },
    {
      name: 'Grip and Squeeze',
      cost: [G, G, C],
      damage: 70,
      text: 'The Defending Pokemon can\'t retreat during your opponent\'s next turn.'
    }
  ];

  public set: string = 'NXD';
  public setNumber: string = '1';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pinsir';
  public fullName: string = 'Pinsir NXD';

  public readonly GRIP_AND_SQUEEZE_MARKER = 'GRIP_AND_SQUEEZE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Power Pinch - flip coins to discard energy
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        const heads = results.filter(r => r).length;

        if (heads === 0) {
          return;
        }

        // Get energy cards from defender
        const energyCards = opponent.active.cards.filter(c => c.superType === SuperType.ENERGY);

        if (energyCards.length === 0) {
          return;
        }

        const cardsToDiscard = Math.min(heads, energyCards.length);

        if (cardsToDiscard > 0) {
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: cardsToDiscard, max: cardsToDiscard, allowCancel: false }
          ), (selected: Card[]) => {
            if (selected && selected.length > 0) {
              const discardEffect = new DiscardCardsEffect(effect, selected);
              discardEffect.target = opponent.active;
              store.reduceEffect(state, discardEffect);
            }
          });
        }
      });
    }

    // Grip and Squeeze - prevent retreat
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.GRIP_AND_SQUEEZE_MARKER, opponent.active, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, this.GRIP_AND_SQUEEZE_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.GRIP_AND_SQUEEZE_MARKER, this);

    return state;
  }
}
