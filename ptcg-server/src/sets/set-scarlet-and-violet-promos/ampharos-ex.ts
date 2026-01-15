import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameMessage, State, StoreLike } from '../..';
import { Effect } from '../../game/store/effects/effect';
import { CONFIRMATION_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Ampharosex extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Flaaffy';

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 330;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Electro Ball',
      cost: [CardType.LIGHTNING],
      damage: 60,
      text: ''
    },
    {
      name: 'Thunderstrike Tail',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 140,
      damageCalculation: '+',
      text: 'You may discard 2 Energy from this Pokémon to have this attack do 100 more damage.'
    }
  ];

  public set: string = 'SVP';

  public regulationMark = 'G';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Ampharos ex';

  public fullName: string = 'Ampharos ex SVP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);
          effect.damage += 100;
        }
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }
    return state;
  }

}