import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Hitmonchan extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Counter Punch',
    cost: [F],
    damage: 0,
    text: 'During your opponent\'s next turn, if Hitmonchan is damaged by an opponent\'s attack (even if Hitmonchan is Knocked Out), put 4 damage counters on the Attacking Pokémon.'
  },
  {
    name: 'Gut Strike',
    cost: [F, C],
    damage: 30,
    text: 'If Tyrogue is anywhere under Hitmonchan, this attack\'s base damage is 60 instead of 30.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '99';
  public name: string = 'Hitmonchan';
  public fullName: string = 'Hitmonchan LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Counter Punch
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return THIS_POKEMON_RETALIATES_ON_DAMAGE_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this, { damage: 40 });
    }

    // Gut Strike
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.player.active.cards.some(c => c.name === 'Tyrogue')) {
        effect.damage = 60;
      }
    }

    return state;
  }
}
