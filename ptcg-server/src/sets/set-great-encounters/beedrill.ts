import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PlayerType, GameMessage, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Beedrill extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Kakuna';
  public cardType: CardType = G;
  public hp: number = 110;
  public weakness = [{ type: R, value: +30 }];
  public retreat = [];

  public attacks = [{
    name: 'Band Attack',
    cost: [G],
    damage: 30,
    damageCalculation: 'x',
    text: 'Does 30 damage times the number of Beedrill you have in play.'
  },
  {
    name: 'Twineedle',
    cost: [C, C, C],
    damage: 50,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 50 damage times the number of heads.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '13';
  public name: string = 'Beedrill';
  public fullName: string = 'Beedrill GE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      let damage = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card.name === 'Beedrill') {
          damage += 30;
        }
      });

      effect.damage = damage;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 50 * heads;
      });
    }

    return state;
  }
}