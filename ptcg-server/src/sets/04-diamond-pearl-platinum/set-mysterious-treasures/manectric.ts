import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, PlayerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Manectric extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Electrike';
  public hp: number = 80;
  public cardType: CardType[] = [L];
  public weakness = [{ type: F, value: +20 }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [];

  public attacks = [{
    name: 'Lightning Twister',
    cost: [C],
    damage: 20,
    damageCalculation: 'x',
    text: 'Does 20 damage times the number of basic Energy cards attached to Manectric.'
  }, {
    name: 'Chain Lightning',
    cost: [L, L, L],
    damage: 70,
    text: 'Does 20 damage to each of your opponent\'s Benched Pokémon that is the same type as the Defending Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '28';
  public name: string = 'Manectric';
  public fullName: string = 'Manectric MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const basicCount = player.active.cards.filter(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC
      ).length;
      effect.damage = basicCount * 20;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();
      if (!defending) {
        return state;
      }

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (cardList === opponent.active) {
          return;
        }
        const sharesType = card.cardType.some(t => defending.cardType.includes(t));
        if (sharesType) {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}
