import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, EnergyCard, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DealDamageEffect, DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Charizard extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Charmeleon';
  public hp: number = 130;
  public cardType: CardType[] = [R];
  public weakness = [{ type: W, value: +40 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Fury Blaze',
    powerType: PowerType.POKEBODY,
    text: 'If your opponent has 3 or less Prize cards left, each of Charizard\'s attacks does 50 more damage to the Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Blast Burn',
    cost: [R, R, R, C],
    damage: 120,
    text: 'Flip a coin. If heads, discard 2 Energy cards attached to Charizard. If tails, discard 4 Energy cards attached to Charizard. (If you can\'t, this attack does nothing.)'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '3';
  public name: string = 'Charizard';
  public fullName: string = 'Charizard SW';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fury Blaze
    if (effect instanceof DealDamageEffect && effect.source.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (opponent.getPrizeLeft() <= 3 && effect.target === opponent.active) {
        effect.damage += 50;
      }
    }

    // Blast Burn
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const energyCards = player.active.cards.filter(c => c instanceof EnergyCard);

      COIN_FLIP_PROMPT(store, state, player, heads => {
        const amount = heads ? 2 : 4;
        if (energyCards.length < amount) {
          effect.damage = 0;
          return;
        }

        store.prompt(state, new ChooseCardsPrompt(
          player,
          GameMessage.CHOOSE_CARD_TO_DISCARD,
          player.active,
          { superType: SuperType.ENERGY },
          { min: amount, max: amount, allowCancel: false }
        ), selected => {
          const cards = selected || [];
          if (cards.length < amount) {
            effect.damage = 0;
            return;
          }
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        });
      });
    }

    return state;
  }
}
