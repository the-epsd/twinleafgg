import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Terrakion extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 140;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Cavern Counter',
      cost: [F, C, C],
      damage: 50,
      damageCalculation: '+' as '+',
      text: 'If all of your Benched Pokémon have at least 1 damage counter on them, this attack does 150 more damage.'
    },
    {
      name: 'Boulder Crush',
      cost: [F, F, C, C],
      damage: 110,
      text: ''
    }
  ];

  public set: string = 'UNM';
  public setNumber: string = '122';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Terrakion';
  public fullName: string = 'Terrakion UNM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Cavern Counter
    // Ref: set-unbroken-bonds/dugtrio.ts (Home Ground - conditional bonus damage)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const benchedPokemon = player.bench.filter(b => b.cards.length > 0);
      if (benchedPokemon.length > 0 && benchedPokemon.every(b => b.damage > 0)) {
        effect.damage += 150;
      }
    }

    return state;
  }
}
