import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Klinklang extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Klang';
  public cardType: CardType = M;
  public hp: number = 150;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C, C];

  public attacks = [
    {
      name: 'Charge Beam',
      cost: [M],
      damage: 30,
      text: 'Attach an Energy card from your discard pile to this Pokémon.'
    },
    {
      name: 'Zap Cannon',
      cost: [M, C, C],
      damage: 80,
      text: 'Flip a coin. If tails, this Pokémon can\'t use Zap Cannon during your next turn.'
    }
  ];

  public set: string = 'EPO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Klinklang';
  public fullName: string = 'Klinklang EPO';

  public readonly ZAP_CANNON_MARKER = 'ZAP_CANNON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasEnergy = player.discard.cards.some(c => c.superType === SuperType.ENERGY);

      if (hasEnergy) {
        return store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_ATTACH,
          player.discard,
          { superType: SuperType.ENERGY },
          { min: 0, max: 1, allowCancel: false }
        ), cards => {
          cards = cards || [];
          if (cards.length > 0) {
            player.discard.moveCardsTo(cards, player.active);
          }
        });
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.active.marker.hasMarker(this.ZAP_CANNON_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          player.active.marker.addMarker(this.ZAP_CANNON_MARKER, this);
        }
      });
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.removeMarker(this.ZAP_CANNON_MARKER, this);
    }

    return state;
  }
}
