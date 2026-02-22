import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PlayerType, CoinFlipPrompt, GameMessage } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Greninja extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Frogadier';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Aqua Shower',
      cost: [W],
      damage: 20,
      text: 'This attack does 20 damage to each of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
    },
    {
      name: 'Dual Cut',
      cost: [W, C],
      damage: 60,
      text: 'Flip 2 coins. This attack does 60 damage times the number of heads.',
    }
  ];

  public set: string = 'XYP';
  public setNumber: string = '162';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Greninja';
  public fullName: string = 'Greninja XYP';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList === opponent.active) {
          return state;
        }
        const damageEffect = new PutDamageEffect(effect, 20);
        damageEffect.target = cardList;
        state = store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
        return store.prompt(state, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result2 => {
          const headsCount = (result ? 1 : 0) + (result2 ? 1 : 0);
          effect.damage = headsCount * 60;
        });
      });
    }
    return state;
  }
}