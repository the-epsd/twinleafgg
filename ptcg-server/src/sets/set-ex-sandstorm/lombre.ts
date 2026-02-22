import { PokemonCard, Stage, CardType, PowerType, StoreLike, State, CoinFlipPrompt, GameMessage, PlayerType, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealEffect } from '../../game/store/effects/game-effects';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Lombre extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Lotad';
  public cardType: CardType = W;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public retreat = [C];

  public powers = [{
    name: 'Rain Dish',
    powerType: PowerType.POKEBODY,
    text: 'At any time between turns, remove 1 damage counter from Lombre.'
  }];

  public attacks = [{
    name: 'Double Scratch',
    cost: [W, C],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 30 damage times the number of heads.'
  }];

  public set: string = 'SS';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lombre';
  public fullName: string = 'Lombre SS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Handle Rain Dish Poké-Body
    if (effect instanceof BetweenTurnsEffect) {
      const player = effect.player;

      if (!IS_POKEBODY_BLOCKED) {

        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {

            player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
              if (cardList.getPokemonCard() === this) {
                const healEffect = new HealEffect(player, cardList, 10);
                state = store.reduceEffect(state, healEffect);
              }
            });
          }
        });
      }
      return state;
    }


    // Handle Double Scratch attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      let heads = 0;

      // First coin flip
      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.FLIP_COIN
      ), result => {
        if (result) {
          heads++;
        }
      });

      // Second coin flip
      state = store.prompt(state, new CoinFlipPrompt(
        player.id,
        GameMessage.FLIP_COIN
      ), result => {
        if (result) {
          heads++;
        }
        effect.damage = 30 * heads;
        return state;
      });
    }

    return state;
  }
} 