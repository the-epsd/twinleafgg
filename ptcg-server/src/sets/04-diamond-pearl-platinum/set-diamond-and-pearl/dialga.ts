import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, DEVOLVE_POKEMON, DRAW_CARDS, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { GameMessage } from '../../../game/game-message';

export class Dialga extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 90;
  public cardType: CardType[] = [M];
  public weakness = [{ type: R, value: 20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Time Bellow',
    cost: [M],
    damage: 10,
    text: 'Draw a card.'
  },
  {
    name: 'Flash Cannon',
    cost: [M, M, C],
    damage: 40,
    text: 'You may return all Energy cards attached to Dialga to your hand. If you do, remove the highest Stage Evolution card from the Defending Pokémon and shuffle that card into your opponent\'s deck.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Dialga';
  public fullName: string = 'Dialga DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Time Bellow
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DRAW_CARDS(store, state, effect.player, 1);
    }

    // Flash Cannon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const energies = player.active.cards.filter(c => c instanceof EnergyCard);

      if (energies.length === 0) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, wantToUse => {
        if (!wantToUse) {
          return;
        }

        MOVE_CARDS(store, state, player.active, player.hand, {
          cards: energies,
          sourceCard: this,
        });

        if (opponent.active.getPokemons().length > 1) {
          DEVOLVE_POKEMON(store, state, opponent.active, opponent.deck);
          SHUFFLE_DECK(store, state, opponent);
        }
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    return state;
  }
}
