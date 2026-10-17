import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';

export class Nuzleaf extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Seedot';
  public hp: number = 80;
  public cardType: CardType[] = [D];
  public weakness = [{ type: F, value: 20 }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Dirty Trick',
    cost: [D],
    damage: 0,
    text: 'Flip a coin. If heads, discard an Energy card attached to 1 of your opponent\'s Pokémon.'
  },
  {
    name: 'Razor Wind',
    cost: [D, D],
    damage: 40,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'DP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '57';
  public name: string = 'Nuzleaf';
  public fullName: string = 'Nuzleaf DP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dirty Trick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let hasEnergyOnField = false;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.cards.some(c => c instanceof EnergyCard)) {
          hasEnergyOnField = true;
        }
      });
      if (!hasEnergyOnField) {
        return state;
      }
      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON,
            PlayerType.TOP_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (targets && targets.length > 0) {
              const target = targets[0];
              const energyCards = target.cards.filter(c => c instanceof EnergyCard);
              if (energyCards.length > 0) {
                store.prompt(state, new ChooseCardsPrompt(
                  player,
                  GameMessage.CHOOSE_CARD_TO_DISCARD,
                  target,
                  { superType: SuperType.ENERGY },
                  { min: 1, max: 1, allowCancel: false }
                ), selected => {
                  const cards: Card[] = selected || [];
                  if (cards.length > 0) {
                    const discardEnergy = new DiscardCardsEffect(effect, cards);
                    discardEnergy.target = target;
                    store.reduceEffect(state, discardEnergy);
                  }
                });
              }
            }
          });
        }
      });
    }

    // Razor Wind
    if (WAS_ATTACK_USED(effect, 1, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (!result) {
          effect.damage = 0;
        }
      });
    }

    return state;
  }
}
