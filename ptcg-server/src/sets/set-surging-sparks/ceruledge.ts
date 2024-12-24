import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, EnergyCard } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Ceruledge extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Charcadet';
  public hp: number = 140;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Blaze Curse',
      cost: [C],
      damage: 0,
      text: 'Discard all Special Energy from each of your opponent\'s Pokémon.'
    },
    {
      name: 'Amethyst Rage',
      cost: [R, R, C],
      damage: 160,
      text: 'During your next turn, this Pokémon can\'t attack..'
    }
  ];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public name: string = 'Ceruledge';
  public fullName: string = 'Ceruledge SV8';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let allSpecialEnergy: EnergyCard[] = [];


      // Check active Pokémon
      const activeCheckProvidedEnergy = new CheckProvidedEnergyEffect(opponent);
      state = store.reduceEffect(state, activeCheckProvidedEnergy);
      allSpecialEnergy = allSpecialEnergy.concat(activeCheckProvidedEnergy.energyMap.filter(em => em.card.energyType === EnergyType.SPECIAL).map(em => em.card as EnergyCard));

      // Check bench Pokémon
      opponent.bench.forEach(benchSlot => {
        const benchCheckProvidedEnergy = new CheckProvidedEnergyEffect(opponent, benchSlot);
        state = store.reduceEffect(state, benchCheckProvidedEnergy);
        allSpecialEnergy = allSpecialEnergy.concat(benchCheckProvidedEnergy.energyMap.filter(em => em.card.energyType === EnergyType.SPECIAL).map(em => em.card as EnergyCard));
      });

      // Discard all special energy
      if (allSpecialEnergy.length > 0) {
        allSpecialEnergy.forEach(energy => {
          energy.cards.moveTo(opponent.discard);
        });
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    return state;
  }
}