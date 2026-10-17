import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { PowerType, Weakness } from '../../game/store/card/pokemon-types';
import { State } from '../../game/store/state/state';
import { StoreLike, StateUtils, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaceDamageCountersEffect } from '../../game/store/effects/game-effects';
import { IS_POKEMON_POWER_BLOCKED, ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT } from '../../game/store/prefabs/prefabs';

export class Machamp extends PokemonCard {

  public set = 'BS';

  public fullName = 'Machamp BS';

  public name = 'Machamp';

  public cardImage: string = 'assets/cardback.png';

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom: string = 'Machoke';

  public setNumber: string = '8';

  public hp: number = 100;

  public cardType: CardType[] = [CardType.FIGHTING];

  public weakness: Weakness[] = [{ type: CardType.PSYCHIC }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Strikes Back',
      powerType: PowerType.POKEMON_POWER,
      text: 'Whenever your opponent\'s attack damages Machamp (even if Machamp is Knocked Out), this power does 10 damage to the attacking Pokémon. (Don\'t apply Weakness and Resistance.) This power can\'t be used if Machamp is Asleep, Confused, or Paralyzed when your opponent attacks.'
    }
  ];

  public attacks = [
    {
      cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
      name: 'Seismic Toss',
      damage: 60,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (ON_DAMAGED_BY_OPPONENT_ATTACK_EVEN_IF_KNOCKED_OUT(state, effect, { source: this })) {
      const abilityOwner = StateUtils.findOwner(state, effect.target);
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (cardList.specialConditions.includes(SpecialCondition.ASLEEP) ||
        cardList.specialConditions.includes(SpecialCondition.CONFUSED) ||
        cardList.specialConditions.includes(SpecialCondition.PARALYZED)) {
        return state;
      }

      if (IS_POKEMON_POWER_BLOCKED(store, state, abilityOwner, this)) {
        return state;
      }

      const placeCounters = new PlaceDamageCountersEffect(
        abilityOwner,
        effect.source,
        10,
        this,
        this.powers[0],
      );
      store.reduceEffect(state, placeCounters);
    }

    return state;
  }
}
