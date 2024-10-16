import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, Card, GameError, GameMessage, ShowCardsPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

// LOT Poipole 107 (https://limitlesstcg.com/cards/LOT/107)
export class Poipole extends PokemonCard {

  public tags = [CardTag.ULTRA_BEAST];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Eye Opener',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Look at your face-down Prize cards.'
    },

    {
      name: 'Peck',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: ''
    },
  ];

  public set: string = 'LOT';

  public name: string = 'Poipole';

  public fullName: string = 'Poipole LOT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '107';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Eye Opener
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const prizes = player.prizes.filter(p => p.isSecret);
      const cards: Card[] = [];
      prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

      // All prizes are face-up
      if (cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Make prizes no more secret, before displaying prompt
      prizes.forEach(p => { p.isSecret = false; });

      state = store.prompt(state, new ShowCardsPrompt(
        player.id,
        GameMessage.CARDS_SHOWED_BY_EFFECT,
        cards,
      ), () => { });

      // Prizes are secret once again.
      prizes.forEach(p => { p.isSecret = true; });

      return state;
    }

    return state;
  }
}