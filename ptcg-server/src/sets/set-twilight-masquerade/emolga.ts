import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';


export class Emolga extends PokemonCard {

  public regulationMark = 'H';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [ {type: CardType.FIGHTING} ];

  public retreat = [ ];

  public attacks = [
    {
      name: 'Sky Wave',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: 'This attack also does 10 damage to each Benched Pokémon (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '69';

  public name: string = 'Emolga';

  public fullName: string = 'Emolga TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      effect.damage = 10;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList === opponent.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList === player.active) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 10);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }

}
