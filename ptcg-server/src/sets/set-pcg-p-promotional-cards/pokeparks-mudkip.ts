import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { Card, ChooseCardsPrompt, EnergyCard, GameMessage } from '../../game';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class PokeParksMudkip extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Mud-Slap',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Flamethrower',
    cost: [W, C, C],
    damage: 30,
    text: 'Flip a coin. If heads, discard an Energy attached to your opponent\'s Active Pokémon.'
  }];

  public set: string = 'PCGP';
  public name: string = 'PokéPark\'s Mudkip';
  public fullName: string = 'PokéPark\'s Mudkip PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, (result: boolean) => {
        if (result) {
          const player = effect.player;
          const opponent = effect.opponent;
          // If defending Pokemon has no energy cards attached, return early
          if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
            return state;
          }

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];
            return store.reduceEffect(state, new DiscardCardsEffect(effect, [card]));
          });
        }
      });
    }

    return state;
  }

}
