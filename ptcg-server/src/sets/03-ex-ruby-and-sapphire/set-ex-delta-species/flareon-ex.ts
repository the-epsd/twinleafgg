import { PokemonCard, Stage, CardTag, CardType, Power, PowerType, StoreLike, State, StateUtils } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { JUST_EVOLVED, IS_POKEPOWER_BLOCKED, CONFIRMATION_PROMPT, ADD_BURN_TO_PLAYER_ACTIVE, ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF } from "../../../game/store/prefabs/prefabs";
import { THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/effect-of-attack-prefabs";

export class Flareonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C];

  public powers: Power[] = [{
    name: 'Evolutionary Flame',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Flareon ex from your hand to evolve 1 of your Pokémon, you may choose 1 of the Defending Pokémon. That Pokémon is now Burned and Confused.'
  }];

  public attacks = [{
    name: 'Flame Screen',
    cost: [R, C],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Flareon ex by attacks is reduced by 20 (after applying Weakness and Resistance).'
  },
  {
    name: 'Heat Tackle',
    cost: [R, C, C],
    damage: 70,
    text: 'Flareon ex does 10 damage to itself.'
  }];

  public set: string = 'DS';
  public setNumber: string = '108';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Flareon ex';
  public fullName: string = 'Flareon ex DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Evolutionary Flame
    if (JUST_EVOLVED(effect, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);

      if (IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_BURN_TO_PLAYER_ACTIVE(store, state, opponent, this);
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
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