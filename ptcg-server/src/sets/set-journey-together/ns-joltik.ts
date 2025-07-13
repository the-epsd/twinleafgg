import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';

export class NsJoltik extends PokemonCard {
  public tags = [CardTag.NS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 40;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Crackling Short',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Before doing damage, discard all Pokémon Tool cards from your opponent\'s Active Pokémon. If you discarded a Pokémon Tool card in this way, your opponent\'s Active Pokémon is now Paralyzed.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'JTG';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'N\'s Joltik';
  public fullName: string = 'N\'s Joltik JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.active.tools.length > 0) {
        opponent.active.moveCardsTo([...opponent.active.tools], opponent.discard);
        const specialCondition = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        return store.reduceEffect(state, specialCondition);
      }
    }
    return state;
  }
}