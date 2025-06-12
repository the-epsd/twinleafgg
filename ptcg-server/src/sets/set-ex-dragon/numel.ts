import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Numel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 50;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Rollout',
      cost: [C],
      damage: 10,
      text: ''
    },
    {
      name: 'Kindle',
      cost: [R],
      damage: 10,
      text: 'Discard a [R] Energy card attached to Numel and then discard an Energy card attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'DR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Numel';
  public fullName: string = 'Numel DR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 0, max: 1, allowCancel: false }
      ), selected => {
        const card = selected[0];
        if (!card) {
          return;
        }
        opponent.active.moveCardTo(card, opponent.discard);
      });
    }

    return state;
  }
}

