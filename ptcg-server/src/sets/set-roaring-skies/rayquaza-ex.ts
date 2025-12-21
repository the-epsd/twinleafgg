import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import {MOVE_CARDS, WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';

export class RayquazaEx extends PokemonCard {
  public tags = [ CardTag.POKEMON_EX ];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 170;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [ C, C ];

  public attacks = [
    {
      name: 'Intensifying Burn',
      cost: [ C ],
      damage: 10,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is a Pokémon-EX, this attack does 50 more damage.'
    }, {
      name: 'Dragon Pulse',
      cost: [ C, C, C ],
      damage: 100,
      text: 'Discard the top 3 cards of your deck.'
    },
  ];

  public set: string = 'ROS';
  public name: string = 'Rayquaza-EX';
  public fullName: string = 'Rayquaza EX ROS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intensifying Burn
    if (WAS_ATTACK_USED(effect, 0, this)){
      if (effect.opponent.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_EX)){ effect.damage += 50; }
    }

    // Dragon Pulse
    if (WAS_ATTACK_USED(effect, 1, this)){
      MOVE_CARDS(store, state, effect.player.deck, effect.player.discard, { count: 3 });
    }

    return state;
  }

}
