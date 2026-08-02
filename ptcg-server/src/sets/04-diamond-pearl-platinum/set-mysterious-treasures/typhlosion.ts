import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { EnergyCard, GameError, GameMessage, PowerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON, IS_ABILITY_BLOCKED, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';
import { DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON } from '../../../game/store/prefabs/attack-effects';

export class Typhlosion extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Quilava';
  public hp: number = 110;
  public cardType: CardType = R;
  public weakness = [{ type: W, value: 30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Firestarter',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may attach a Fire Energy card from your discard pile to 1 of your Benched Pokémon. This power can\'t be used if Typhlosion is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Evaporating Heat',
    cost: [R, R, C],
    damage: 60,
    text: 'Discard a Water Energy attached to the Defending Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '16';
  public name: string = 'Typhlosion';
  public fullName: string = 'Typhlosion MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(slot => slot.cards.length > 0);
      const hasEnergy = player.discard.cards.some(card =>
        card.superType === SuperType.ENERGY
        && (card as EnergyCard).energyType === EnergyType.BASIC
        && (card as EnergyCard).provides.includes(CardType.FIRE)
      );

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!hasBench || !hasEnergy) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return ATTACH_X_TYPE_ENERGY_FROM_DISCARD_TO_1_OF_YOUR_POKEMON(store, state, player, 1,
        CardType.FIRE,
        {
          destinationSlots: [SlotType.BENCH],
          energyFilter: { energyType: EnergyType.BASIC, name: 'Fire Energy' },
          min: 1,
          allowCancel: false,
        }
      );
    }

    // Evaporating Heat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DISCARD_AN_ENERGY_FROM_OPPONENTS_ACTIVE_POKEMON(store, state, effect, [CardType.WATER, CardType.ANY]);
    }

    return state;
  }
}
