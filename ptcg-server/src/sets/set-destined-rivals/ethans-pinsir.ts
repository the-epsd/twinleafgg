import { GamePhase, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class EthansPinsir extends PokemonCard {
  public regulationMark = 'I';
  public tags = [CardTag.ETHANS];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 120;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Vice Grip',
      cost: [G],
      damage: 20,
      text: ''
    },
    {
      name: 'One-Point Return',
      cost: [C, C, C],
      damage: 70,
      damageCalculation: '+',
      text: 'If any of your Ethan\'s Pokémon were Knocked Out by damage from an attack from your opponent\'s Pokémon during their last turn, this attack does 100 more damage.'
    }
  ];

  public set: string = 'DRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Ethan\'s Pinsir';
  public fullName: string = 'Ethan\'s Pinsir DRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      if (player.marker.hasMarker(MarkerConstants.REVENGE_MARKER)) {
        effect.damage += 100;
      }
    }

    // Special case: Only trigger if knocked out Pokémon is an Ethan's Pokémon
    if (effect instanceof KnockOutEffect && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // activate only if the knocked out thing is an ethan's pokemon
      if (!effect.target.getPokemonCard()?.tags.includes(CardTag.ETHANS)) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);
      if (owner === player) {
        effect.player.marker.addMarkerToState(MarkerConstants.REVENGE_MARKER);
      }

      return state;
    }

    return state;
  }
}