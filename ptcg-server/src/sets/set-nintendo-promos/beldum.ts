import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State,
  GameMessage,
  GameError
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Beldum extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = M;
  public hp: number = 50;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Magnetic Call',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, search your deck for a [M] Basic Pokémon and put it onto your Bench. Shuffle your deck afterward. This power can\'t be used if Beldum is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Metal Charge',
    cost: [M, C],
    damage: 30,
    text: 'Put 1 damage counter on Beldum.'
  }];

  public set: string = 'NP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Beldum';
  public fullName: string = 'Beldum NP';

  public readonly MAGNETIC_CALL_MARKER = 'MAGNETIC_CALL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.MAGNETIC_CALL_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.MAGNETIC_CALL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      ADD_MARKER(this.MAGNETIC_CALL_MARKER, player, this);

      COIN_FLIP_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(store, state, effect.player, { cardType: CardType.METAL, stage: Stage.BASIC }, { min: 0, max: 1, allowCancel: false });
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.player.active.damage += 10;
    }

    return state;
  }
}