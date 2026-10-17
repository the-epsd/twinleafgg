import { PlayerType, PokemonCard, PowerType, StateUtils } from '../../../game';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { Effect } from '../../../game/store/effects/effect';
import { CAN_APPLY_ABILITY_TO_TARGET } from '../../../game/store/prefabs/effect-of-ability-prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { State } from '../../../game/store/state/state';
import { StoreLike } from '../../../game/store/store-like';

export class Azelf extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Downer Material',
    powerType: PowerType.POKEBODY,
    text: 'If you have Uxie and Mesprit in play, the attack cost of each of your opponent\'s Basic Pokémon\'s attacks is [C] more. You can\'t use more than 1 Downer Material Poké-Body each turn.',
  }];

  public attacks = [{
    name: 'Bind Pulse',
    cost: [P],
    damage: 10,
    text: 'During your opponent\'s next turn, your opponent can\'t attach any Special Energy cards from his or her hand to any of his or her Pokémon.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Azelf';
  public fullName: string = 'Azelf MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Downer Material
    if (effect instanceof CheckAttackCostEffect) {
      const attackingPlayer = effect.player;
      const abilityOwner = StateUtils.getOpponent(state, attackingPlayer);
      const attackingPokemon = attackingPlayer.active.getPokemonCard();
      if (
        !IS_POKEBODY_BLOCKED(store, state, abilityOwner, this) &&
        attackingPokemon?.stage === Stage.BASIC
      ) {

        let isAzelfInPlay = false;
        let isMespritInPlay = false;
        let isUxieInPlay = false;
        abilityOwner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            isAzelfInPlay = true;
          } else if (card.name === 'Uxie') {
            isUxieInPlay = true;
          } else if (card.name === 'Mesprit') {
            isMespritInPlay = true;
          }
        });

        const isTrioInPlay = isMespritInPlay && isUxieInPlay && isAzelfInPlay;
        if (!isTrioInPlay) {
          return state;
        }

        if (!CAN_APPLY_ABILITY_TO_TARGET(
          store,
          state,
          abilityOwner,
          this.powers[0],
          this,
          attackingPlayer.active,
        )) {
          return state;
        }

        const NON_STACK_MARKER = 'DOWNER_MATERIAL_APPLIED';
        if (attackingPlayer.marker.hasMarker(NON_STACK_MARKER, this)) {
          return state;
        }
        attackingPlayer.marker.addMarker(NON_STACK_MARKER, this);

        effect.cost.push(CardType.COLORLESS);
      }
    }

    // Bind Pulse
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { specialEnergy: true });
    }

    return state;
  }
}
