import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { CoinFlipPrompt, GameError, GameMessage, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlaySupporterEffect } from '../../game/store/effects/play-card-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';

export class Stoutland extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 140;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];
  public evolvesFrom = 'Herdier';

  public powers = [{
    name: 'Sentinel',
    powerType: PowerType.ABILITY,
    text: ' As long as this Pokémon is your Active Pokémon, your opponent can\'t play any Supporter cards from his or her hand.'
  }];

  public attacks = [{
    name: 'Wild Tackle',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Flip a coin. If tails, this Pokémon does 20 damage to itself.'
  }];

  public set = 'BCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '122';
  public name = 'Stoutland';
  public fullName = 'Stoutland BCR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlaySupporterEffect) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.active.getPokemonCard() !== this && opponent.active.getPokemonCard() !== this) {
        return state;
      }

      // Checking to see if ability is being blocked
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (opponent.active.getPokemonCard() === this) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (!result) {
          const dealDamage = new DealDamageEffect(effect, 10);
          dealDamage.target = player.active;
          return store.reduceEffect(state, dealDamage);
        }
      });
    }

    return state;
  }
}