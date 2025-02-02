import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, ChooseCardsPrompt, PokemonCardList, Card,
  StateUtils, GameMessage, PowerType, GameError, ConfirmPrompt
} from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class LugiaVSTAR extends PokemonCard {

  public tags = [CardTag.POKEMON_VSTAR];

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Lugia V';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 280;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Summoning Star',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'During your turn, you may put up to 2 [C] Pokémon that don\'t have a Rule Box from your discard pile onto your Bench. (Pokémon V, Pokémon-GX, etc. have Rule Boxes.) (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public attacks = [
    {
      name: 'Tempest Dive',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 220,
      text: 'You may discard a Stadium in play.'
    }
  ];

  public set: string = 'SIT';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '139';

  public name: string = 'Lugia VSTAR';

  public fullName: string = 'Lugia VSTAR SIT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);
      const max = Math.min(slots.length, 2);

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      const blocked: number[] = [];
      player.discard.cards.forEach((card, index) => {
        if (card instanceof PokemonCard && card.tags.includes(CardTag.RADIANT) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_VMAX) || card.tags.includes(CardTag.POKEMON_ex)) {
          blocked.push(index);
        }
      });

      player.usedVSTAR = true;
      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH,
        player.discard,
        { superType: SuperType.POKEMON, cardType: CardType.COLORLESS },
        { min: 1, max, allowCancel: true, blocked }
      ), selected => {
        cards = selected || [];


        cards.forEach((card, index) => {
          player.discard.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });
        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_DISCARD_STADIUM,
        ), wantToUse => {
          if (wantToUse) {

            // Discard Stadium
            const cardList = StateUtils.findCardList(state, stadiumCard);
            const player = StateUtils.findOwner(state, cardList);
            cardList.moveTo(player.discard);
            return state;
          }
          return state;
        });
      }
      return state;
    }
    return state;
  }
}