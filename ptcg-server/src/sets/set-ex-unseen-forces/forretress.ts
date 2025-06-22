import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, EnergyCard, AttachEnergyPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';

export class Forretress extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pineco';
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Spiky Shell',
    cost: [C, C],
    damage: 20,
    text: 'Put 3 damage counters on the Defending Pokémon at the end of your opponent\'s next turn.'
  },
  {
    name: 'Pop',
    cost: [M, C, C, C],
    damage: 100,
    text: 'Put 7 damage counters on Forretress. Move all Energy cards attached to Forretress to your Benched Pokémon in any way you like. (Ignore this effect if you don\'t have any Benched Pokémon.)'
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '6';
  public name: string = 'Forretress';
  public fullName: string = 'Forretress UF';

  public readonly COUNTERS_MARKER = 'COUNTERS_MARKER';
  public readonly CLEAR_COUNTERS_MARKER = 'CLEAR_COUNTERS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      // Apply Spiky Shell effect at the end of opponent's next turn
      effect.player.marker.addMarker(this.COUNTERS_MARKER, this);
      opponent.active.marker.addMarker(this.CLEAR_COUNTERS_MARKER, this);
    }

    // 30 damage to opponent's active if end turn and counters marker is present
    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.CLEAR_COUNTERS_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.player.active.damage += 30;
      effect.player.active.marker.removeMarker(this.CLEAR_COUNTERS_MARKER, this);
      opponent.marker.removeMarker(this.COUNTERS_MARKER, this);
    }
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.COUNTERS_MARKER, this);

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // 7 damage counters on Forretress
      const putCounters = new PutCountersEffect(effect, 70);
      putCounters.target = effect.source;
      store.reduceEffect(state, putCounters);

      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (hasBench === false) {
        return state;
      }

      // Get attached energy cards
      const attachedEnergies = player.active.cards.filter(card => {
        return card instanceof EnergyCard;
      });

      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.active,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: attachedEnergies.length, max: attachedEnergies.length }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.active.moveCardTo(transfer.card, target);
        }
      });
    }

    return state;
  }
}