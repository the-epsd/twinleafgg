import { PokemonCard as PokemonCardClass } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { GameMessage, PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { COIN_FLIP_PROMPT, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { HANDLE_ABILITY_BLOCK, POKEPOWER_TYPES } from '../../../game/store/prefabs/ability-lock';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';

export class Bellsprout extends PokemonCardClass {

  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public attacks = [{
    name: 'Vine Bind',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon can\'t use any Poké-Powers during your opponent\'s next turn.'
  },
  {
    name: 'Careless Tackle',
    cost: [G],
    damage: 20,
    text: 'Bellsprout does 10 damage to itself.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Bellsprout';
  public fullName: string = 'Bellsprout LA';

  public readonly VINE_BIND_MARKER = 'VINE_BIND_MARKER';
  public readonly VINE_BIND_CLEAR_MARKER = 'VINE_BIND_CLEAR_MARKER';

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
      return cardList !== undefined && cardList.marker.hasMarker(this.VINE_BIND_MARKER, this);
    }, {
      powerTypes: POKEPOWER_TYPES,
      error: GameMessage.BLOCKED_BY_EFFECT,
    });

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.VINE_BIND_CLEAR_MARKER, this)) {
      effect.player.marker.removeMarker(this.VINE_BIND_CLEAR_MARKER, this);
      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        cardList.marker.removeMarker(this.VINE_BIND_MARKER, this);
      });
    }

    // Vine Bind
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          opponent.active.marker.addMarker(this.VINE_BIND_MARKER, this);
          opponent.marker.addMarker(this.VINE_BIND_CLEAR_MARKER, this);
        }
      });
    }

    // Careless Tackle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}
