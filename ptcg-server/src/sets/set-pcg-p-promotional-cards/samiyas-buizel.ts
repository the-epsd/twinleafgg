import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, EnergyCard, ChooseCardsPrompt, GameMessage, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect, CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

export class SamiyasBuizel extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Aqua Lift',
    powerType: PowerType.POKEBODY,
    text: 'If Samiya\'s Buizel has any Water Energy attached to it, the Retreat Cost for Samiya\'s Buizel is 0.'
  }];

  public attacks = [{
    name: 'Whirlpool',
    cost: [W, C],
    damage: 20,
    text: 'Flip a coin. If heads, discard an Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'PCGP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name: string = 'Samiya\'s Buizel';
  public fullName: string = 'Samiya\'s Buizel PCGP 138';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.cards.includes(this)) {
      const player = effect.player;
      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Check if there is any Water energy attached
      const hasPsychicEnergy = checkProvidedEnergy.energyMap.some(energy =>
        energy.provides.includes(CardType.WATER) || energy.provides.includes(CardType.ANY)
      );

      if (hasPsychicEnergy) {
        effect.cost = [];
      }
    }

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