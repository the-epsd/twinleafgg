import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameError, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Mawile extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'F';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 90;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS ];

  public attacks = 
    [
      {
        name: 'Tempting Trap',
        cost: [ CardType.COLORLESS ],
        damage: 0,
        text: 'During your opponen\'s next turn, the Defending Pokémon can\'t retreat. During your next turn, the Defending Pokémon takes 90 more damage from attacks (after applying Weakness and Resistance).'
      },
      {
        name: 'Bite',
        cost: [ CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS ],
        damage: 90,
        text: ''
      }
    ];

  public set: string = 'EVS';

  public set2: string = 'evolvingskies';

  public setNumber: string = '94';

  public name: string = 'Umbreon V';

  public fullName: string = 'Umbreon V EVS';

  public readonly TEMPTING_TRAP_MARKER = 'TEMPTING_TRAP_MARKER';

  public readonly CLEAR_TEMPTING_TRAP_MARKER = 'CLEAR_TEMPTING_TRAP_MARKER';

  public readonly RETREAT_MARKER = 'RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.TEMPTING_TRAP_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_TEMPTING_TRAP_MARKER, this);
      opponent.active.marker.addMarker(this.RETREAT_MARKER, this);

      if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.RETREAT_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      if (effect instanceof PutDamageEffect
                && effect.target.marker.hasMarker(this.CLEAR_TEMPTING_TRAP_MARKER)) {
        effect.damage += 90;
        return state;
      }
      if (effect instanceof EndTurnEffect
                && effect.player.marker.hasMarker(this.CLEAR_TEMPTING_TRAP_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_TEMPTING_TRAP_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.TEMPTING_TRAP_MARKER, this);
          opponent.active.marker.addMarker(this.RETREAT_MARKER, this);
        });
      }
      return state;
    }
    return state;
  }
}
