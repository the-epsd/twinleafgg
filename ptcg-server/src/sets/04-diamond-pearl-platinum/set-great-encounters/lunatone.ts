import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChooseCardsPrompt, ConfirmPrompt, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ABILITY_USED, BLOCK_IF_HAS_SPECIAL_CONDITION, DISCARD_A_STADIUM_CARD_IN_PLAY, DRAW_CARDS, IS_POKEPOWER_BLOCKED, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, USE_ABILITY_ONCE_PER_TURN, WAS_ATTACK_USED, WAS_POWER_USED } from '../../../game/store/prefabs/prefabs';

export class Lunatone extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 60;
  public cardType: CardType[] = [F];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Gravity Change',
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), you may discard a card from your hand. Then, if you have Solrock in play, draw a card. This power can\'t be used if Lunatone is affected by a Special Condition.',
    useWhenInPlay: true
  }];

  public attacks = [{
    name: 'Knock Over',
    cost: [C],
    damage: 20,
    text: 'You may discard any Stadium card in play.'
  }];

  public set: string = 'GE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '76';
  public name: string = 'Lunatone';
  public fullName: string = 'Lunatone GE';

  public readonly ABILITY_USED_MARKER = 'ABILITY_USED_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Gravity Change
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (IS_POKEPOWER_BLOCKED(store, state, player, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);
      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      USE_ABILITY_ONCE_PER_TURN(player, this.ABILITY_USED_MARKER, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this });
        let hasSolrock = false;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_list, card) => {
          if (card.name === 'Solrock') {
            hasSolrock = true;
          }
        });
        if (hasSolrock) {
          DRAW_CARDS(store, state, player, 1);
        }
      });
    }

    // Knock Over
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY
        ), wantToDiscard => {
          if (wantToDiscard) {
            DISCARD_A_STADIUM_CARD_IN_PLAY(state);
          }
        });
      }
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.ABILITY_USED_MARKER, this);
    return state;
  }
}
