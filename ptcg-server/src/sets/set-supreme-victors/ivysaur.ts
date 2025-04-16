import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_SLEEP_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED } from '../../game/store/prefabs/prefabs';

export class Ivysaur extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Bulbasaur';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R, value: +20 }];
  public retreat = [C, C];

  public powers: Power[] = [
    {
      name: 'Evolutionary Pollen',
      powerType: PowerType.POKEPOWER,
      text: 'Once during your turn, when you play Ivysaur from your hand to evolve 1 of your Pokémon, you may use this power. Your opponent\'s Active Pokémon is now Asleep.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Cut',
      cost: [G, C, C],
      damage: 50,
      text: ''
    },
  ];

  public set: string = 'SV';
  public setNumber: string = '62';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ivysaur';
  public fullName: string = 'Ivysaur SV';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      if (CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          ADD_SLEEP_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
        }
      })) {
        return state;
      }
    }
    return state;
  }
}