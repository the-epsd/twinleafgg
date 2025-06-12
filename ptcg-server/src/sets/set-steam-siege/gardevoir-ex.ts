import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import {DISCARD_X_ENERGY_FROM_THIS_POKEMON} from '../../game/store/prefabs/costs';

export class GardevoirEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX ];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 170;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Link Blast',
      cost: [ Y, C ],
      damage: 30,
      damageCalculation: '+',
      text: 'If this Pokémon and your opponent\'s Active Pokémon have the same amount of Energy attached to them, this attack does 70 more damage.'
    }, {
      name: 'Luminous Blade',
      cost: [ Y, Y, C ],
      damage: 120,
      text: 'Discard an Energy attached to this Pokémon.'
    },
  ];

  public set: string = 'STS';
  public name: string = 'Gardevoir EX';
  public fullName: string = 'Gardevoir EX STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '78';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Link Blast
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;

      const playerActiveEnergy = player.active.cards.filter(card => card instanceof EnergyCard);
      const opponentActiveEnergy = opponent.active.cards.filter(card => card instanceof EnergyCard);

      if (playerActiveEnergy.length === opponentActiveEnergy.length){
        effect.damage += 70;
      }
    }

    // Shining Wind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }

}
