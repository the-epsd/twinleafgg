import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class RotasMimeJr extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 50;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Teeter Dance',
    cost: [C],
    damage: 0,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Confused. If tails, both the Defending Pokémon and Rota\'s Mime Jr. are now Confused.'
  }];

  public set: string = 'PCGP';
  public name: string = 'Rota\'s Mime Jr.';
  public fullName: string = 'Rota\'s Mime Jr. PCGP 86';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result: boolean) => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
        } else {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
        }
      });
    }

    return state;
  }

}
