import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StateUtils } from '../../game/store/state-utils';
import { GameMessage } from '../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../game/store/prompts/choose-energy-prompt';
import { Card } from '../../game/store/card/card';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pyroar extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Litleo';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public powers = [{
    name: 'Intimidating Mane',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Basic Pokémon.'
  }];

  public attacks = [{
    name: 'Scorching Fang',
    cost: [R, C, C],
    damage: 60,
    damageCalculation: '+',
    text: 'You may discard a [R] Energy attached to this Pokémon. If you do, this attack does 30 more damage.'
  }];

  public set: string = 'FLF';
  public name: string = 'Pyroar';
  public fullName: string = 'Pyroar FLF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.FIRE],
        { allowCancel: true }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        if (cards.length > 0) {
          effect.damage += 30;
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          return store.reduceEffect(state, discardEnergy);
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      // It's not this pokemon card
      if (pokemonCard !== this) {
        return state;
      }

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK || !effect.source.isStage(Stage.BASIC)) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      effect.preventDefault = true;
    }

    return state;
  }

}
