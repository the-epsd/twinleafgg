import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/game-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { State, StoreLike } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class ConkeldurrV extends PokemonCard {

  public stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_V];

  public cardType = CardType.FIGHTING;

  public hp = 230;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Counter',
      cost: [CardType.FIGHTING],
      damage: 20,
      damageCalculation: '+',
      text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does that much more damage.'
    },
    {
      name: 'Dynamic Punch',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 90,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 90 more damage, and your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public set: string = 'PGO';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '40';

  public name: string = 'Conkeldurr V';

  public fullName: string = 'Conkeldurr V PGO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const activeCard = effect.player.active.getPokemonCard();
      if (activeCard !== undefined && activeCard.damageTakenLastTurn !== undefined) {
        effect.damage += activeCard.damageTakenLastTurn;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const coinFlipEffect = new CoinFlipEffect(effect.player, (result: boolean) => {
        if (result) {
          effect.damage += 90;
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.CONFUSED]);
          state = store.reduceEffect(state, specialConditionEffect);
        }
      });
      state = store.reduceEffect(state, coinFlipEffect);
    }

    return state;
  }
}