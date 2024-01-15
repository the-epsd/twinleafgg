import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { GameMessage } from '../../game/game-message';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PlayerType } from '../../game/store/actions/play-card-action';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Dunsparce extends PokemonCard {
  
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.COLORLESS;
  
  public hp: number = 60;
  
  public weakness = [{ type: CardType.FIGHTING }];
  
  public retreat = [ ];
  
  public attacks = [
    {
      name: 'Gnaw',
      cost: [ CardType.COLORLESS ],
      damage: 10,
      text: ''
    },
    {
      name: 'Dig',
      cost: [ CardType.COLORLESS ],
      damage: 30,
      text: 'Flip a coin. If heads, during your opponent’s next turn, prevent all damage from and effects of attacks done to this Pokémon.'
    }
  ];
  
  public regulationMark = 'E';
  
  public set: string = 'FST';
  
  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '207';
  
  public name: string = 'Dunsparce';
  
  public fullName: string = 'Dunsparce FST';

  public readonly CLEAR_DIG_MARKER = 'CLEAR_DIG_MARKER';

  public readonly DIG_MARKER = 'DIG_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.DIG_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_DIG_MARKER, this);
        }
      });

      return state;
    }

    if (effect instanceof AbstractAttackEffect
      && effect.target.marker.hasMarker(this.DIG_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_DIG_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_DIG_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DIG_MARKER, this);
      });
    }

    return state;
  }

}
