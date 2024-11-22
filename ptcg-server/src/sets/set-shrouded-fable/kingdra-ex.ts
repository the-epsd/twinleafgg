import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PokemonCardList, Card, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

function* useKingsOrder(next: Function, store: StoreLike, state: State,
  effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
  const max = Math.min(slots.length, 3);

  // const hasWaterPokemonInDiscard = player.discard.cards.some(c => {
  //   return c instanceof PokemonCard && c.cardType === CardType.WATER;
  // });
  // if (!hasWaterPokemonInDiscard) {
  //   throw new GameError(GameMessage.CANNOT_USE_ATTACK);
  // }

  const hasWaterPokemonInDiscard = player.discard.cards.some(c => {
    const discardPokemon = player.discard.cards.filter(card => card.superType === SuperType.POKEMON) as PokemonCard[];
    const waterDiscardPokemon = discardPokemon.filter(card => card.cardType === CardType.WATER);
    return waterDiscardPokemon.length > 0;
  });

  if (!hasWaterPokemonInDiscard || slots.length === 0) {
    return state;
  }

  let cards: Card[] = [];
  yield store.prompt(state, new ChooseCardsPrompt(
    player,
    GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
    player.discard,
    { superType: SuperType.POKEMON, cardType: CardType.WATER },
    { min: 1, max, allowCancel: false }
  ), selected => {
    cards = selected || [];
    next();
  });

  if (cards.length > slots.length) {
    cards.length = slots.length;
  }

  cards.forEach((card, index) => {
    player.discard.moveCardTo(card, slots[index]);
    slots[index].pokemonPlayedTurn = state.turn;
  });
}

export class Kingdraex extends PokemonCard {

  public regulationMark = 'H';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Seadra';

  public cardType: CardType = CardType.WATER;

  public hp: number = 310;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'King\'s Order',
      cost: [CardType.WATER],
      damage: 0,
      text: 'Put up to 3 [W] Pokémon from your discard pile onto your Bench.'
    },
    {
      name: 'Hydro Pump',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 50,
      damageCalculation: '+',
      text: 'This attack does 50 more damage for each [W] Energy attached to this Pokémon.'
    },
  ];

  public set: string = 'SFA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public name: string = 'Kingdra ex';

  public fullName: string = 'Kingdra ex SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useKingsOrder(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energyCount = 0;
      checkProvidedEnergyEffect.energyMap.forEach(em => {
        energyCount += em.provides.filter(cardType =>
          cardType === CardType.WATER || cardType === CardType.ANY
        ).length;
      });

      effect.damage += energyCount * 50;
    }

    return state;
  }

}
