import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PokemonCardList, Card, ChooseCardsPrompt, GameError, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonFromDeckEffect } from '../../game/store/effects/play-card-effects';

import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Marowak extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType[] = [F];
  public hp: number = 60;
  public weakness = [{ type: G }];
  public resistance = [{ type: L, value: -30 }];
  public retreat = [C];
  public evolvesFrom = 'Cubone';

  public attacks = [{
    name: 'Bonemerang',
    cost: [F, F],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
  }, {
    name: 'Call for Friend',
    cost: [F, F, C],
    damage: 0,
    text: 'Search your deck for a [F] Basic Pokémon card and put it onto your Bench. Shuffle your deck afterward. (You can\'t use this attack if your Bench is full.)'
  }];

  public set: string = 'JU';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Marowak';
  public fullName: string = 'Marowak JU';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      state = MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 2, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 30 * heads;
      });
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON, stage: Stage.BASIC, cardType: [CardType.FIGHTING] },
        { min: 1, max: 1, allowCancel: true }
      ), selected => {
        cards = selected || [];

        // Taking no Pokemon off of Call for Family
        if (cards.length === 0) {
          return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
            player.deck.applyOrder(order);
          });
        }

        cards.forEach((card, index) => {
          store.reduceEffect(state, new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]));
        });

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

      });
    }

    return state;
  }
}