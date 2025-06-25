import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { StoreLike, State, ChooseCardsPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';

export class Kirlia extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Removal Beam',
    cost: [P],
    damage: 10,
    text: 'Flip a coin. If heads, discard 1 Energy card attached to the Defending Pokémon.'
  },
  {
    name: 'Super Psy',
    cost: [P, C, C],
    damage: 50,
    text: ''
  }];

  public set: string = 'RS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '34';
  public name: string = 'Kirlia';
  public fullName: string = 'Kirlia RS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
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
      });
    }

    return state;
  }
}

