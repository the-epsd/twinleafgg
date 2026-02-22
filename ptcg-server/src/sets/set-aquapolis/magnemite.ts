import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, CoinFlipPrompt, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckRetreatCostEffect } from '../../game/store/effects/check-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Magnemite extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 50;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Conductive Body',
    powerType: PowerType.POKEBODY,
    text: 'You pay [C] less to retreat Magnemite for each Magnemite on your Bench.'
  }];

  public attacks = [
    {
      name: 'Magnetic Bomb',
      cost: [L, C],
      damage: 20,
      text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage. If tails, Magnemite does 10 damage to itself.',
    }
  ];

  public set: string = 'AQ';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Magnemite';
  public fullName: string = 'Magnemite AQ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof CheckRetreatCostEffect && effect.player.active.getPokemonCard() === this) {
      const player = effect.player;

      let isMagnemiteInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isMagnemiteInPlay = true;
        }
      });

      if (!isMagnemiteInPlay) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      if (IS_POKEBODY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const pokemonCard = player.active.getPokemonCard();

      if (pokemonCard) {
        const magnemiteCount = player.bench.reduce((count, benchCard) => {
          const benchPokemon = benchCard.getPokemonCard();
          return benchPokemon && benchPokemon.name === this.name ? count + 1 : count;
        }, 0);

        for (let i = 0; i < magnemiteCount; i++) {
          const index = effect.cost.indexOf(CardType.COLORLESS);
          if (index !== -1) {
            effect.cost.splice(index, 1);
          } else {
            break;
          }
        }
      }
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 10;
        }

        if (result === false) {
          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          return store.reduceEffect(state, dealDamage);
        }
      });
    }
    return state;
  }
}
