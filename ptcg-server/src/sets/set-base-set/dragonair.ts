import { Card, ChooseCardsPrompt, GameMessage, StateUtils } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';

import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dragonair extends PokemonCard {

  public set = 'BS';

  public name = 'Dragonair';

  public fullName = 'Dragonair BS';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Dratini';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 80;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '18';

  public resistance = [{
    type: CardType.PSYCHIC,
    value: -30
  }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Slam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
    },
    {
      name: 'Hyper Beam',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'If the Defending Pokémon has any Energy cards attached to it, choose 1 of them and discard it.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => !!r).length;
        effect.damage = 30 * heads;
      });

    }

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (!opponent.active.cards.some(c => c.superType === SuperType.ENERGY)) {
        return state;
      }

      let card: Card;

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        card = selected[0];

        opponent.active.moveCardTo(card, opponent.discard);
        return state;
      });

      return state;
    }

    return state;

  }

}