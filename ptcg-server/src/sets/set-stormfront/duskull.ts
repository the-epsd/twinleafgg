import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { GameError, GameMessage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_MARKER, COIN_FLIP_PROMPT, HAS_MARKER, REMOVE_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Duskull extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: D, value: +10 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Counting Song',
    cost: [],
    damage: 0,
    text: 'Put up to 3 damage counters on Duskull. Then, put that many damage counters on the Defending Pokémon.'
  },
  {
    name: 'Ram',
    cost: [P],
    damage: 10,
    text: ''
  },
  {
    name: 'Night Bind',
    cost: [P, C],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent can\'t attach any Energy cards from his or her hand to the Active Pokémon during his or her next turn.'
  }];

  public set: string = 'SF';
  public name: string = 'Duskull';
  public fullName: string = 'Duskull SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = 'SH2';

  public readonly NIGHT_BIND_MARKER = 'NIGHT_BIND_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      effect.source.damage += 30;
      PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(3, store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 2, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_MARKER(this.NIGHT_BIND_MARKER, effect.opponent, this);
        }
      });
    }

    if (effect instanceof AttachEnergyEffect && effect.target === effect.player.active && HAS_MARKER(this.NIGHT_BIND_MARKER, effect.player, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect) {
      if (HAS_MARKER(this.NIGHT_BIND_MARKER, effect.player, this)) {
        REMOVE_MARKER(this.NIGHT_BIND_MARKER, effect.player, this);
      }
    }

    return state;
  }
}