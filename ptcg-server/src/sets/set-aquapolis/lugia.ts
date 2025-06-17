import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { EnergyCard, StateUtils } from '../../game';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, HAS_MARKER, IS_POKEBODY_BLOCKED, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Lugia extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: P }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Crystal Type',
    powerType: PowerType.POKEBODY,
    text: 'Whenever you attach a [R], [W], or [P] basic Energy card from your hand to Lugia, Lugia\'s type (color) becomes the same as that Energy card type until the end of the turn.'
  }];

  public attacks = [{
    name: 'Psychic',
    cost: [P, R],
    damage: 10,
    damageCalculation: 'x',
    text: 'This attack does 10 damage times the number of Energy cards attached to the Defending Pokémon.'
  },
  {
    name: 'Steam Blast',
    cost: [W, W, R, C],
    damage: 50,
    text: 'Discard an Energy card attached to Lugia.'
  }];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '149';
  public name: string = 'Lugia';
  public fullName: string = 'Lugia AQ';

  public readonly R_CRYSTAL_MARKER = 'R_CRYSTAL_MARKER';
  public readonly W_CRYSTAL_MARKER = 'W_CRYSTAL_MARKER';
  public readonly P_CRYSTAL_MARKER = 'P_CRYSTAL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.R_CRYSTAL_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.W_CRYSTAL_MARKER, this);
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.P_CRYSTAL_MARKER, this);

    if (effect instanceof AttachEnergyEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const energyCard = effect.energyCard;

      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      if (effect.energyCard.energyType === EnergyType.BASIC) {
        if (energyCard.provides.includes(CardType.FIRE)) {
          REMOVE_MARKER(this.W_CRYSTAL_MARKER, player, this);
          REMOVE_MARKER(this.P_CRYSTAL_MARKER, player, this);
          ADD_MARKER(this.R_CRYSTAL_MARKER, player, this);
        } else if (energyCard.provides.includes(CardType.WATER)) {
          REMOVE_MARKER(this.R_CRYSTAL_MARKER, player, this);
          REMOVE_MARKER(this.P_CRYSTAL_MARKER, player, this);
          ADD_MARKER(this.W_CRYSTAL_MARKER, player, this);
        } else if (energyCard.provides.includes(CardType.PSYCHIC)) {
          REMOVE_MARKER(this.R_CRYSTAL_MARKER, player, this);
          REMOVE_MARKER(this.W_CRYSTAL_MARKER, player, this);
          ADD_MARKER(this.P_CRYSTAL_MARKER, player, this);
        }
      }
    }

    if (effect instanceof CheckPokemonTypeEffect && effect.target.getPokemonCard() === this) {
      const player = StateUtils.findOwner(state, effect.target);

      if (HAS_MARKER(this.R_CRYSTAL_MARKER, player, this)) {
        effect.cardTypes = [R];
      } else if (HAS_MARKER(this.W_CRYSTAL_MARKER, player, this)) {
        effect.cardTypes = [W];
      } else if (HAS_MARKER(this.P_CRYSTAL_MARKER, player, this)) {
        effect.cardTypes = [P];
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;
      const oppActive = opponent.active;

      oppActive.cards.forEach(card => {
        if (card instanceof EnergyCard) {
          effect.damage += 10;
        }
      });
      effect.damage -= 10; // Subtract the base damage
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }

}
