import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { GamePhase, State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage, PokemonCard, StateUtils } from '../../game';
import { CONFIRMATION_PROMPT, DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class MegaManectricEx extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Electrike';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 330;
  public cardType: CardType = L;
  public weakness = [{ type: F }];
  public retreat = [];

  public attacks = [{
    name: 'Flash Ray',
    cost: [L, L],
    damage: 120,
    text: 'During your opponent\'s next turn, prevent all damage done to this Pokémon by attacks from Basic Pokémon.'
  },
  {
    name: 'Riot Blast',
    cost: [L, L, L],
    damage: 200,
    damageCalculation: '+',
    text: 'You may discard all Energy from this Pokémon and have this attack do 130 more damage.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '50';
  public name: string = 'Mega Manectric ex';
  public fullName: string = 'Mega Manectric ex M1S';
  public regulationMark: string = 'I';

  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
    }

    if (effect instanceof PutDamageEffect && effect.target.marker.hasMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER) && state.phase === GamePhase.ATTACK) {
      const sourceCard = effect.source.getPokemonCard();
      if (sourceCard && sourceCard.stage === Stage.BASIC) {
        effect.preventDefault = true;
        return state;
      }
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage += 130;
          DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
        }
      }, GameMessage.WANT_TO_DISCARD_ENERGY);
    }

    return state;
  }


}