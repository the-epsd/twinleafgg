import { CardList, CardType, ChooseCardsPrompt, GameError, GameMessage, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { AttackEffect, PowerEffect } from "../../game/store/effects/game-effects";

export class GalarianMrRime extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom: string = 'Galarian Mr. Mime';

  public cardType: CardType = W;

  public hp: number = 120;

  public weakness = [{ type: M }];

  public retreat: CardType[] = [C, C];

  public powers: Power[] = [{
    name: 'Shuffle Dance',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may switch 1 of your opponent\'s face-down Prize cards ' +
      'with the top card of their deck. (The cards stay face down.)',
  }]

  public attacks = [{
    name: 'Mad Party',
    cost: [W, C, C],
    damage: 20,
    damageMultiplier: 'x',
    text: 'This attack does 20 damage for each Pokémon in your discard pile that has the Mad Party attack.'
  }];

  public regulationMark = 'D';

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public name: string = 'Galarian Mr. Rime';

  public fullName: string = 'Galarian Mr. Rime DAA';

  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const originallyFaceDown = player.prizes.map(p => p.isSecret);

      const validPrizeCards = new CardList();
      validPrizeCards.isPublic = false;
      validPrizeCards.isSecret = true;
      opponent.prizes.forEach(prizeList => {
        if (prizeList.isSecret)
          validPrizeCards.cards.push(...prizeList.cards);
      });

      if (validPrizeCards.cards.length == 0)
        throw new GameError(GameMessage.CANNOT_USE_POWER);

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARDS_TO_PUT_ON_TOP_OF_THE_DECK,
        validPrizeCards,
        {},
        { min: 1, max: 1, isSecret: true, allowCancel: false }
      ), chosenPrize => {
        if (chosenPrize.length == 0)
          return state;
        const prizeCard = chosenPrize[0];
        const deck = opponent.deck;
        const chosenPrizeList = opponent.prizes.find(prizeList => prizeList.cards.includes(prizeCard));

        if (chosenPrizeList) {
          deck.moveTo(chosenPrizeList, 1);
          chosenPrizeList.moveCardTo(prizeCard, deck);
        }

        // At the end, when resetting prize cards:
        opponent.prizes.forEach((p, index) => {
          if (originallyFaceDown[index]) {
            p.isSecret = true;
          }
        });

      })
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let pokemonCount = 0;
      player.discard.cards.forEach(c => {
        if (c instanceof PokemonCard && c.attacks.some(a => a.name === 'Mad Party'))
          pokemonCount += 1;
      });

      effect.damage = pokemonCount * 20;
    }
    return state;
  }
}