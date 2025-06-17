import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  PowerType, StoreLike, State, GameError, GameMessage,
  StateUtils,
  PlayerType,
  ChoosePokemonPrompt,
  SlotType
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shelgon';
  public cardType: CardType = C;
  public hp: number = 120;
  public weakness = [{ type: C }];
  public resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Dragon Wind',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Salamence is your Active Pokémon, you may switch 1 of your opponent\'s Benched Pokémon with 1 of the Defending Pokémon. Your opponent chooses the Defending Pokémon to switch.This power can\'t be used if Salamence is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Agility',
    cost: [C, C],
    damage: 20,
    text: 'Flip a coin. If heads, prevent all effects of an attack, including damage, done to Salamence during your opponent\'s next turn.'
  },
  {
    name: 'Dragon Claw',
    cost: [R, W, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence DR';

  public readonly DRAGON_WIND_MARKER = 'DRAGON_WIND_MARKER';
  public readonly AGILITY_MARKER = 'AGILITY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Magnetic Field
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      // One per turn only
      if (HAS_MARKER(this.DRAGON_WIND_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];

        if (cardList) {
          opponent.switchPokemon(cardList);
        }
      });

      ADD_MARKER(this.DRAGON_WIND_MARKER, player, this);
      ABILITY_USED(player, this);

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          this.marker.addMarker(this.AGILITY_MARKER, this);
          ADD_MARKER(this.AGILITY_MARKER, effect.opponent, this);
        }
      });
    }

    if ((effect instanceof PutDamageEffect || effect instanceof PutCountersEffect) && effect.target.getPokemonCard() === this) {
      if (this.marker.hasMarker(this.AGILITY_MARKER, this)) {
        effect.preventDefault = true;
      }
    }

    if (effect instanceof EndTurnEffect && HAS_MARKER(this.AGILITY_MARKER, effect.player, this)) {
      REMOVE_MARKER(this.AGILITY_MARKER, effect.player, this);
      this.marker.removeMarker(this.AGILITY_MARKER, this);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DRAGON_WIND_MARKER, this);
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.DRAGON_WIND_MARKER, player, this);
    }

    return state;
  }
}
