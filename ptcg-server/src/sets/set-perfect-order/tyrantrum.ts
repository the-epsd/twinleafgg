import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, CoinFlipPrompt, GameMessage, CardList, GameLog, PowerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckHpEffect, CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EnergyCard } from '../../game/store/card/energy-card';

export class Tyrantrum extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Tyrunt';
  public cardType: CardType = F;
  public hp: number = 180;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Tyrannoguts',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'If this Pokemon has any Special Energy attached, it gets +150 HP.'
  }];

  public attacks = [{
    name: 'Wreak Havoc',
    cost: [F, C],
    damage: 160,
    text: 'Flip a coin until you get tails. For each heads, discard the top card of your opponent\'s deck.'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Tyrantrum';
  public fullName: string = 'Tyrantrum M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: +150 HP if has Special Energy
    if (effect instanceof CheckHpEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const checkEnergy = new CheckProvidedEnergyEffect(player, effect.target);
      store.reduceEffect(state, checkEnergy);

      if (IS_ABILITY_BLOCKED(store, state, effect.player, this)) {
        return state;
      }

      const hasSpecialEnergy = checkEnergy.energyMap.some(em => {
        const card = em.card;
        return card instanceof EnergyCard && card.energyType === EnergyType.SPECIAL;
      });

      if (hasSpecialEnergy) {
        effect.hp += 150;
      }
    }

    // Attack: Flip coins until tails, discard top card for each heads
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const flipCoins = (s: State): State => {
        if (opponent.deck.cards.length === 0) {
          return s;
        }

        return store.prompt(s, new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP), result => {
          if (result === true) {
            // Heads - discard top card
            const deckTop = new CardList();
            opponent.deck.moveTo(deckTop, 1);
            if (deckTop.cards.length > 0) {
              store.log(s, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: opponent.name, card: deckTop.cards[0].name, effect: 'Wreak Havoc' });
              deckTop.moveTo(opponent.discard);
            }
            // Continue flipping
            return flipCoins(s);
          }
          // Tails - stop flipping
          return s;
        });
      };

      return flipCoins(state);
    }

    return state;
  }
}
