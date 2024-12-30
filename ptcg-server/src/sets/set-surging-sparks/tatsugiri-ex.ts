import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { Card, CardList, ChooseCardsPrompt, GameError, GameMessage, PokemonCard, ShuffleDeckPrompt, StateUtils } from '../../game';
import { ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Tatsugiriex extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public regulationMark = 'H';

  public cardType: CardType = N;

  public hp: number = 160;

  public weakness = [];

  public resistance = [];

  public retreat = [C];

  public attacks = [
    {
      name: 'Surprise Pump',
      cost: [R, W],
      damage: 100,
      text: 'This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    },
    {
      name: 'Cinnabar Lure',
      cost: [R, W, D],
      damage: 0,
      text: 'Look at the top 10 cards of your deck. You may put any number of Pokémon you find there onto your Bench. Shuffle the other cards back into your deck.'
    }
  ];

  public set: string = 'SSP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '142';

  public name: string = 'Tatsugiri ex';

  public fullName: string = 'Tatsugiri ex SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const applyWeakness = new ApplyWeaknessEffect(effect, 100);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;

      effect.damage = 0;

      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);

      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      // Set maxPokemons to number of open slots
      const maxPokemons = openSlots.length;

      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 8);

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        deckTop,
        { superType: SuperType.POKEMON },
        { min: 0, max: maxPokemons, allowCancel: false }
      ), selectedCards => {
        cards = selectedCards || [];

        cards.forEach((card, index) => {
          deckTop.moveCardTo(card, openSlots[index]);
          openSlots[index].pokemonPlayedTurn = state.turn;
        });
        deckTop.moveTo(player.deck);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }
    return state;
  }
}
