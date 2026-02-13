import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import {
  StoreLike, State,
  PlayerType,
  StateUtils
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Hoopaex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 220;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Energy Crush',
      cost: [CardType.DARK, CardType.DARK],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each Energy attached to all of your opponent\'s Pokémon.'
    },
    {
      name: 'Bandit\'s Fist',
      cost: [CardType.DARK, CardType.DARK, CardType.DARK],
      damage: 200,
      text: 'During your next turn, this Pokémon can\'t use Bandit\'s Fist.'
    }
  ];


  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '98';

  public name: string = 'Hoopa ex';

  public fullName: string = 'Hoopa ex PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let totalEnergy = 0;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        totalEnergy += cardList.cards.filter(c => c.superType === SuperType.ENERGY).length;
      });
      effect.damage = totalEnergy * 50;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Bandit\'s Fist')) {
        player.active.cannotUseAttacksNextTurnPending.push('Bandit\'s Fist');
      }
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}