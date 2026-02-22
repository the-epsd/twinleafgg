import { BoardEffect, CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { ChooseCardsPrompt, GameError, GameMessage, PokemonCard, PlayerType, PowerType } from '../../game';
import { DRAW_CARDS_UNTIL_CARDS_IN_HAND, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class HisuianDecidueyeVSTAR extends PokemonCard {
  public stage: Stage = Stage.VSTAR;
  public evolvesFrom = 'Hisuian Decidueye V';
  public tags = [CardTag.POKEMON_VSTAR];
  public regulationMark = 'F';
  public cardType: CardType = F;
  public hp: number = 270;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public powers = [{
    name: 'Star of Fortune',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may draw cards until you have 8 cards in your hand. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [{
    name: 'Somersault Feathers',
    cost: [F, C, C],
    damage: 160,
    damageCalculator: '+',
    text: 'You may discard up to 3 Energy cards from your hand. This attack does 30 more damage for each card you discarded in this way.'
  }];

  public set: string = 'ASR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '84';
  public name: string = 'Hisuian Decidueye VSTAR';
  public fullName: string = 'Hisuian Decidueye VSTAR ASR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Star of Fortune: VSTAR power - draw until you have 8 cards in hand
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      player.usedVSTAR = true;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 8);
    }

    // Somersault Feathers: discard up to 3 energy from hand, +30 damage per card discarded
    // Fix: damage must be modified INSIDE the callback since prompt is async
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const attackEffect = effect;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: true, min: 0, max: 3 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }

        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.attacks[0] });
        attackEffect.damage += cards.length * 30;
      });
    }

    return state;
  }
}
