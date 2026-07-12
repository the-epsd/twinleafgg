import { CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../../game';
import { KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON, KNOCK_OUT_PLAYERS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Annihilape extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Primeape';
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness: Weakness[] = [{ type: P }];
  public retreat: CardType[] = [C, C];

  public attacks = [{
    name: 'Tantrum',
    cost: [F],
    damage: 130,
    text: 'This Pokémon is now Confused.'
  },
  {
    name: 'Destined Fight',
    cost: [F, C],
    damage: 0,
    text: 'Both Active Pokémon are Knocked Out.'
  }];

  public set: string = 'SSP';
  public regulationMark: string = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Annihilape';
  public fullName: string = 'Annihilape SSP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Tantrum
    if (WAS_ATTACK_USED(effect, 0, this)) {
      ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
    }

    // Destined Fight
    if (WAS_ATTACK_USED(effect, 1, this)) {
      KNOCK_OUT_PLAYERS_ACTIVE_POKEMON(store, state, effect);
      KNOCK_OUT_OPPONENTS_ACTIVE_POKEMON(store, state, effect);
    }

    return state;
  }
}