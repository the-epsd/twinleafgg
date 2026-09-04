import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameMessage,
  GameError,
  Player
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { COPY_ATTACK_FROM_POKEMON_LIST } from '../../../game/store/prefabs/copy-attack-prefabs';

export class Mew extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [P];
  public hp: number = 60;
  public weakness = [{ type: P, value: 20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Psychic Balance',
      cost: [],
      damage: 0,
      text: 'If you have less cards in your hand than your opponent, draw cards until you have the same number of cards as your opponent. (If you have more or the same number of cards in your hand as your opponent, this attack does nothing.)'
    },
    {
      name: 'Re-creation',
      cost: [P, C, C],
      damage: 0,
      copycatAttack: true,
      text: 'Choose an attack on 1 of your opponent\'s Pokémon in his or her discard pile. Re-creation copies that attack except for its Energy cost. (You must still do anything else required for that attack.) Mew performs that attack.'
    },
  ];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '15';
  public name: string = 'Mew';
  public fullName: string = 'Mew SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, opponent.hand.cards.length);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const pokemonCards = this.getOpponentDiscardPokemon(state, player);

      if (pokemonCards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return COPY_ATTACK_FROM_POKEMON_LIST(store, state, effect as AttackEffect, pokemonCards, {
        allowCancel: true,
      });
    }
    return state;
  }

  private getOpponentDiscardPokemon(state: State, player: Player): PokemonCard[] {
    const opponent = StateUtils.getOpponent(state, player);
    return opponent.discard.cards.filter(
      (card): card is PokemonCard => card instanceof PokemonCard,
    );
  }
}
