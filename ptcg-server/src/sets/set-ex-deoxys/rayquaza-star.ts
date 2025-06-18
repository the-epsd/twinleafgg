import { CardTag, CardType, CoinFlipPrompt, GameMessage, PlayerType, PokemonCard, Stage, State, StoreLike } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_ALL_ENERGY_FROM_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RayquazaStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR];
  public cardType: CardType = C;
  public hp: number = 90;
  public weakness = [{ type: C }];
  public resistance = [{ type: W, value: -30 }, { type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Spiral Rush',
    cost: [R, L],
    damage: 30,
    damageCalculation: 'x',
    text: 'Flip a coin until you get tails. This attack does 30 damage times the number of heads.'
  },
  {
    name: 'Holy Star',
    cost: [R, R, L, L],
    damage: 0,
    text: 'Discard all Energy cards attached to Rayquaza Star. This attack does 100 damage to each of your opponent\'s Pokémon-ex. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DX';
  public setNumber: string = '107';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Rayquaza Star';
  public fullName: string = 'Rayquaza Star DX';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const flipCoin = (heads: number = 0): State => {
        return store.prompt(state, [
          new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
        ], result => {
          if (result === true) {
            return flipCoin(heads + 1);
          }
          effect.damage = 30 * heads;
          return state;
        });
      };
      return flipCoin();
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);

      const opponent = effect.opponent;
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, target) => {
        if (target.tags.includes(CardTag.POKEMON_ex)) {
          const damageEffect = new PutDamageEffect(effect, 100);
          damageEffect.target = cardList;
          store.reduceEffect(state, damageEffect);
        }
      });

    }

    return state;
  }
}