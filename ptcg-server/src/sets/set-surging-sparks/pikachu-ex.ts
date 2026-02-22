import { PokemonCard, CardTag, Stage, CardType, StoreLike, State, StateUtils, PowerType, Card, ChooseEnergyPrompt, GameMessage } from '../../game';
import { DiscardCardsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { DAMAGED_FROM_FULL_HP, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Pikachuex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 200;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Tenacious Heart',
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon has full HP and would be Knocked Out by an attack, it isn\'t Knocked Out and its remaining HP becomes 10 instead.'
  }];

  public attacks = [
    {
      name: 'Topaz Bolt',
      cost: [CardType.GRASS, CardType.LIGHTNING, CardType.METAL],
      damage: 300,
      text: 'Discard 3 Energy from this Pokémon.'
    },];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '57';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Pikachu ex';
  public fullName: string = 'Pikachu ex SSP';

  public damageDealt = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = StateUtils.findOwner(state, effect.target);
      if (!IS_ABILITY_BLOCKED(store, state, player, this) && DAMAGED_FROM_FULL_HP(store, state, effect, player, effect.target)) {
        effect.surviveOnTenHPReason = this.powers[0].name;
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}