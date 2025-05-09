import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, PlayerType, PowerType, GameError, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { ABILITY_USED, ADD_BURN_TO_PLAYER_ACTIVE, ADD_PARALYZED_TO_PLAYER_ACTIVE, ADD_POISON_TO_PLAYER_ACTIVE, BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class VileplumeGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX];
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gloom';
  public cardType: CardType = G;
  public hp: number = 240;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public powers = [{
    name: 'Fragrant Flower Garden',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may heal 30 damage from each of your Pokémon.',
    useWhenInPlay: true
  }];

  public attacks = [
    {
      name: 'Massive Bloom',
      cost: [G, C],
      damage: 180,
      damageCalculation: '-',
      text: 'This attack does 10 less damage for each damage counter on this Pokémon.'
    },
    {
      name: 'Allergic Explosion-GX',
      cost: [G],
      damage: 50,
      gxAttack: true,
      text: 'Your opponent\'s Active Pokémon is now Burned, Paralyzed, and Poisoned. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Vileplume-GX';
  public fullName: string = 'Vileplume-GX CEC';

  public readonly FRAGRANT_FLOWER_GARDEN_MARKER = 'FRAGRANT_FLOWER_GARDEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this)) {
      const player = effect.player;
      player.marker.removeMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this);
    }

    // Fragrant Flower Garden
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      player.marker.addMarker(this.FRAGRANT_FLOWER_GARDEN_MARKER, this);
      ABILITY_USED(player, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 30);
        state = store.reduceEffect(state, healEffect);
      });
    }

    // Massive Bloom
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.damage -= effect.source.damage;
    }

    // Allergic Explosion-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      const opponent = StateUtils.getOpponent(state, player);
      ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
      ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, opponent, this);
      ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
    }

    return state;
  }
}
