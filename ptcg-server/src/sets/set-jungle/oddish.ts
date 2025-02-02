import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, ShuffleDeckPrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

function* useSprout(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 1);

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.deck,
    { superType: SuperType.POKEMON, stage: Stage.BASIC, name: 'Oddish' },
    { min: 0, max, allowCancel: true }
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

export class Oddish extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = 
    [
      {
        name: 'Stun Spore',
        cost: [ CardType.GRASS ],
        damage: 10,
        text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
      },
      {
        name: 'Sprout',
        cost: [ CardType.GRASS, CardType.GRASS ],
        damage: 0,
        text: 'The Defending Pokémon is now Asleep.'
      },
    ];

  public set: string = 'JU';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public name: string = 'Oddish';

  public fullName: string = 'Oddish JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state; 
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const generator = useSprout(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }

}
