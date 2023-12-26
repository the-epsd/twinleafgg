import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, Card } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect, ApplyWeaknessEffect, AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class SingleStrikeUrshifuVMAX extends PokemonCard {

  public stage: Stage = Stage.VMAX;

  public evolvesFrom = 'Single Strike Urshifu V';

  public regulationMark = 'E';

  public tags = [ CardTag.POKEMON_VMAX, CardTag.SINGLE_STRIKE ];

  public cardType: CardType = CardType.FIGHTING;

  public hp: number = 330;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Beatdown',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 100,
      text: ''
    },
    {
      name: 'G-Max One Blow',
      cost: [ CardType.FIGHTING, CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS ],
      damage: 270,
      text: 'Discard all Energy from this Pokémon. This attack\'s damage isn\'t affected by any effects on your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'BST';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name: string = 'Single Strike Urshifu VMAX';

  public fullName: string = 'Single Strike Urshifu VMAX BST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
  
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const applyWeakness = new ApplyWeaknessEffect(effect, this.attacks[1].damage);
      store.reduceEffect(state, applyWeakness);
      const damage = applyWeakness.damage;
    
      effect.damage = 0;
    
      if (damage > 0) {
        opponent.active.damage += damage;
        const afterDamage = new AfterDamageEffect(effect, damage);
        state = store.reduceEffect(state, afterDamage);
      }
      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }
    return state;
  }
}