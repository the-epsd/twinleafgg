import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Sunkern extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Sun Soak',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, remove all damage counters from Sunkern, search your deck for an Evolution card that evolves from Sunkern, and put it onto Sunkern. (This counts as evolving Sunkern.) Shuffle your deck afterward.'
  },
  {
    name: 'Seed Bomb',
    cost: [G],
    damage: 20,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '114';
  public name: string = 'Sunkern';
  public fullName: string = 'Sunkern SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sun Soak
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }

        const healEffect = new HealEffect(player, player.active, player.active.damage);
        store.reduceEffect(state, healEffect);

        if (player.deck.cards.length === 0) {
          return;
        }

        let cards: Card[] = [];
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_EVOLVE,
          player.deck,
          { superType: SuperType.POKEMON, evolvesFrom: this.name },
          { min: 0, max: 1, allowCancel: false }
        ), selected => {
          cards = selected || [];
          if (cards.length > 0) {
            MOVE_CARDS(store, state, player.deck, player.active, { cards, sourceCard: this });
            player.active.clearEffects();
            player.active.pokemonPlayedTurn = state.turn;
          }
          SHUFFLE_DECK(store, state, player);
        });
      });
    }

    return state;
  }
}
