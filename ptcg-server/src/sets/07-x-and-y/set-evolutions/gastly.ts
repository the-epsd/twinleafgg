import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED, AFTER_ATTACK, COIN_FLIP_PROMPT, ADD_SLEEP_TO_PLAYER_ACTIVE } from '../../../game/store/prefabs/prefabs';
import { DISCARD_ATTACKER_ENERGY_IF_THIS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Gastly extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 40;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Little Grudge',
    cost: [P],
    damage: 0,
    text: 'During your opponent\'s next turn, if this Pokémon is Knocked Out by damage from an attack, discard an Energy attached to the Attacking Pokémon.'
  }, {
    name: 'Nightmare',
    cost: [P, C],
    damage: 20,
    text: 'Flip a coin. If heads, your opponent\'s Active Pokémon is now Asleep.'
  }];

  public set: string = 'EVO';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Gastly';
  public fullName: string = 'Gastly EVO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DISCARD_ATTACKER_ENERGY_IF_THIS_POKEMON_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
    }

    if (AFTER_ATTACK(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, effect.opponent, this);
        }
      });
    }

    return state;
  }
}
