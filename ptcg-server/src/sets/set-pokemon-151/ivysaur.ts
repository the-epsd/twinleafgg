import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';

function* useLeechSeed(next: () => any, store: StoreLike, state: State, effect: AttackEffect) {
  const player = effect.player;
  const healTargetEffect = new HealTargetEffect(effect, 20);
  healTargetEffect.target = player.active;
  state = store.reduceEffect(state, healTargetEffect);
  return state; 
}

export class Ivysaur extends PokemonCard {

  public regulationMark = 'G';
  
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.GRASS;
  public hp: number = 100;
  public weakness = [{ type: CardType.FIRE }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public attacks = [
    {
      name: 'Leech Seed',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 30,
      text: 'Heal 20 damage from this Pokémon.'
    },
    {
      name: 'Vine Whip',
      cost: [CardType.GRASS, CardType.GRASS, CardType.COLORLESS],
      damage: 80,
      text: ''
    }
  ];
  public set: string = '151';
  public name: string = 'Ivysaur';
  public fullName: string = 'Ivysaur MEW 002';
  
  reduceEffect( store: StoreLike, state: State, effect: Effect) {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useLeechSeed(() => generator.next(), store, state, effect as AttackEffect);
    }
    return state;
  }
}
