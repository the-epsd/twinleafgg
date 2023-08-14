import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt, GameError, GameMessage, PlayerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Bibarel extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  //public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Bidoof';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 120;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [{
    name: 'Industrious Incisors',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokemon is on your Bench, prevent all ' +
      'damage done to this Pokemon by attacks (both yours and ' +
      'your opponent\'s).'
  }];

  public attacks = [{
    name: 'Hyper Fang',
    cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
    damage: 100,
    text: 'Flip a coin. If tails, this attack does nothing.'
  }];

  public set: string = 'BRS';

  public name: string = 'Bibarel';

  public fullName: string = 'Bibarel BRS';

  public readonly INDUSTRIOUS_INCISORS_MARKER = 'INDUSTRIOUS_INCISORS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
    }
    
    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
    }
    
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.INDUSTRIOUS_INCISORS_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
  
      while (player.hand.cards.length < 5) {
        player.deck.moveTo(player.hand, 1);
      }
      player.marker.addMarker(this.INDUSTRIOUS_INCISORS_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
        if (player instanceof Bibarel) {
          player.marker.removeMarker(this.INDUSTRIOUS_INCISORS_MARKER);
        }
      });
  
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === false) {
          effect.damage = 0;
        }
      });
    }
    return state;
  }
}