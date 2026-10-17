import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Bidoof extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Amnesia',
    cost: [C],
    damage: 0,
    text: 'Choose 1 of the Defending Pokémon\'s attacks. That Pokémon can\'t use that attack during your opponent\'s next turn.'
  },
  {
    name: 'Scavenge',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for a Trainer card, show it to your opponent, and put it into your hand.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Bidoof';
  public fullName: string = 'Bidoof DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Amnesia
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    // Scavenge
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      if (!player.discard.cards.some(card => card.superType === SuperType.TRAINER)) {
        return state;
      }
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        if (selected) {
          MOVE_CARDS(store, state, player.discard, player.hand, { cards: selected });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, selected);
        }
      });
    }

    return state;
  }
}
