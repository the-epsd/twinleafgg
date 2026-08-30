import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_TRAINER_CARDS } from '../../game/store/prefabs/effect-of-attack-prefabs';

export class Psyduck extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [W];
  public hp: number = 50;
  public weakness = [{ type: L }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Headache',
    cost: [P],
    damage: 0,
    text: 'Your opponent can\'t play Trainer cards during his or her next turn.'
  },
  {
    name: 'Fury Swipes',
    cost: [W],
    damage: 10,
    damageCalculation: 'x',
    text: 'Flip 3 coins. This attack does 10 damage times the number of heads.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Psyduck';
  public fullName: string = 'Psyduck FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Headache
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_TRAINER_CARDS(store, state, effect, this);
    }

    // Fury Swipes
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      state = MULTIPLE_COIN_FLIPS_PROMPT(store, state, player, 3, results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 10 * heads;
      });
      return state;
    }
    return state;
  }
}
