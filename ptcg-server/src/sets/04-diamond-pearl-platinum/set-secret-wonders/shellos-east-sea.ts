import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PlayPokemonFromDeckEffect } from '../../../game/store/effects/play-card-effects';

export class ShellosEastSea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [W];
  public weakness = [{ type: L, value: +10 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Shell Hunting',
    cost: [C],
    damage: 0,
    text: 'Search your deck for up to 2 in any combination of Shellos West Sea and Shellos East Sea and put them on your Bench. Shuffle your deck afterward.'
  },
  {
    name: 'Sprinkle Water',
    cost: [W],
    damage: 10,
    text: ''
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '106';
  public name: string = 'Shellos East Sea';
  public fullName: string = 'Shellos East Sea SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shell Hunting
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const slots = player.bench.filter(b => b.cards.length === 0);
      if (player.deck.cards.length === 0 || slots.length === 0) {
        return state;
      }

      const max = Math.min(2, slots.length);
      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (!(card instanceof PokemonCard) ||
          (card.name !== 'Shellos West Sea' && card.name !== 'Shellos East Sea')) {
          blocked.push(index);
        }
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max, allowCancel: true, blocked }
      ), selected => {
        const cards = selected || [];
        cards.forEach((card, index) => {
          const playEffect = new PlayPokemonFromDeckEffect(player, card as PokemonCard, slots[index]);
          store.reduceEffect(state, playEffect);
        });
        SHUFFLE_DECK(store, state, player);
      });
    }

    return state;
  }
}
