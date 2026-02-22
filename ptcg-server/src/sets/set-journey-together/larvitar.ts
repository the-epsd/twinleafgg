import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, CoinFlipPrompt, StateUtils, Card, ChooseCardsPrompt } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Larvitar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 70;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Crunch',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'JTG';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '80';
  public name: string = 'Larvitar';
  public fullName: string = 'Larvitar JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          // Defending Pokemon has no energy cards attached
          if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
            return state;
          }

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: true }
          ), selected => {
            cards = selected || [];
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            return store.reduceEffect(state, discardEnergy);
          });

        }
      });
    }

    return state;
  }

}