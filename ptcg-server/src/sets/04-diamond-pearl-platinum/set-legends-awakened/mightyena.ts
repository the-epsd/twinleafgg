import { PokemonCard as PokemonCardClass } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameMessage, PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { BLOCK_RETREAT, DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { HANDLE_ABILITY_BLOCK, POKEPOWER_TYPES } from '../../../game/store/prefabs/ability-lock';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';

export class Mightyena extends PokemonCardClass {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Poochyena';
  public hp: number = 90;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Bite On',
    cost: [D],
    damage: 30,
    text: 'If the Defending Pokémon isn\'t an Evolved Pokémon, that Pokémon can\'t attack, retreat, or use any Poké-Powers during your opponent\'s next turn.'
  },
  {
    name: 'Harass',
    cost: [C, C],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the number of Pokémon you have in play.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '66';
  public name: string = 'Mightyena';
  public fullName: string = 'Mightyena LA';

  public readonly BITE_ON_POKEPOWER_MARKER = 'BITE_ON_POKEPOWER_MARKER';
  public readonly BITE_ON_CLEAR_MARKER = 'BITE_ON_CLEAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    HANDLE_ABILITY_BLOCK(effect, ({ card }) => {
      let cardList: PokemonCardList | undefined;
      if (card instanceof PokemonCardList) {
        cardList = card;
      } else if (card instanceof PokemonCardClass) {
        try {
          const found = StateUtils.findCardList(state, card);
          if (found instanceof PokemonCardList) {
            cardList = found;
          }
        } catch {
          return false;
        }
      }
      return cardList !== undefined && cardList.marker.hasMarker(this.BITE_ON_POKEPOWER_MARKER, this);
    }, {
      powerTypes: POKEPOWER_TYPES,
      error: GameMessage.BLOCKED_BY_EFFECT,
    });

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BITE_ON_CLEAR_MARKER, this)) {
      effect.player.marker.removeMarker(this.BITE_ON_CLEAR_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        cardList.marker.removeMarker(this.BITE_ON_POKEPOWER_MARKER, this);
      });
    }

    // Bite On
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const defending = opponent.active.getPokemonCard();
      if (defending !== undefined && defending.stage === Stage.BASIC) {
        DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
        opponent.active.marker.addMarker(this.BITE_ON_POKEPOWER_MARKER, this);
        opponent.marker.addMarker(this.BITE_ON_CLEAR_MARKER, this);
        return BLOCK_RETREAT(store, state, effect, this);
      }
    }

    // Harass
    if (WAS_ATTACK_USED(effect, 1, this)) {
      let pokemonInPlay = 0;
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => {
        pokemonInPlay += 1;
      });
      effect.damage = 10 * pokemonInPlay;
    }

    return state;
  }
}
