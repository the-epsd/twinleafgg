import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CoinFlipPrompt, GameMessage, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PutDamageEffect, AbstractAttackEffect } from '../../game/store/effects/attack-effects';

export class Phanpy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = F;
  public hp: number = 70;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [{
    name: 'Tackle',
    cost: [C],
    damage: 10,
    text: ''
  },
  {
    name: 'Endure',
    cost: [F],
    damage: 0,
    text: 'Flip a coin. If heads, if this Pokémon would be Knocked Out by damage from an attack during your opponent\'s next turn, it is not Knocked Out, and its remaining HP becomes 10.'
  }];

  public set = 'CES';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name = 'Phanpy';
  public fullName = 'Phanpy CES';

  public readonly PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER = 'CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      state = store.prompt(state, new CoinFlipPrompt(
        player.id, GameMessage.COIN_FLIP
      ), flipResult => {
        if (flipResult) {
          player.active.marker.addMarker(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
          opponent.marker.addMarker(this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
        }
      });

      return state;
    }
    //Endure UP

    if (effect instanceof AbstractAttackEffect && effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER)) {
      const player = StateUtils.findOwner(state, effect.target);
      const checkHpEffect = new CheckHpEffect(player, effect.target);
      const selectedTarget = player.active;
      const targetDamage = selectedTarget.damage;
      const totalHp = checkHpEffect.hp;

      if (effect.damage >= (totalHp - targetDamage))//I couldn't find a way to check the current HP of your active Pokémon
      {
        effect.preventDefault = true;
        effect.target.damage = 60;
      }
      return state;
    }

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.marker.removeMarker(this.PREVENT_KNOCKED_OUT_DURING_OPPONENTS_NEXT_TURN_MARKER, this);
      });
    }

    return state;
  }
}