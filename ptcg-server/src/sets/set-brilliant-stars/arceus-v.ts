import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt,
  PlayerType, SlotType, GameMessage, Card, ChooseCardsPrompt, ShuffleDeckPrompt } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


function* useEmeraldSlash(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {

  const player = effect.player;

  if (player.deck.cards.length === 0) {
    return state;
  }

  const hasBenched = player.bench.some(b => b.cards.length > 0);
  if (!hasBenched) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player.id,
    GameMessage.CHOOSE_CARD_TO_HAND,
    player.deck,
    { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
    { min: 0, max: 3, allowCancel: true }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > 0) {
    yield store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
      PlayerType.BOTTOM_PLAYER,
      [ SlotType.BENCH ],
      { allowCancel: true }
    ), targets => {
      if (!targets || targets.length === 0) {
        return;
      }
      const target = targets[0];
      player.deck.moveCardsTo(cards, target);
      next();
    });
  }

  return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
    player.deck.applyOrder(order);
  });
}


export class ArceusV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Trinity Charge',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'You may search your deck for 2 G Energy cards and attach them ' +
        'to 1 of your Benched Pokemon. Shuffle your deck afterward.'
    }
  ];

  public set: string = 'BRS';

  public name: string = 'Arceus V';

  public fullName: string = 'Arceus V BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useEmeraldSlash(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
