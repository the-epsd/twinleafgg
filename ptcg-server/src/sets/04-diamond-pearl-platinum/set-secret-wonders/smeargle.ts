import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../../game/store/prefabs/copy-attack-prefabs';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Smeargle extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Color Pick',
    cost: [],
    damage: 0,
    text: 'Search your deck for up to 3 basic Energy cards, show them to your opponent, and put them into your hand. Shuffle your deck afterward.'
  },
  {
    name: 'Trace',
    cost: [C],
    damage: 0,
    copycatAttack: true,
    text: 'Flip a coin. If heads, choose an attack on 1 of your opponent\'s Benched Pokémon. Trace copies that attack except for its Energy cost. (You must still do anything else required for that attack.) Smeargle performs that attack.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Smeargle';
  public fullName: string = 'Smeargle SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Color Pick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { min: 0, max: 3, allowCancel: true }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.deck, player.hand, { cards, sourceCard: this });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
        SHUFFLE_DECK(store, state, player);
      });
    }

    // Trace
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          return;
        }
        const opponent = StateUtils.getOpponent(state, player);
        const benchCards = opponent.bench
          .map(b => b.getPokemonCard())
          .filter((card): card is PokemonCard => card !== undefined && card.attacks.length > 0);
        if (benchCards.length === 0) {
          return;
        }
        COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect as AttackEffect, benchCards, {
          allowCancel: true,
        });
      });
    }

    return state;
  }
}
