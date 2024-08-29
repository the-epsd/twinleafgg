import { PokemonCard, Stage, CardType, Resistance, PowerType, StoreLike, State, CoinFlipPrompt, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';

export class Voltorb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 50;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance: Resistance[] = [];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Destiny Burst',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If this Pokémon is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, flip a coin. If heads, put 5 damage counters on the Attacking Pokémon.'
  }];

  public attacks = [{
    name: 'Rollout',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  }];

  public set: string = 'XY';
  public name: string = 'Voltorb';
  public fullName: string = 'Voltorb XY';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          opponent.active.damage += 50;
        }
      });
    }
    return state;
  }
}