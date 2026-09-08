import { CardType, PokemonCard, Stage, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Carbink2 extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType[] = [Y];
  public hp: number = 90;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Wonder Ray',
    cost: [C, C],
    damage: 30,
    text: 'During your opponent\'s next turn, prevent all effects of attacks, including damage, done to this Pokémon by any Pokémon that has an Ability.'
  },
  {
    name: 'Power Gem',
    cost: [Y, C, C],
    damage: 60,
    text: ''
  }];

  public set: string = 'LOT';
  public setNumber: string = '143';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Carbink';
  public fullName: string = 'Carbink LOT 143';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wonder Ray
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const options = { sourceHasAbility: true };
      PREVENT_DAMAGE(store, state, effect, this, options);
      PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this, options);
    }

    return state;
  }
}
