import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, PokemonCardList, GamePhase, GameLog, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, SIMULATE_COIN_FLIP, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Fezandipiti extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Adrena-Pheromone',
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon has any [D] Energy attached and is damaged by an attack, flip a coin. If heads, prevent that damage.',
  }];

  public attacks = [
    {
      name: 'Energy Feather',
      cost: [CardType.PSYCHIC],
      damage: 30,
      text: 'This attack does 30 damage for each Energy attached to this Pokemon.'
    },
  ];

  public set: string = 'TWM';

  public setNumber = '96';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Fezandipiti';

  public fullName: string = 'Fezandipiti TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Adrena-Pheromone

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      if (pokemonCard !== this || sourceCard === undefined || state.phase !== GamePhase.ATTACK) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const checkEnergy = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkEnergy);
      let hasDarkAttached = false;

      checkEnergy.energyMap.forEach(em => {
        if (em.provides.includes(CardType.ANY)) {
          hasDarkAttached = true;
        }
        if (em.provides.includes(CardType.DARK)) {
          hasDarkAttached = true;
        }
        const energyCard = em.card;
        if (energyCard instanceof EnergyCard && energyCard.provides.includes(CardType.DARK)) {
          hasDarkAttached = true;
        }
        if (energyCard instanceof EnergyCard && energyCard.provides.includes(CardType.ANY)) {
          hasDarkAttached = true;
        }
        if (energyCard instanceof EnergyCard && energyCard.blendedEnergies?.includes(CardType.DARK)) {
          hasDarkAttached = true;
        }
      });

      if (!hasDarkAttached) {
        return state;
      }

      if (hasDarkAttached) {
        try {
          const coinFlip = new CoinFlipEffect(player);
          store.reduceEffect(state, coinFlip);
        } catch {
          return state;
        }

        const coinFlipResult = SIMULATE_COIN_FLIP(store, state, player);

        if (coinFlipResult) {
          effect.damage = 0;
          store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
        }

        return state;
      }
    }

    // Energy Feather
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this) as PokemonCardList;

      const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(player, cardList);
      store.reduceEffect(state, checkProvidedEnergyEffect);

      let energies: number = 0;
      checkProvidedEnergyEffect.energyMap.forEach(energy => { energy.provides.forEach(e => { energies++; }); });
      effect.damage = 30 * energies;
    }
    return state;
  }
}