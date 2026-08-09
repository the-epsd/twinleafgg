import { PokemonCard, CardTag, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, HEAL_X_DAMAGE_FROM_THIS_POKEMON } from "../../../game/store/prefabs/prefabs";
import { THIS_POKEMON_HAS_NO_WEAKNESS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class AltariaEx extends PokemonCard {
  public tags = [CardTag.POKEMON_EX];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 170;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Powerful Gain',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'If this Pokémon was healed during this turn, this attack does 60 more damage and heal 30 damage from this Pokémon.'
  },
  {
    name: 'Shining Wind',
    cost: [C, C, C],
    damage: 80,
    text: 'During your opponent\'s next turn, this Pokémon has no Weakness.'
  }];

  public set: string = 'FCO';
  public setNumber: string = '83';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Altaria-EX';
  public fullName: string = 'Altaria-EX FCO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.player.active.healedThisTurn) {
        effect.damage += 60;
        HEAL_X_DAMAGE_FROM_THIS_POKEMON(effect, store, state, 30);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      return THIS_POKEMON_HAS_NO_WEAKNESS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    return state;
  }
}
