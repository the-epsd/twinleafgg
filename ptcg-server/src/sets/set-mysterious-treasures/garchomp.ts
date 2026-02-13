import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { EnergyCard, PowerType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_POKEBODY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Garchomp extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Gabite';
  public cardType: CardType = C;
  public hp: number = 130;
  public weakness = [{ type: C, value: +30 }];
  public retreat = [];

  public powers = [{
    name: 'Rainbow Scale',
    powerType: PowerType.POKEBODY,
    text: 'If an Active Pokémon has Weakness to any of the types of Energy attached to Garchomp, Garchomp\'s attacks do 40 more damage to that Pokémon (before applying Weakness and Resistance). Rainbow Scale Poké-Body can\'t be used if Garchomp has any Special Energy cards attached to it.'
  }];

  public attacks = [{
    name: 'Dragon Fang',
    cost: [C, C, C],
    damage: 70,
    text: ''
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Garchomp';
  public fullName: string = 'Garchomp MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.source.energies.cards.some(card => card.superType === SuperType.ENERGY && card.energyType === EnergyType.SPECIAL)) {
        return state;
      }

      const energyTypes: CardType[] = [];
      effect.source.cards.forEach(card => {
        if (card.superType === SuperType.ENERGY) {
          energyTypes.push((card as EnergyCard).provides[0]);
        }
      });

      if (energyTypes.some(type => opponent.active.getPokemonCard()?.weakness.some(weakness => weakness.type === type))) {
        effect.damage += 40;
      }
    }

    return state;
  }
}
