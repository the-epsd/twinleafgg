import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { CoinFlipPrompt } from '../../game/store/prompts/coin-flip-prompt';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { Card, GameMessage } from '../../game';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';

export class Zapdos extends PokemonCard {

  public set = 'BS';
  
  public name = 'Zapdos';
  
  public fullName = 'Zapdos BS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';
  
  public stage: Stage = Stage.BASIC;
  
  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 90;

  public resistance = [{
    type: CardType.FIGHTING,
    value: -30
  }];

  public retreat: CardType[] = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks: Attack[] = [
    {
      name: 'Thunder',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.COLORLESS],
      damage: 60,
      text: 'Flip a coin. If tails, Zapdos does 30 damage to itself.'
    },
    {
      name: 'Thunderbolt',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 100,
      text: 'Discard all Energy cards attached to Zapdos in order to use this attack.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      return store.prompt(state, new CoinFlipPrompt(
        effect.player.id, GameMessage.COIN_FLIP
      ), (tails) => {
        if (tails) {
          const damageEffect = new DealDamageEffect(effect, 30);
          damageEffect.target = effect.player.active;
          store.reduceEffect(state, damageEffect);
        }
      });

    }
    
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
  
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      const cards: Card[] = checkProvidedEnergy.energyMap.map(e => e.card);
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);
    }

    return state;

  }

}