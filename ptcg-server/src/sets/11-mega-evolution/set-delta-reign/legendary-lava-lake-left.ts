import { CardTag, GameError, GameMessage, PowerType, Stage, State, StateUtils, StoreLike } from '../../../game';
import { TrainerType } from '../../../game/store/card/card-types';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { assembleDualStadiumFromHand } from '../../../game/store/dual-stadium-utils';
import { CheckPokemonPowersEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { PowerEffect, TrainerPowerEffect } from '../../../game/store/effects/game-effects';
import { PokemonCardList } from '../../../game/store/state/pokemon-card-list';

export class LegendaryLavaLakeLeft extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public tags = [CardTag.DUAL_STADIUM];
  public regulationMark: string = 'J';
  public set: string = 'M6';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '75';
  public name: string = 'Legendary Lava Lake';
  public fullName: string = 'Legendary Lava Lake (Left) M6';
  public text: string =
    'You can only put this card into play from your hand with the other half of Legendary Lava Lake, and it counts as one Stadium card while in play.\n\n' +
    'Evolution Pokemon in play (both yours and your opponent\'s) have no Abilities.';
  public powers = [{
    name: 'Stadium Assembly',
    text: 'Put this card from your hand into play only with the other half of Legendary Lava Lake.',
    exemptFromAbilityLock: true,
    useFromHand: true,
    powerType: PowerType.TRAINER_ABILITY,
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerPowerEffect && effect.power === this.powers[0]) {
      return assembleDualStadiumFromHand(store, state, effect.player, this);
    }

    if (effect instanceof CheckPokemonPowersEffect && StateUtils.getStadiumCard(state) === this) {
      const targetPokemon = effect.target;
      if (!targetPokemon) {
        return state;
      }

      const targetCardList = StateUtils.findCardList(state, targetPokemon);
      if (!(targetCardList instanceof PokemonCardList)) {
        return state;
      }

      if (targetPokemon.stage !== Stage.BASIC) {
        effect.powers = effect.powers.filter(power => power.powerType !== PowerType.ABILITY);
      }
    }

    if (
      effect instanceof PowerEffect &&
      StateUtils.getStadiumCard(state) === this &&
      !effect.power.exemptFromAbilityLock
    ) {
      if (effect.power.useFromDiscard || effect.power.useFromHand) {
        return state;
      }

      const pokemonCard = effect.card;
      if (pokemonCard.stage !== Stage.BASIC) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
    }

    return state;
  }
}
