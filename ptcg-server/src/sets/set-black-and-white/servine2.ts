import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class Servine2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Snivy';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Wring Out',
      cost: [G, C],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed. Discard an Energy attached to the Defending Pokémon.'
    }
  ];

  public set: string = 'BLW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Servine';
  public fullName: string = 'Servine BLW 4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Flip for Paralysis
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });

      // Discard energy from defender
      const energyCards = opponent.active.cards.filter(c => c.superType === SuperType.ENERGY);
      if (energyCards.length > 0) {
        let cards: Card[] = [];
        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          opponent.active,
          { superType: SuperType.ENERGY },
          { min: 1, max: 1, allowCancel: false }
        ), selected => {
          cards = selected || [];
          if (cards.length > 0) {
            const discardEnergy = new DiscardCardsEffect(effect, cards);
            discardEnergy.target = opponent.active;
            store.reduceEffect(state, discardEnergy);
          }
        });
      }
    }
    return state;
  }
}
