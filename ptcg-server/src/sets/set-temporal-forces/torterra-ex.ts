import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { HealTargetEffect } from '../../game/store/effects/attack-effects';

export class Torterraex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Grotle';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 340;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Forest March',
      cost: [CardType.GRASS],
      damage: 30,
      damageCalculation: 'x',
      text: 'This attack does 30 damage for each [G] Pokémon you have in play.'
    },
    {
      name: 'Jungle Hammer',
      cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 150,
      text: 'Heal 50 damage from this Pokémon.'
    }
  ];

  public set: string = 'TEF';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public name: string = 'Torterra ex';

  public fullName: string = 'Torterra ex TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const playerBench = player.bench;

      let grassPokemon = 0;

      playerBench.forEach(c => {
        if (c.getPokemonCard() instanceof PokemonCard) {
          if (c.getPokemonCard()?.cardType == CardType.GRASS) {
            console.log(c.getPokemonCard()?.stage);
            grassPokemon++;
          }
        }
      });

      effect.damage = (grassPokemon + 1) * 30;

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      const healTargetEffect = new HealTargetEffect(effect, 30);
      healTargetEffect.target = player.active;
      state = store.reduceEffect(state, healTargetEffect);

    }
    return state;
  }

}

