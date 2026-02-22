import { PokemonCard, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike, GameError, CardTag, Stage } from '../../game';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { StateUtils } from '../../game/store/state-utils';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MedichamV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType = F;
  public hp = 210;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Yoga Loop',
    cost: [C, C],
    damage: 0,
    text: 'Put 2 damage counters on 1 of your opponent\'s Pokémon. If your opponent\'s Pokémon is Knocked Out by this attack, take another turn after this one. (Skip Pokémon Checkup.) If 1 of your Pokémon used Yoga Loop during your last turn, this attack can\'t be used.'
  },
  {
    name: 'Smash Uppercut',
    cost: [F, C, C],
    damage: 100,
    text: 'This attack\'s damage isn\'t affected by Resistance.'
  }];

  public regulationMark = 'E';
  public set: string = 'EVS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '83';
  public name: string = 'Medicham V';
  public fullName: string = 'Medicham V EVS';

  public readonly YOGA_LOOP_MARKER = 'YOGA_LOOP_MARKER';
  public readonly YOGA_LOOP_MARKER_2 = 'YOGA_LOOP_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
      effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER_2, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER_2, this)) {
      // Second turn ending - clear everything
      effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
      effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER_2, this);
      effect.player.usedTurnSkip = false;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
      // First turn ending - mark for cleanup next turn
      effect.player.marker.addMarker(this.YOGA_LOOP_MARKER_2, this);
      // DON'T clear usedTurnSkip here - it needs to stay true for initNextTurn
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Check if Yoga Loop was used last turn
      if (player.marker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.length === 0) {
          return state;
        }

        const target = targets[0];
        const putCountersEffect = new PutCountersEffect(effect, 20);
        putCountersEffect.target = target;
        state = store.reduceEffect(state, putCountersEffect);

        // Check if target was knocked out
        const targetOwner = StateUtils.findOwner(state, target);
        const checkHpEffect = new CheckHpEffect(targetOwner, target);
        store.reduceEffect(state, checkHpEffect);

        if (target.damage >= checkHpEffect.hp) {
          // Pokémon was knocked out - set marker and enable turn skip
          player.marker.addMarker(this.YOGA_LOOP_MARKER, this);
          player.usedTurnSkip = true;
        }

        return state;
      });
    }
    return state;
  }
}
