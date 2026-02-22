import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Enamorus extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Heart Sign',
    cost: [C],
    damage: 30,
    text: ''
  },
  {
    name: 'Love Resonance',
    cost: [P, C, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If any of your Pokémon in play are the same type as any of your opponent\'s Pokémon in play, this attack does 120 more damage.'
  }];

  public regulationMark = 'H';
  public set: string = 'TWM';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '93';
  public name: string = 'Enamorus';
  public fullName: string = 'Enamorus TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if any of your Pokémon in play are the same type as any of your opponent's Pokémon in play
      let hasMatchingTypes = false;
      const playerTypes = new Set<CardType>();
      const opponentTypes = new Set<CardType>();

      // Collect types from player's Pokémon in play
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        if (cardList.cards.length > 0) {
          const pokemonCard = cardList.cards[0] as PokemonCard;
          playerTypes.add(pokemonCard.cardType);
          if (pokemonCard.additionalCardTypes) {
            pokemonCard.additionalCardTypes.forEach(type => playerTypes.add(type));
          }
        }
      });

      // Collect types from opponent's Pokémon in play
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList: PokemonCardList) => {
        if (cardList.cards.length > 0) {
          const pokemonCard = cardList.cards[0] as PokemonCard;
          opponentTypes.add(pokemonCard.cardType);
          if (pokemonCard.additionalCardTypes) {
            pokemonCard.additionalCardTypes.forEach(type => opponentTypes.add(type));
          }
        }
      });

      // Check for matching types
      for (const playerType of playerTypes) {
        if (opponentTypes.has(playerType)) {
          hasMatchingTypes = true;
          break;
        }
      }

      // Apply bonus damage if types match
      if (hasMatchingTypes) {
        effect.damage += 120;
      }
    }

    return state;
  }
}
