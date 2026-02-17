import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State, StateUtils, GamePhase } from '../../game';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class AlolanSandslash extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Alolan Sandshrew';
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C];

  public readonly SPIKE_ARMOR_MARKER = 'ALOLAN_SANDSLASH_UPR_SPIKE_ARMOR_MARKER';
  public readonly CLEAR_SPIKE_ARMOR_MARKER = 'ALOLAN_SANDSLASH_UPR_CLEAR_SPIKE_ARMOR_MARKER';

  public attacks = [
    {
      name: 'Spike Armor',
      cost: [],
      damage: 30,
      text: 'During your opponent\'s next turn, if this Pokémon is damaged by an attack (even if this Pokémon is Knocked Out), put 6 damage counters on the Attacking Pokémon.'
    },
    {
      name: 'Frost Breath',
      cost: [W, C, C],
      damage: 90,
      text: ''
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Alolan Sandslash';
  public fullName: string = 'Alolan Sandslash UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Spike Armor
    // Ref: set-breakpoint/sigilyph.ts (Reflective Shield - AfterDamageEffect with counter damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.SPIKE_ARMOR_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_SPIKE_ARMOR_MARKER, this);
    }

    // Put 6 damage counters (60 damage) on attacker when this Pokemon is damaged
    if (effect instanceof AfterDamageEffect && effect.target.cards.includes(this)
      && effect.target.getPokemonCard() === this) {
      if (effect.target.marker.hasMarker(this.SPIKE_ARMOR_MARKER, this)) {
        const targetPlayer = StateUtils.findOwner(state, effect.target);
        const attackingPlayer = effect.player;

        if (effect.damage > 0 && attackingPlayer !== targetPlayer
          && targetPlayer.active === effect.target
          && state.phase === GamePhase.ATTACK) {
          effect.source.damage += 60;
        }
      }
    }

    // Clean up marker at end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_SPIKE_ARMOR_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_SPIKE_ARMOR_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.SPIKE_ARMOR_MARKER, this);
      });
    }

    return state;
  }
}
