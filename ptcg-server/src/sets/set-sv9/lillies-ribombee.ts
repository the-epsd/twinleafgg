import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, ConfirmPrompt, GameMessage, Card, ChooseCardsPrompt, PokemonCardList } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { PowerEffect } from '../../game/store/effects/game-effects';

export class LilliesRibombee extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Lillie\'s Cutiefly';
  public cardType: CardType = CardType.PSYCHIC;
  public tags = [CardTag.LILLIES];
  public hp: number = 70;
  public weakness = [{ type: CardType.METAL }];
  public retreat = [];

  public powers = [{
    name: 'Inviting Wink',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this card from your hand to evolve 1 of your Pokémon, you may look at your opponent’s hand, choose any number of Basic Pokemon you find there, and put them onto their Bench.'
  }];

  public attacks = [
    { name: 'Magical Shot', cost: [CardType.PSYCHIC], damage: 50, text: '' }
  ];

  public set: string = 'SV9';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';

  public name: string = 'Lillie\'s Ribombee';
  public fullName: string = 'Lillie\'s Ribombee SV9';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Inviting Wink
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const slots: PokemonCardList[] = opponent.bench.filter(b => b.cards.length === 0);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          if (opponent.hand.cards.length === 0) {
            return state;
          }
          // Check if bench has open slots
          const openSlots = opponent.bench.filter(b => b.cards.length === 0);

          let cards: Card[] = [];
          store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_HAND,
            opponent.hand,
            { superType: SuperType.POKEMON, stage: Stage.BASIC },
            { min: 0, max: openSlots.length, allowCancel: false }
          ), selected => {
            cards = selected || [];

            // Operation canceled by the user
            if (cards.length === 0) {
              return state;
            }

            cards.forEach((card, index) => {
              opponent.hand.moveCardTo(card, slots[index]);
              slots[index].pokemonPlayedTurn = state.turn;
            });
          });
        }
      });
    }

    return state;
  }

}