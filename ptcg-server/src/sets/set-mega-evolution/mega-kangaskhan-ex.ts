import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CoinFlipPrompt, GameError, GameMessage, PokemonCard, PowerType } from '../../game';
import { DRAW_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class MegaKangaskhanex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public hp: number = 300;
  public cardType: CardType = C;
  public weakness = [{ type: F }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Run Errand',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may use this Ability. Draw 2 cards. You can\'t use more than 1 Run Errand Ability each turn.'
  }];

  public attacks = [{
    name: 'Rapid-Fire Combo',
    cost: [C, C, C],
    damage: 200,
    damageCalculation: '+',
    text: 'Flip a coin until you get tails. This attack does 50 more damage for each heads.'
  }];

  public set: string = 'MEG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '104';
  public name: string = 'Mega Kangaskhan ex';
  public fullName: string = 'Mega Kangaskhan ex M1S';
  public regulationMark: string = 'I';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.usedRunErrand = false;
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.usedRunErrand === true) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      DRAW_CARDS(player, 2);
      player.usedRunErrand = true;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }
          effect.damage += 50 * heads;
          return state;
        });
      };
      return flipCoin();
    }

    return state;
  }


}