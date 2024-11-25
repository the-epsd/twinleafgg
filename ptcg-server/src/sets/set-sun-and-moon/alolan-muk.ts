import { EnergyCard, Card, ChooseCardsPrompt, CoinFlipPrompt, PlayerType } from '../../game';
import { GameError } from '../../game/game-error';
import { GameMessage } from '../../game/game-message';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType } from '../../game/store/card/pokemon-types';
import { CheckPokemonTypeEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { PokemonCardList } from '../../game/store/state/pokemon-card-list';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class AlolanMuk extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Alolan Grimer';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Power of Alchemy',
    powerType: PowerType.ABILITY,
    text: 'Each Basic Pokémon in play, in each player\'s hand, and in each player\'s discard pile has no Abilities.'
  }];

  public attacks = [{
    name: 'Crunch',
    cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
  }];

  public set: string = 'SUM';

  public name: string = 'Alolan Muk';

  public fullName: string = 'Alolan Muk SUM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '58';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
            return state;
          });
        }
      });
    }

    if (effect instanceof PowerEffect && effect.power.powerType === PowerType.ABILITY) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let isAlolanMukInPlay = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isAlolanMukInPlay = true;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        if (card === this) {
          isAlolanMukInPlay = true;
        }
      });

      if (!isAlolanMukInPlay) {
        return state;
      }

      const cardList = StateUtils.findCardList(state, effect.card);
      if (cardList instanceof PokemonCardList) {
        const checkPokemonType = new CheckPokemonTypeEffect(cardList);
        store.reduceEffect(state, checkPokemonType);
      }

      // We are not blocking the Abilities from Non-Basic Pokemon
      if (effect.card.stage !== Stage.BASIC) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
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
      if (!effect.power.exemptFromAbilityLock) {
        throw new GameError(GameMessage.BLOCKED_BY_ABILITY);
      }

      return state;
    }
    return state;
  }
}
