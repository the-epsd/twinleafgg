import { PokemonCard, Stage, CardType, CardTag, StoreLike, State, GameMessage, StateUtils, ChooseCardsPrompt, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class TeamRocketsMeowth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.TEAM_ROCKET];
  public cardType: CardType = C;
  public hp: number = 70;
  public weakness = [{ type: F }];
  public retreat = [ C ];

  public attacks = [
    {
      name: 'Cat Nab',
      cost: [ C ],
      damage: 0,
      text: 'Choose a random card from your opponent\'s hand. Your opponent reveals that card and shuffles it into their deck.'
    },
    {
      name: 'Wild Scratch',
      cost: [ C, C ],
      damage: 20,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 20 damage for each heads.'
    }
  ];

  public set: string = 'SV10';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';
  public name: string = 'Team Rocket\'s Meowth';
  public fullName: string = 'Team Rocket\'s Meowth SV10';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Cat Nab
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length === 0){
        return state;
      }

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.hand,
        {},
        { allowCancel: false, min: 1, max: 1, isSecret: true }
      ), cards => {
        cards = cards || [];

        SHOW_CARDS_TO_PLAYER(store, state, player, cards);
        opponent.hand.moveCardsTo(cards, opponent.deck);
        SHUFFLE_DECK(store, state, opponent);
      });
    }

    // Wild Scratch
    if (WAS_ATTACK_USED(effect, 1, this)){
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
