import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, CoinFlipPrompt, Card, ChooseCardsPrompt, EnergyCard, PlayerType, StateUtils } from '../../game';

import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class FirefighterPikachu extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.LIGHTNING;

  public hp: number = 60;

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.METAL, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Firefighting',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Discard a [R] Energy from your opponent\'s Active Pokémon.'
    },
    {
      name: 'Quick Attack',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      damageCalculation: '+',
      text: 'Flip a coin. If heads, this attack does 10 more damage.'
    }
  ];

  public set: string = 'SMP';

  public name: string = 'Firefighter Pikachu';

  public fullName: string = 'Firefighter Pikachu SMP';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '209';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let hasPokemonWithEnergy = false;
      const blocked: number[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        if (cardList.cards.some(c => c.superType === SuperType.ENERGY && ((c as EnergyCard).provides.includes(CardType.FIRE) || (c as EnergyCard).provides.includes(CardType.ANY)))) {
          hasPokemonWithEnergy = true;
        } else {
          blocked.push();
        }
      });

      if (!hasPokemonWithEnergy) {
        return state;
      }
      const target = opponent.active;
      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        target,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false, blocked: blocked }
      ), selected => {
        cards = selected || [];
      });

      if (cards.length > 0) {
        // Discard selected special energy card
        target.moveCardsTo(cards, opponent.discard);
        return state;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }

}
