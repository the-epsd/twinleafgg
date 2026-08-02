import {
  CardTag,
  CardType,
  GameError,
  GameMessage,
  PlayerType,
  PokemonCard,
  PokemonCardList,
  PowerType,
  SlotType,
  Stage,
  State,
  StateUtils,
  StoreLike,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import {
  BLOCK_IF_GX_ATTACK_USED,
  PREVENT_DAMAGE,
  PREVENT_EFFECTS_OF_ATTACKS,
  WAS_ATTACK_USED,
  WAS_POWER_USED,
} from '../../../game/store/prefabs/prefabs';

export class DawnWingsNecrozmaGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 180;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Invasion',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may switch it with your Active Pokémon.'
  }];

  public attacks = [{
    name: 'Dark Flash',
    cost: [P, P, P],
    damage: 120,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  },
  {
    name: 'Moon\'s Eclipse-GX',
    cost: [P, P, P],
    damage: 180,
    text: 'You can use this attack only if you have more Prize cards remaining than your opponent. Prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'UPR';
  public setNumber: string = '63';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dawn Wings Necrozma-GX';
  public fullName: string = 'Dawn Wings Necrozma-GX UPR';

  public readonly INVASION_MARKER = 'INVASION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.INVASION_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      let bench: PokemonCardList | undefined;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (card === this && target.slot === SlotType.BENCH) {
          bench = cardList;
        }
      });

      if (bench === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.marker.hasMarker(this.INVASION_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.INVASION_MARKER, this);
      player.switchPokemon(bench);
      return state;
    }

    // Dark Flash
    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.ignoreResistance = true;
    }

    // Moon's Eclipse-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() <= opponent.getPrizeLeft()) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;
      PREVENT_DAMAGE(store, state, effect, this);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.INVASION_MARKER, this)) {
      effect.player.marker.removeMarker(this.INVASION_MARKER, this);
    }

    return state;
  }
}
