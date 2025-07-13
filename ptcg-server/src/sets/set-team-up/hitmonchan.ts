import { ConfirmPrompt, GameMessage, State, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { SWITCH_ACTIVE_WITH_BENCHED, AFTER_ATTACK } from '../../game/store/prefabs/prefabs';

export class Hitmonchan extends PokemonCard {

  public name = 'Hitmonchan';

  public set = 'TEU';

  public fullName = 'Hitmonchan TEU';

  public stage = Stage.BASIC;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public hp = 90;

  public cardType = CardType.FIGHTING;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Hit and Run',
      cost: [CardType.FIGHTING],
      damage: 30,
      text: 'You may switch this Pokémon with 1 of your Benched Pokémon.'
    },
    {
      name: 'Magnum Punch',
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_SWITCH_POKEMON,
      ), wantToUse => {
        if (wantToUse) {
          SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
        }
      });
    }
    return state;
  }
}