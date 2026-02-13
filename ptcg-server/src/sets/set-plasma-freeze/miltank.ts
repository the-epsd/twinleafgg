import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_ALL_ENERGY_FROM_POKEMON } from '../../game/store/prefabs/prefabs';

export class Miltank extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Max Milk',
      cost: [C, C],
      damage: 0,
      text: 'Heal all damage from 1 of your Pokémon. Then, discard all Energy attached to this Pokémon.'
    },
    {
      name: 'Tackle',
      cost: [C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '93';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Miltank';
  public fullName: string = 'Miltank PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          targets[0].damage = 0;
        }
        DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
      });
    }

    return state;
  }
}
