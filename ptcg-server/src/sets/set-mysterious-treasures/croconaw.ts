import { PokemonCard, Stage, PowerType, CardList, EnergyCard, GameMessage, State, StoreLike, SuperType, ShuffleDeckPrompt, StateUtils, ChooseCardsPrompt, GameLog, ShowCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Croconaw extends PokemonCard {

  public stage = Stage.STAGE_1;
  public evolvesFrom = 'Totodile';
  public cardType = W;
  public hp = 80;
  public weakness = [{ type: L, value: +20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Evolutionary Vitality',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn, when you play Croconaw from your hand to evolve 1 of your Pokémon, you may look at the top 5 cards of your deck. Choose all Energy cards you find there, show them to your opponent, and put them into your hand. Put the other cards back on top of your deck. Shuffle your deck afterward.'
  }];

  public attacks = [{
    name: 'Hover Over',
    cost: [W, C],
    damage: 30,
    text: 'The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '44';
  public name: string = 'Croconaw';
  public fullName: string = 'Croconaw MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      const player = (effect as EvolveEffect).player;
      const opponent = StateUtils.getOpponent(state, player);
      const temp = new CardList();

      player.deck.moveTo(temp, 5);

      // Check if any cards drawn are basic energy
      const energyCardsDrawn = temp.cards.filter(card => {
        return card instanceof EnergyCard;
      });

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        temp,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: energyCardsDrawn.length, max: energyCardsDrawn.length }
      ), chosenCards => {

        if (chosenCards.length == 0) {
          // No Energy chosen, shuffle all back
          temp.cards.forEach(card => {
            temp.moveCardTo(card, player.deck);
          });
        }

        if (chosenCards.length > 0) {
          // Move chosen Energy to hand
          const energyCard = chosenCards[0];
          temp.moveCardTo(energyCard, player.hand);
          player.supporter.moveCardTo(this, player.discard);
          temp.moveTo(player.deck);

          chosenCards.forEach((card, index) => {
            store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: player.name, card: card.name });
          });

          if (chosenCards.length > 0) {
            state = store.prompt(state, new ShowCardsPrompt(
              opponent.id,
              GameMessage.CARDS_SHOWED_BY_THE_OPPONENT,
              chosenCards), () => state);
          }
        }

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }
}
