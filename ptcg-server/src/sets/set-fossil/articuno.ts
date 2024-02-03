import { CoinFlipPrompt, GameMessage, PlayerType, State, StateUtils } from '../../game';
import { StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { SpecialCondition } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Articuno extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 70;

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Freeze Dry',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 30,
      text: 'Flip a coin. If heads, the Defending Pokémon is now Paralyzed.'
    },
    {
      name: 'Blizzard',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.WATER],
      damage: 50,
      text: 'Flip a coin. If heads, this attack does 10 damage to each of your opponent\'s Benched Pokémon. If tails, this attack does 10 damage to each of your own Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'FO';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '2';

  public name: string = 'Articuno';

  public fullName: string = 'Articuno FO';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
          store.reduceEffect(state, specialConditionEffect);
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
    
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
            if (cardList === opponent.active) {
              return;
            }
            const damageEffect = new PutDamageEffect(effect, 10);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
    
          });
        }
        if (result === false) {
    
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
            if (cardList === player.active) {
              return;
            }
            const damageEffect = new PutDamageEffect(effect, 10);
            damageEffect.target = cardList;
            store.reduceEffect(state, damageEffect);
          });
        }
      });
    }
    return state;
  }
}