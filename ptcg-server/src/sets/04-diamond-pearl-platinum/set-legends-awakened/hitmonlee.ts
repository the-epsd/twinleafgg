import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Hitmonlee extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Gut Kick',
    cost: [F, C],
    damage: 30,
    text: 'If Tyrogue is anywhere under Hitmonlee, you may do 30 damage to any 1 Benched Pokémon instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Mega Kick',
    cost: [F, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '100';
  public name: string = 'Hitmonlee';
  public fullName: string = 'Hitmonlee LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gut Kick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const hasTyrogue = effect.player.active.cards.some(c => c.name === 'Tyrogue');
      if (hasTyrogue && effect.opponent.bench.some(b => b.cards.length > 0)) {
        CONFIRMATION_PROMPT(store, state, effect.player, result => {
          if (result) {
            effect.damage = 0;
            THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_BENCHED_POKEMON(30, effect, store, state);
          }
        });
      }
    }

    return state;
  }
}
