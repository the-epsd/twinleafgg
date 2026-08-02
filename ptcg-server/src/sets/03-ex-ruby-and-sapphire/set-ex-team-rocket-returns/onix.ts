import { PokemonCard, Stage, CardType, StoreLike, State } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN } from "../../../game/store/prefabs/prefabs";

export class Onix extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Horn Rush',
    cost: [C],
    damage: 10,
    text: 'Flip a coin. If tails, this attack does nothing.'
  },
  {
    name: 'Granite Head',
    cost: [F, C],
    damage: 20,
    text: 'During your opponent\'s next turn, any damage done to Onix by attacks is reduced by 10 (after applying Weakness and Resistance).'
  }];

  public set: string = 'TRR';
  public setNumber: string = '69';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Onix';
  public fullName: string = 'Onix TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    // Granite Head
    if (WAS_ATTACK_USED(effect, 1, this)) {
      return THIS_POKEMON_TAKES_LESS_DAMAGE_FROM_ATTACKS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, 10);
    }

    return state;
  }
}