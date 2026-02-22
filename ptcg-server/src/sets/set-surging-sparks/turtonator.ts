import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { SuperType } from '../../game/store/card/card-types';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { CardTag } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Turtonator extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DRAGON;
  public hp: number = 120;
  public weakness = [];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Fully Singe',
      cost: [CardType.FIRE],
      damage: 0,
      text: 'Discard an Energy from your opponent\'s Active Pokémon ex.'
    },
    {
      name: 'Steaming Stomp',
      cost: [CardType.FIRE, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }
  ];

  public set: string = 'SSP';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '137'; // Assign correct number if known
  public name: string = 'Turtonator';
  public fullName: string = 'Turtonator SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active;
      const activeCard = opponentActive.getPokemonCard();
      // Only target Pokémon ex
      if (!activeCard || !activeCard.cardTag.includes(CardTag.POKEMON_ex)) {
        return state;
      }
      // Check for any energy attached
      const energyCards = opponentActive.cards.filter(c => c.superType === SuperType.ENERGY);
      if (energyCards.length === 0) {
        return state;
      }
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponentActive,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        if (selected && selected.length > 0) {
          const discardEffect = new DiscardCardsEffect(effect, selected);
          discardEffect.target = opponentActive;
          store.reduceEffect(state, discardEffect);
        }
        return state;
      });
    }
    return state;
  }
}
