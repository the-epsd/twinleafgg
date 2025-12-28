import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { AttachEnergyEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Azelf extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 60;
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Downer Material',
    text: 'If you have Uxie and Mesprit in play, the attack cost of each of your opponent\'s Basic Pokémon\'s attacks is [C] more. You can\'t use more than 1 Downer Material Poké-Body each turn.',
    powerType: PowerType.POKEBODY
  }];

  public attacks = [{
    name: 'Bind Pulse',
    cost: [P],
    damage: 10,
    text: 'During your opponent\'s next turn, your opponent can\'t attach any Special Energy cards from his or her hand to any of his or her Pokémon.'
  }];

  public set: string = 'MT';
  public name: string = 'Azelf';
  public fullName: string = 'Azelf MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';

  public readonly BIND_PULSE_MARKER = 'BIND_PULSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Sticky Membrane
    if (effect instanceof CheckAttackCostEffect) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (!IS_POKEBODY_BLOCKED(store, state, opponent, this) && opponent.active.getPokemonCard()?.stage === Stage.BASIC) {

        let isAzelfInPlay = false;
        let isMespritInPlay = false;
        let isUxieInPlay = false;
        opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
          if (card === this) {
            isAzelfInPlay = true;
          } else if (card.name === 'Uxie') {
            isUxieInPlay = true;
          } else if (card.name === 'Mesprit') {
            isMespritInPlay = true;
          }
        });

        let isTrioInPlay = isMespritInPlay && isUxieInPlay && isAzelfInPlay;
        if (!isTrioInPlay) {
          return state;
        }

        // Prevent stacking if multiple copies are in play
        const NON_STACK_MARKER = 'DOWNER_MATERIAL_APPLIED';
        if (effect.player.marker.hasMarker(NON_STACK_MARKER, this)) {
          return state;
        }
        effect.player.marker.addMarker(NON_STACK_MARKER, this);

        effect.cost.push(CardType.COLORLESS);
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.marker.addMarker(this.BIND_PULSE_MARKER, this);
    }

    if (effect instanceof AttachEnergyEffect && effect.energyCard.energyType === EnergyType.SPECIAL) {
      const player = effect.player;
      if (player.marker.hasMarker(this.BIND_PULSE_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {

      if (effect.player.marker.hasMarker(this.BIND_PULSE_MARKER, this)) {
        effect.player.marker.removeMarker(this.BIND_PULSE_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.BIND_PULSE_MARKER, this);
        });
      }
    }

    return state;
  }
}