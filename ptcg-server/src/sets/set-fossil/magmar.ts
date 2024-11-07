import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, GameMessage, StateUtils, GameLog, Player } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { CoinFlipEffect } from '../../game/store/effects/play-card-effects';

export class Magmar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = R;
  public hp: number = 70;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C];

  public attacks = [{
    name: 'Smokescreen',
    cost: [R],
    damage: 10,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  },
  {
    name: 'Smog',
    cost: [R, R],
    damage: 20,
    text: 'Flip a coin. If heads, the Defending Pokémon is now Poisoned.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Magmar';
  public fullName: string = 'Magmar FO';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    function simulateCoinFlip(store: StoreLike, state: State, player: Player): boolean {
      const result = Math.random() < 0.5;
      const gameMessage = result ? GameLog.LOG_PLAYER_FLIPS_HEADS : GameLog.LOG_PLAYER_FLIPS_TAILS;
      store.log(state, gameMessage, { name: player.name });
      return result;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = simulateCoinFlip(store, state, player);

      if (!coinFlipResult) {
        effect.damage = 0;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMGE, { name: opponent.name, pokemon: this.name });
      }
    }


    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        if (results) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.POISONED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
      return state;
    }

    return state;
  }
}