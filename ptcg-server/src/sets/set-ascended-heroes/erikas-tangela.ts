import { PokemonCard, Stage, CardTag, CardType, PowerType, StoreLike, State, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND, ABILITY_USED, WAS_ATTACK_USED, COIN_FLIP_PROMPT, ADD_PARALYZED_TO_PLAYER_ACTIVE, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ErikasTangela extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.ERIKAS];
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Gathering of Blossoms',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may use this Ability. Search your deck for an Erika\'s Pokémon, reveal it, and put it into your hand. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Bind',
    cost: [G, C],
    damage: 50,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Paralyzed.'
  }];

  public regulationMark = 'I';
  public set: string = 'ASC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Erika\'s Tangela';
  public fullName: string = 'Erika\'s Tangela MC';

  public readonly COLORFUL_RIOT_MARKER = 'COLORFUL_RIOT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Colorful Riot ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.COLORFUL_RIOT_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const blocked: number[] = [];
      player.deck.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.tags.includes(CardTag.ERIKAS)) {
          return;
        } else {
          blocked.push(index);
        }
      });

      SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_INTO_HAND(
        store, state, player, {}, { min: 0, max: 1, blocked }
      );

      player.marker.addMarker(this.COLORFUL_RIOT_MARKER, this);
      ABILITY_USED(player, this);
    }

    // Bind attack - coin flip for Paralyzed
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    // Reset marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.COLORFUL_RIOT_MARKER, this)) {
      effect.player.marker.removeMarker(this.COLORFUL_RIOT_MARKER, this);
    }

    return state;
  }
}