import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType, CardTag } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameError, GameMessage, Card, ChooseCardsPrompt, PokemonCardList } from '../../game';
import { Effect, EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { CheckPokemonPlayedTurnEffect } from '../../game/store/effects/check-effects';

export class DittoPrismStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 40;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS];
  public tags = [CardTag.PRISM_STAR];

  public powers = [{
    name: 'Almighty Evolution',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may put any Stage 1 card from your hand onto this Pokémon to evolve it. You can\'t use this Ability during your first turn or the turn this Pokémon was put into play.'
  }];

  public cardImage: string = 'assets/cardback.png';
  public set: string = 'LOT';
  public name: string = 'Ditto Prism Star';
  public fullName: string = 'Ditto Prism Star LOT';
  public setNumber: string = '154';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (state.turn === 1 || state.turn === 2) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const hasStage1InHand = player.hand.cards.some(c => {
        return c instanceof PokemonCard && c.stage === Stage.STAGE_1;
      });
      if (!hasStage1InHand) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const dittoPrismStar = this as PokemonCard;
      const dittoCardList = new PokemonCardList();
      dittoCardList.cards.push(dittoPrismStar);

      const dittoPlayedTurn = player.active.cards.includes(this)
        ? player.active
        : player.bench.find(b => b.cards.includes(this));

      if (!dittoPlayedTurn) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const playedTurnEffect = new CheckPokemonPlayedTurnEffect(player, dittoPlayedTurn);
      store.reduceEffect(state, playedTurnEffect);
      if (playedTurnEffect.pokemonPlayedTurn === state.turn) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      let cards: Card[] = [];
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_EVOLVE,
        player.hand,
        { superType: SuperType.POKEMON, stage: Stage.STAGE_1 },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        cards = selected || [];

        if (cards.length > 0) {
          const pokemonCard = cards[0] as PokemonCard;
          const dittoCardList = player.active.cards.includes(this)
            ? player.active
            : player.bench.find(b => b.cards.includes(this));

          if (dittoCardList) {
            // Remove the Stage 1 card from the player's hand
            selected[0].cards.moveTo(pokemonCard.cards);

            const evolveEffect = new EvolveEffect(player, dittoCardList, pokemonCard);
            state = store.reduceEffect(state, evolveEffect);
          }
        }
        return state;
      });
    }
    return state;
  }
}