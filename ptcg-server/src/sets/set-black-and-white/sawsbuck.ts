import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HEAL_X_DAMAGE_FROM_THIS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Sawsbuck extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Deerling';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Nature Power',
      cost: [C],
      damage: 20,
      damageCalculation: '+',
      text: 'Does 10 more damage for each [G] Energy attached to all of your Pokémon.'
    },
    {
      name: 'Horn Leech',
      cost: [G, C, C],
      damage: 60,
      text: 'Heal 20 damage from this Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '14';
  public name: string = 'Sawsbuck';
  public fullName: string = 'Sawsbuck BLW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Count all Grass Energy attached to all of your Pokémon
      let grassEnergyCount = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        cardList.cards.forEach(card => {
          if (card.superType === SuperType.ENERGY && (card as EnergyCard).provides.includes(CardType.GRASS)) {
            // Count each Grass energy provided
            grassEnergyCount += (card as EnergyCard).provides.filter(t => t === CardType.GRASS).length;
          }
        });
      });

      effect.damage = 20 + (10 * grassEnergyCount);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      HEAL_X_DAMAGE_FROM_THIS_POKEMON(20, effect, store, state);
    }

    return state;
  }
}
