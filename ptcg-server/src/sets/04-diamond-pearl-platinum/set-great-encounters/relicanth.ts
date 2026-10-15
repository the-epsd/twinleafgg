import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StateUtils, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP } from '../../../game/store/prefabs/attack-effects';

export class Relicanth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Primal Calling',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 3 Trainer Cards that have Fossil in their names, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Sleep Swirl',
    cost: [C, C],
    damage: 30,
    text: 'Both Relicanth and the Defending Pokémon are now Asleep.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '51';
  public name: string = 'Relicanth';
  public fullName: string = 'Relicanth GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Primal Calling
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.deck.cards.length === 0) {
        return state;
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (!(c instanceof TrainerCard && c.name.includes('Fossil'))) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER },
        { min: 0, max: 3, allowCancel: true, blocked }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    // Sleep Swirl
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_ASLEEP(store, state, effect);
      ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }

    return state;
  }
}
