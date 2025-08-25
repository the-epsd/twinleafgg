import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, GameMessage, StateUtils, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AFTER_ATTACK, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsMeowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Cat Nab',
      cost: [C],
      damage: 0,
      text: 'Choose a random card from your opponent\'s hand. Your opponent reveals that card and shuffles it into their deck.'
    },
    {
      name: 'Wild Scratch',
      cost: [C, C],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 20 damage for each heads.'
    }
  ];

  public set: string = 'DRI';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name: string = 'Team Rocket\'s Meowth';
  public fullName: string = 'Team Rocket\'s Meowth DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cat Nab
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0) {
        return state;
      }

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        MOVE_CARDS(store, state, opponent.hand, opponent.deck, { cards: [randomCard], sourceCard: this, sourceEffect: this.attacks[0] });
        SHUFFLE_DECK(store, state, opponent);
      }
    }

    // Wild Scratch
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 20 * heads;
      });
    }

    return state;
  }
}
