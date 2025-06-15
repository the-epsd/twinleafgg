import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Moltres extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 80;
  public weakness = [{ type: W }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Fire Immunity',
    powerType: PowerType.POKEBODY,
    text: 'You can\'t attach [R] Energy cards from your hand to Moltres.'
  }];

  public attacks = [{
    name: 'Collect Fire',
    cost: [C],
    damage: 10,
    text: 'If there are any [R] Energy cards in your discard pile, flip a coin. If heads, attach 1 of them to Moltres.'
  },
  {
    name: 'Burning Tail',
    cost: [R, R, C, C],
    damage: 60,
    text: 'Flip a coin. If tails, discard a [R] Energy card attached to Moltres.'
  }];

  public set: string = 'SK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Moltres';
  public fullName: string = 'Moltres SK';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (effect.energyCard.provides.includes(CardType.FIRE)) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.discard.cards.some(c => c instanceof EnergyCard && c.provides.includes(CardType.FIRE))) {
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_ATTACH,
              player.discard,
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, provides: [CardType.FIRE] },
              { min: 1, max: 1, allowCancel: false }
            ), cards => {
              cards = cards || [];
              if (cards.length > 0) {
                MOVE_CARDS(store, state, player.discard, player.active, { cards });
              }
            });
          }
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.FIRE);
        }
      });
    }

    return state;
  }

}