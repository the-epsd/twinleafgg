import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Metagross extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Metang';
  public cardType: CardType = M;
  public hp: number = 170;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Levitation Field',
    powerType: PowerType.ABILITY,
    text: 'Your Pokémon in play have no Retreat Cost.'
  }];

  public attacks = [
    {
      name: 'Leg Quake',
      cost: [M, C, C],
      damage: 100,
      text: 'If the Defending Pokémon is an Evolution Pokémon, it can\'t attack during your opponent\'s next turn.'
    }
  ];

  public regulationMark: string = 'D';
  public set: string = 'VIV';
  public setNumber: string = '118';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Metagross';
  public fullName: string = 'Metagross VIV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Levitation Field
    // Ref: set-rebel-clash/cinderace-v.ts (CheckRetreatCostEffect)
    if (effect instanceof CheckRetreatCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player || !StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      effect.cost = [];
    }

    // Leg Quake
    // Ref: set-battle-styles/conkeldurr.ts (Hammer Pressure)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const defending = effect.opponent.active.getPokemonCard();
      if (defending && defending.stage !== Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
