import { CardTag, CardType, PokemonCard, Power, PowerType, SpecialCondition, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { APPLY_SPECIAL_CONDITIONS_FROM_ABILITY } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Flareonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  protected _tags = [CardTag.POKEMON_ex];
  public hp: number = 110;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Evolutionary Flame',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Flareon ex from your hand to evolve 1 of your Pokémon, you may choose 1 of the Defending Pokémon. That Pokémon is now Burned and Confused.',
  }];

  public attacks = [{
    name: 'Flame Screen',
    cost: [R, C],
    damage: 30,
    text: "During your opponent's next turn, any damage done to Flareon ex by attacks is reduced by 20 (after applying Weakness and Resistance).",
  },
  {
    name: 'Heat Tackle',
    cost: [R, C, C],
    damage: 70,
    text: 'Flareon ex does 10 damage to itself.',
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '108';
  public name: string = 'Flareon ex';
  public fullName: string = 'Flareon ex DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evolutionary Flame
    if (JUST_EVOLVED(effect, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, (result) => {
        if (result) {
          APPLY_SPECIAL_CONDITIONS_FROM_ABILITY(
            store,
            state,
            effect.player,
            this.powers[0],
            this,
            opponent.active,
            [SpecialCondition.BURNED, SpecialCondition.CONFUSED],
          );
        }
      });
    }

    // Flame Screen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 20);
    }

    // Heat Tackle
    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 10);
    }

    return state;
  }
}
