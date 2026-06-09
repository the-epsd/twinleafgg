import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { PlayerType, StoreLike, State } from '../../game';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sylveonex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Eevee';
  public hp: number = 270;
  public cardType: CardType = P;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Colorful Harmony',
    cost: [P, C, C],
    damage: 50,
    damageCalculation: 'x',
    text: 'This attack does 50 damage for each type of Basic Energy attached to all of your Pokémon.'
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '71';
  public name: string = 'Sylveon ex';
  public fullName: string = 'Sylveon ex 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-brilliant-stars/alcremie.ts (Rainbow Flavor — unique Basic Energy types in play)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const uniqueTypes = new Set<CardType>();
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, pokemon => {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, pokemon);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        checkProvidedEnergyEffect.energyMap.forEach(em => {
          if (em.card.energyType === EnergyType.BASIC && em.provides.length > 0) {
            if (em.provides.includes(CardType.ANY)) {
              [
                CardType.FIRE,
                CardType.WATER,
                CardType.GRASS,
                CardType.LIGHTNING,
                CardType.PSYCHIC,
                CardType.FIGHTING,
                CardType.DARK,
                CardType.METAL,
                CardType.FAIRY
              ].forEach(type => uniqueTypes.add(type));
            } else {
              em.provides.forEach(type => uniqueTypes.add(type));
            }
          }
        });
      });
      effect.damage = 50 * uniqueTypes.size;
    }
    return state;
  }
}
