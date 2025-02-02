import { CardType, CoinFlipPrompt, GameMessage, PokemonCard, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';

export class Floragato extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Sprigatito';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [C];

  public attacks = [{
    name: 'Magical Leaf',
    cost: [C, C],
    damage: 30,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 30 more damage, and heal 30 damage from this Pokémon.'
  }];

  public regulationMark: string = 'I';
  public set: string = 'SV9';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Floragato';
  public fullName: string = 'Floragato SV9';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), flipResult => {
        if (flipResult) {
          effect.damage += 30;
          store.reduceEffect(state, new HealEffect(effect.player, effect.source, 30));
        }
      });
    }

    return state;
  }
}