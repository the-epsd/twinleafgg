import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Card, ChooseCardsPrompt, GameMessage, PokemonCardList, ShuffleDeckPrompt } from '../../game';

function* useCallForFamily(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 1);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Nidoran ♀' || 'Nidoran ♂' },
    { min: 0, max, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.deck.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}

export class NidoranFemale extends PokemonCard {

  public name = 'Nidoran F';

  public cardImage: string = 'assets/cardback.png';

  public set = 'JU';

  public setNumber = '57';

  public fullName = 'Nidoran F JU';

  public cardType = CardType.GRASS;

  public stage = Stage.BASIC;

  public hp = 60;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Fury Swipes',
      cost: [CardType.GRASS],
      damage: 10,
      damageCalculation: 'x',
      text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
    },
    {
      name: 'Call for Family',
      cost: [CardType.GRASS, CardType.GRASS],
      damage: 0,
      text: 'Search your deck for a Basic Pokémon named Nidoran Male or Nidoran Female and put it onto your Bench. Shuffle your deck afterward. (You can\'t use this attack if your Bench is full.)'
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      return store.prompt(state, [
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(effect.player.id, GameMessage.COIN_FLIP)
      ], (results) => {
        const heads = results.filter(r => !!r).length;
        effect.damage = heads * 10;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useCallForFamily(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
