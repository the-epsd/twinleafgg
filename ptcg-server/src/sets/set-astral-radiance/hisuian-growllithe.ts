import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CoinFlipPrompt, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class HisuianGrowlithe extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 80;
  public weakness = [{ type: CardType.GRASS }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Defensive Posture',
    cost: [],
    damage: 0,
    text: 'Flip a coin. If heads, during your opponent\'s next turn, prevent all damage done to this Pokémon by attacks. '
  },
  {
    name: 'Bite',
    cost: [CardType.FIGHTING, CardType.COLORLESS],
    damage: 30,
    text: ''
  }];

  public set: string = 'ASR';
  public regulationMark: string = 'F';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '70';
  public name: string = 'Hisuian Growlithe';
  public fullName: string = 'Hisuian Growlithe ASR';

  public readonly CLEAR_DEFENSIVE_POSTURE_MARKER = 'CLEAR_WITHDRAW_MARKER';

  public readonly DEFENSIVE_POSTURE_MARKER = 'WITHDRAW_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      return store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.DEFENSIVE_POSTURE_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_DEFENSIVE_POSTURE_MARKER, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.DEFENSIVE_POSTURE_MARKER)) {
      effect.preventDefault = true;
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_DEFENSIVE_POSTURE_MARKER, this)) {

      effect.player.marker.removeMarker(this.CLEAR_DEFENSIVE_POSTURE_MARKER, this);

      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.DEFENSIVE_POSTURE_MARKER, this);
      });
    }

    return state;
  }
}