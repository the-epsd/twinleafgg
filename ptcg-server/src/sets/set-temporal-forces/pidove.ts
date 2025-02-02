import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { GameError, PowerType } from '../../game';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { PlayerType } from '../../game';
import { Card } from '../../game/store/card/card';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { CheckHpEffect } from '../../game/store/effects/check-effects';

export class Pidove extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 50;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Emergency Evolution',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn, if this Pokémon\'s remaining HP is 30 or less, you may search your deck for an Unfezant or Unfezant ex and put it onto this Pidove to evolve it. Then, shuffle your deck.'
  }];

  public attacks = [{
    name: 'Gust',
    cost: [CardType.COLORLESS],
    damage: 10,
    text: ''
  }];

  public set: string = 'TEF';

  public setNumber = '133';

  public cardImage = 'assets/cardback.png';

  public regulationMark: string = 'H';

  public name: string = 'Pidove';

  public fullName: string = 'Pidove TEF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Emergency Evolution
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
        if (cardList.getPokemonCard() === this) {
          const checkHpEffect = new CheckHpEffect(player, cardList);

          if (checkHpEffect.hp - cardList.damage > 30) {
            throw new GameError(GameMessage.CANNOT_USE_POWER);
          }

          let cards: Card[] = [];
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_EVOLVE,
            player.deck,
            { superType: SuperType.POKEMON, name: 'Unfezant' },
            { min: 0, max: 1, allowCancel: false }
          ), selected => {
            cards = selected || [];
            if (cards) {
              player.deck.moveCardsTo(cards, cardList);
              cardList.clearEffects();
              cardList.pokemonPlayedTurn = state.turn;
            }
          });
        }
      });
    }

    return state;
  }

}
