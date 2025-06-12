import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, CONFIRMATION_PROMPT, IS_POKEMON_POWER_BLOCKED, JUST_EVOLVED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DarkDragonite extends PokemonCard {
  public tags = [CardTag.DARK];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dark Dragonair';
  public cardType: CardType = C;
  public hp: number = 70;
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Summon Minions',
    powerType: PowerType.POKEMON_POWER,
    text: 'When you play Dark Dragonite from your hand, search your deck for up to 2 Basic Pokémon and put them onto your Bench. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Giant Tail',
    cost: [C, C, C, C],
    damage: 70,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'TR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '5';
  public name: string = 'Dark Dragonite';
  public fullName: string = 'Dark Dragonite TR';

  public readonly EVOLUTIONARY_LIGHT_MARKER = 'EVOLUTIONARY_LIGHT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.EVOLUTIONARY_LIGHT_MARKER, player, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.EVOLUTIONARY_LIGHT_MARKER, this);

    if (JUST_EVOLVED(effect, this) && !IS_POKEMON_POWER_BLOCKED(store, state, effect.player, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          SEARCH_YOUR_DECK_FOR_POKEMON_AND_PUT_ONTO_BENCH(
            store,
            state,
            player,
            { stage: Stage.BASIC },
            { min: 0, max: 2, allowCancel: false }
          );
        }
      }
      )
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      })
    }

    return state;
  }
}