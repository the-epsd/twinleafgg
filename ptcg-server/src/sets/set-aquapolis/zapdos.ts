import { ChooseCardsPrompt, EnergyCard, GameError, GameMessage, PowerType, State, StoreLike } from '../../game';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Zapdos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Anti-Lightning',
    powerType: PowerType.POKEBODY,
    text: 'You can\'t attach [L] Energy cards from your hand to Zapdos.'
  }];

  public attacks = [{
    name: 'Plasma',
    cost: [C],
    damage: 10,
    text: 'If there are any [L] Energy cards in your discard pile, flip a coin. If heads, attach 1 of them to Zapdos.'
  },
  {
    name: 'Burning Tail',
    cost: [L, L, C, C],
    damage: 60,
    text: 'Flip a coin. If tails, put 2 damage counters on Zapdos.'
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Zapdos';
  public fullName: string = 'Zapdos AQ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttachEnergyEffect && effect.target.cards.includes(this)) {
      if (IS_POKEBODY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      if (effect.energyCard.provides.includes(CardType.LIGHTNING)) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.discard.cards.some(c => c instanceof EnergyCard && c.provides.includes(CardType.LIGHTNING))) {
        COIN_FLIP_PROMPT(store, state, player, result => {
          if (result) {
            store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_ATTACH,
              player.discard,
              { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, provides: [CardType.LIGHTNING] },
              { min: 1, max: 1, allowCancel: false }
            ), cards => {
              cards = cards || [];
              if (cards.length > 0) {
                MOVE_CARDS(store, state, player.discard, player.active, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
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
          player.active.damage += 20; // Apply 2 damage counters
        }
      });
    }

    return state;
  }

}