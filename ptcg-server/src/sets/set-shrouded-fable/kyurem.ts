import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { Card, ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, StateUtils, TrainerCard } from '../../game';
import { CheckAttackCostEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { DAMAGE_OPPONENT_POKEMON, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Kyurem extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = N;
  public hp: number = 130;
  public retreat = [C, C];

  public powers = [{
    name: 'Plasma Bane',
    powerType: PowerType.ABILITY,
    text: 'If your opponent has any card with Colress in its name in their discard pile, this Pokémon\'s Tri Frost attack can be used for 1 Colorless Energy.'
  }];

  public attacks = [{
    name: 'Trifrost',
    cost: [W, W, M, M, C],
    damage: 0,
    text: 'Discard all Energy from this Pokémon. This attack does 110 damage to 3 of your opponent\'s Pokémon.'
  }];

  public regulationMark = 'H';
  public set: string = 'SFA';
  public setNumber: string = '47';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Kyurem';
  public fullName: string = 'Kyurem SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckAttackCostEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      let isColressInOpponentsDiscard = false;
      opponent.discard.cards.filter(card => {
        if (card instanceof TrainerCard
          && card.name.includes('Colress')) {
          isColressInOpponentsDiscard = true;
        }
      });
      if (isColressInOpponentsDiscard) {
        // Remove the Water and Metal energy requirements
        effect.cost = effect.cost.filter(type => type !== CardType.WATER && type !== CardType.METAL);
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      state = store.reduceEffect(state, discardEnergy);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 3, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 110, targets);
      });
    }
    return state;
  }
}

