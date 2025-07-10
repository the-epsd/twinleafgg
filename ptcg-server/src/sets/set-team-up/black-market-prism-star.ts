import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType, CardType, CardTag } from '../../game/store/card/card-types';
import { StateUtils } from '../../game/store/state-utils';
import { KnockOutEffect, MoveCardsEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonTypeEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class BlackMarketPrismStar extends TrainerCard {
  public trainerType: TrainerType = TrainerType.STADIUM;
  public tags = [CardTag.PRISM_STAR];
  public set: string = 'TEU';
  public setNumber: string = '134';
  public name: string = 'Black Market Prism Star';
  public fullName: string = 'Black Market Prism Star TEU';
  public cardImage: string = 'assets/cardback.png';

  public text: string =
    'When a [D] Pokémon (yours or your opponent\'s) that has any [D] Energy attached to it is Knocked Out by damage from an opponent\'s attack, that player takes 1 fewer Prize card.\n\nWhenever any player plays an Item or Supporter card from their hand, prevent all effects of that card done to this Stadium card.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && StateUtils.getStadiumCard(state) === this) {
      const player = effect.player;

      // Check if the Pokémon is Dark
      const checkPokemonTypeEffect = new CheckPokemonTypeEffect(effect.target);
      store.reduceEffect(state, checkPokemonTypeEffect);
      const isDarkPokemon = checkPokemonTypeEffect.cardTypes.includes(CardType.DARK);

      // Check if the Pokémon has any [D] Energy attached to it
      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, effect.target);
      store.reduceEffect(state, checkProvidedEnergyEffect);
      const energyMap = checkProvidedEnergyEffect.energyMap;
      const hasDarknessEnergy = StateUtils.checkEnoughEnergy(energyMap, [CardType.DARK]);

      if (isDarkPokemon && hasDarknessEnergy) {
        effect.prizeCount -= 1;
      }
    }

    // Prevent effects of Item and Supporter cards on this Stadium
    if (effect instanceof MoveCardsEffect
      && StateUtils.getStadiumCard(state) === this) {

      if (effect.sourceCard instanceof TrainerCard &&
        (effect.sourceCard.trainerType === TrainerType.SUPPORTER || effect.sourceCard.trainerType === TrainerType.ITEM)) {

        const stadiumCard = StateUtils.getStadiumCard(state);
        if (stadiumCard !== undefined) {
          const cardList = StateUtils.findCardList(state, stadiumCard);
          if (effect.source === cardList) {
            effect.preventDefault = true;
          }
        }

      }
    }

    return state;
  }

}
