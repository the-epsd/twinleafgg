import { CardTag, CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { EnergyCard } from '../../game/store/card/energy-card';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class SuperBoostEnergy extends EnergyCard {

  public tags = [CardTag.PRISM_STAR];

  public provides: CardType[] = [CardType.COLORLESS];

  public energyType = EnergyType.SPECIAL;

  public set: string = 'UPR';

  public setNumber: string = '136';

  public cardImage = 'assets/cardback.png';

  public name = 'Super Boost Energy';

  public fullName = 'Super Boost Energy UPR';

  public text =
    'This card provides [C] Energy.\nWhile this card is attached to a Stage 2 Pokémon, it provides every type of Energy but provides only 1 Energy at a time. If you have 3 or more Stage 2 Pokémon in play, it provides every type of Energy but provides 4 Energy at a time.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckProvidedEnergyEffect && effect.source.cards.includes(this)) {
      // Check for Stage 2
      if (effect.source.getPokemonCard()?.stage === Stage.STAGE_2) {
        // Check for 3 or more Stage 2s
        const player = effect.player;
        let numStage2s = 0;

        if (player.active.getPokemonCard()?.stage === Stage.STAGE_2) {
          numStage2s++;
        }
        player.bench.forEach((benchSpot) => {
          if (benchSpot.getPokemonCard()?.stage === Stage.STAGE_2) {
            numStage2s++;
          }
        });

        // If 3 or more Stage 2s, provide 4 Rainbow; otherwise provide 1 Rainbow
        if (numStage2s >= 3) {
          effect.energyMap.push({ card: this, provides: [CardType.ANY, CardType.ANY, CardType.ANY, CardType.ANY] });
          return state;
        }
        effect.energyMap.push({ card: this, provides: [CardType.ANY] });
        return state;
      }
      effect.energyMap.push({ card: this, provides: [CardType.COLORLESS] });
      return state;
    }
    return state;
  }
}