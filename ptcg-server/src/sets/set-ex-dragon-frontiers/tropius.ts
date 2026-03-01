import { PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerType, StoreLike, State, PlayerType } from '../../game';
import { ABILITY_USED, CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Tropius extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = M;
  public hp: number = 70;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Tropical Heal',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you put Tropius from your hand onto your Bench, you may remove all Special Conditions, Imprison markers, and Shock-wave markers from your Pokémon.'
  }];

  public attacks = [{
    name: 'Grind',
    cost: [M],
    damage: 10,
    damageCalculation: 'x',
    text: 'Does 10 damage times the amount of Energy attached to Tropius.'
  }];

  public set: string = 'DF';
  public name: string = 'Tropius';
  public fullName: string = 'Tropius DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        return state;
      }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          const powerEffect = new PowerEffect(player, this.powers[0], this);
          store.reduceEffect(state, powerEffect);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
            cardList.removeSpecialCondition(SpecialCondition.CONFUSED);
            cardList.removeSpecialCondition(SpecialCondition.ASLEEP);
            cardList.removeSpecialCondition(SpecialCondition.POISONED);
            cardList.removeSpecialCondition(SpecialCondition.BURNED);
            cardList.removeSpecialCondition(SpecialCondition.PARALYZED);
            cardList.marker.removeMarker('IMPRISON_MARKER');
            cardList.marker.removeMarker('SHOCK_WAVE_MARKER');
          });

          ABILITY_USED(player, this);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = player.active;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      effect.damage = 10 * checkProvidedEnergyEffect.energyMap.reduce((left, p) => left + p.provides.length, 0);
    }

    return state;
  }

}
