import {
  PlayerType,
  State, StateUtils,
  StoreLike
} from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Raichu extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Pikachu';

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Collateral Bolts',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage to each other Pokémon in play with any damage counters on it. (Both yours and your opponent\'s. Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Electric Ball',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'TEF';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '52';

  public name: string = 'Raichu';

  public fullName: string = 'Raichu TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0) {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage > 0 && card !== this) {
          const damageEffect = new PutDamageEffect(effect, 50);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
      return state;
    }
    return state;
  }
}