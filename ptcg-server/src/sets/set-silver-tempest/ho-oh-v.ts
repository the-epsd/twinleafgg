import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class HoOhV extends PokemonCard {
  public tags = [CardTag.POKEMON_V];
  public regulationMark = 'F';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 230;
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Reviving Flame',
    useFromDiscard: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in your discard pile, you may put it onto your Bench. If you do, attach up to 4 basic Energy cards from your discard pile to this Pokémon. If you use this Ability, your turn ends.',
  }];

  public attacks = [{
    name: 'Rainbow Burn',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 100,
    damageCalculation: '+',
    text: 'This attack does 30 more damage for each type of basic Energy attached to this Pokémon.',
  }];

  public set: string = 'SVT';
  public name: string = 'Ho-Oh V';
  public fullName: string = 'Ho-Oh V SVT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '001';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return super.reduceEffect(store, state, effect);
  }
}
