import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameMessage, ConfirmPrompt, ChooseCardsPrompt, ShowCardsPrompt, BoardEffect, PlayerType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT, SHUFFLE_DECK } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED } from '../../game/store/prefabs/attack-effects';

export class Roserade2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Roselia';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Le Parfum',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokemon from your hand to evolve 1 of your Pokemon, you may search your deck for any card and put it into your hand. Shuffle your deck afterward.'
  }];

  public attacks = [
    {
      name: 'Squeeze',
      cost: [G, C],
      damage: 30,
      damageCalculation: '+' as '+',
      text: 'Flip a coin. If heads, this attack does 20 more damage and the Defending Pokemon is now Paralyzed.'
    }
  ];

  public set: string = 'DRX';
  public setNumber: string = '15';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Roserade';
  public fullName: string = 'Roserade DRX 15';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ability: Le Parfum - When evolving, search for any card
    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      const player = effect.player;

      if (player.deck.cards.length === 0) {
        return state;
      }

      // Check if ability is blocked
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

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          const opponent = StateUtils.getOpponent(state, player);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });

          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            player.deck,
            {},
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            const cards = selected || [];

            store.prompt(state, [new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              cards
            )], () => {
              player.deck.moveCardsTo(cards, player.hand);
            });

            SHUFFLE_DECK(store, state, player);
          });
        }
      });
    }

    // Attack: Squeeze - Flip coin, if heads +20 and Paralyzed
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          effect.damage += 20;
          YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_PARALYZED(store, state, effect);
        }
      });
    }

    return state;
  }
}
