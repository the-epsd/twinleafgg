import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { StateUtils, PlayerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Grotle extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Turtwig';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Cut',
      cost: [ CardType.GRASS ],
      damage: 20,
      text: ''
    },
    {
      name: 'Ramming Shell',
      cost: [ CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 50,
      text: 'During your opponent’s next turn, this Pokémon takes 20 less damage from attacks (after applying Weakness and Resistance).'
    }
  ];

  public set: string = 'SV5';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '4';

  public name: string = 'Grotle';

  public fullName: string = 'Grotle SV5';


  RAMMING_SHELL_MARKER = 'RAMMING_SHELL_MARKER';

  CLEAR_RAMMING_SHELL_MARKER = 'CLEAR_RAMMING_SHELL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.marker.addMarker(this.RAMMING_SHELL_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_RAMMING_SHELL_MARKER, this);

      if (effect instanceof PutDamageEffect
                    && effect.target.marker.hasMarker(this.RAMMING_SHELL_MARKER)) {
        effect.damage -= 20;
        return state;
      }
      if (effect instanceof EndTurnEffect
                    && effect.player.marker.hasMarker(this.CLEAR_RAMMING_SHELL_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_RAMMING_SHELL_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.RAMMING_SHELL_MARKER, this);
        });
      }
      return state;
    }
    return state;
  }
}