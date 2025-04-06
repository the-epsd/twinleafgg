import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils, ChooseCardsPrompt, GameMessage, ShuffleDeckPrompt } from '../../game';
import { Effect, EffectOfAbilityEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class TestPokemon extends PokemonCard {

  public regulationMark = 'G';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: C }];
  public retreat = [];

  public powers = [
    {
      name: 'Have Your Cake',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Add as many cards as you want from your deck to your hand.'
    },
    {
      name: 'Extremely Cursed Blast',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, both players Active Pokemon are Knocked Out.'
    }
  ];

  public attacks = [
    {
      name: 'A Bit Much',
      cost: [C],
      damage: 500,
      text: ''
    },
  ];

  public set: string = 'TEST';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '1';
  public name: string = 'Test Pokemon';
  public fullName: string = 'Test Pokemon TEST';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 60, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
          if (cardList.getPokemonCard() === this) {
            cardList.addBoardEffect(BoardEffect.ABILITY_USED);
          }
        });

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        return state;
      });
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const opponentActive = opponent.active.getPokemonCard();
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.damage += 999;
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        if (cardList.getPokemonCard() === opponentActive) {
          const damageEffect = new EffectOfAbilityEffect(player, this.powers[0], this, state, [cardList]);
          store.reduceEffect(state, damageEffect);
          if (damageEffect.target) {
            damageEffect.target.damage += 999;
          }
        }
      });
    }
    return state;
  }
}