import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Effect } from '../../game/store/effects/effect';

export class DragoniteFB extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SP];
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: C }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Mach Blow',
      cost: [C, C, C],
      damage: 20,
      text: 'If the Defending Pokémon is a Pokémon SP, this attack\'s base damage is 80 instead of 20.'
    },
    {
      name: 'Giant Tail',
      cost: [C, C, C, C],
      damage: 100,
      text: 'Flip a coin. If tails, this attack does nothing.'
    },
  ];

  public set: string = 'SV';
  public name: string = 'Dragonite FB';
  public fullName: string = 'Dragonite FB SV';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '56';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      if (effect.opponent.active.getPokemonCard()?.tags.includes(CardTag.POKEMON_SP)) {
        effect.damage = 80;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }

}