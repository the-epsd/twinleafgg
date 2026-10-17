import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage } from '../../../game/store/card/card-types';
import { EnergyCard, GameError, GameMessage, PowerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { ABILITY_USED, ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, IS_POKEPOWER_BLOCKED, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class BurmySandyCloak extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 40;
  public cardType: CardType[] = [G];
  public weakness = [{ type: R, value: +10 }];
  public retreat = [C];

  public powers = [{
    name: 'Wear Cloak',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Burmy Sandy Cloak is your Active Pokémon, you may search your discard for a basic Fighting Energy card and attach it to Burmy Sandy Cloak.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Sandy Cloak Tackle',
    cost: [C],
    damage: 10,
    damageCalculation: '+',
    text: 'If Burmy Sandy Cloak has any Fighting Energy attached to it, this attack does 10 damage plus 10 more damage.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Burmy Sandy Cloak';
  public fullName: string = 'Burmy Sandy Cloak SW';
  // Mothim evolvesFrom is 'Burmy'; allow evolution from any cloak form
  public evolvesFromBase: string[] = ['Burmy'];

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Wear Cloak
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      const hasEnergy = player.discard.cards.some(c =>
        c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.provides.includes(CardType.FIGHTING)
      );
      if (!hasEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);
      return ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store, state, player, 1, CardType.FIGHTING, {
        destinationSlots: [SlotType.ACTIVE],
        targetFilter: (_list, card) => card === this,
        energyFilter: { energyType: EnergyType.BASIC },
        min: 1,
        allowCancel: false,
      });
    }

    // Sandy Cloak Tackle
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, player.active);
      store.reduceEffect(state, checkEnergy);
      const hasFighting = checkEnergy.energyMap.some(em =>
        em.provides.includes(CardType.FIGHTING) || em.provides.includes(CardType.ANY)
      );
      if (hasFighting) {
        effect.damage += 10;
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
