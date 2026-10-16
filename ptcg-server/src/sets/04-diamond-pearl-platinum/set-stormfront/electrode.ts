import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../../game/store/effects/game-effects';
import { THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS, YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../../game/store/prefabs/attack-effects';
import { IS_POKEBODY_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Electrode extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Voltorb';
  public hp: number = 90;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public powers = [{
    name: 'Radiance',
    powerType: PowerType.POKEBODY,
    text: 'If Electrode is your Active Pokémon and is damaged by an opponent\'s attack (even if Electrode is Knocked Out), put 1 damage counter on each of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Low Current',
    cost: [L],
    damage: 30,
    text: 'If Electrode was damaged by an attack during your opponent\'s last turn, the Defending Pokémon is now Paralyzed.'
  },
  {
    name: 'Swift',
    cost: [C, C, C],
    damage: 60,
    text: 'This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on the Defending Pokémon.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '36';
  public name: string = 'Electrode';
  public fullName: string = 'Electrode SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Radiance
    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);
      if (IS_POKEBODY_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }
      const opponent = StateUtils.getOpponent(state, abilityOwner);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        const placeCounters = new PlaceDamageCountersEffect(
          abilityOwner,
          cardList,
          10,
          this,
          this.powers[0],
        );
        store.reduceEffect(state, placeCounters);
      });
    }

    // Low Current
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if ((this.damageTakenLastTurn ?? 0) > 0) {
        YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
      }
    }

    // Swift
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_ATTACKS_DAMAGE_ISNT_AFFECTED_BY_EFFECTS(store, state, effect, 60);
    }

    return state;
  }
}
