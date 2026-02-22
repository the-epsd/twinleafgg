import { CardTag, CardType, PokemonCard, Stage, PowerType, State, StoreLike, GameMessage, GameError, PlayerType, BoardEffect } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { IS_ABILITY_BLOCKED, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class MegaDragoniteex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dragonair';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = N;
  public hp: number = 370;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C];

  public powers = [{
    name: 'Sky Transport',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may use this Ability. Switch your Active Pokémon with 1 of your Benched Pokémon.'
  }];

  public attacks = [{
    name: 'Ryuno Glide',
    cost: [W, L, L],
    damage: 330,
    text: 'Discard 2 Energy from this Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'ASC';
  public setNumber: string = '152';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Dragonite ex';
  public fullName: string = 'Mega Dragonite ex M2a';

  public readonly SKY_CARRY_MARKER = 'SKY_CARRY_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Reset marker when Pokemon is played
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.SKY_CARRY_MARKER, this);
    }

    // Reset marker at end of turn
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SKY_CARRY_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.SKY_CARRY_MARKER, this);
    }

    // Sky Transport ability
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if ability is blocked
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      // Check if ability was already used this turn
      if (player.marker.hasMarker(this.SKY_CARRY_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      // Check if player has benched Pokémon
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Switch Active with Benched Pokémon
      SWITCH_ACTIVE_WITH_BENCHED(store, state, player);

      // Mark ability as used
      player.marker.addMarker(this.SKY_CARRY_MARKER, this);

      // Add visual effect
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }

    // Ryuno Glide attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
    }

    return state;
  }
}