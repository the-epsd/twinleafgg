import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { Card, ChooseCardsPrompt, GameError, GameMessage, PowerType } from '../../game';
import { ABILITY_USED, ADD_MARKER, BLOCK_IF_HAS_SPECIAL_CONDITION, HAS_MARKER, MOVE_CARDS, REMOVE_MARKER_AT_END_OF_TURN, SHOW_CARDS_TO_PLAYER, SHUFFLE_DECK, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Fearow extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Spearow';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = L;
  public hp: number = 60;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C];

  public powers = [{
    name: 'Delta Sign',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may search your deck for a Pokémon that has Delta on its card, show it to your opponent, and put it into your hand. Shuffle your deck afterward. You can\'t use more than 1 Delta Sign Poké- Power each turn.This power can\'t be used if Fearow is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Pierce',
    cost: [L, C],
    damage: 30,
    text: ''
  }];

  public set: string = 'CG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '18';
  public name: string = 'Fearow';
  public fullName: string = 'Fearow CG';

  public readonly DELTA_SIGN_MARKER = 'DELTA_SIGN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.DELTA_SIGN_MARKER, player)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      BLOCK_IF_HAS_SPECIAL_CONDITION(player, this);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.DELTA_SIGN_MARKER, player, this);
      ABILITY_USED(player, this);

      const blocked: number[] = [];
      player.deck.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && c.tags.includes(CardTag.DELTA_SPECIES)) {
          return;
        } else {
          blocked.push(index);
        }
      });

      let cards: Card[] = [];
      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 1, allowCancel: false, blocked }
      ), selected => {
        cards = selected || [];

        SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        MOVE_CARDS(store, state, player.deck, player.hand, { cards: cards, sourceCard: this, sourceEffect: this.powers[0] });

        SHUFFLE_DECK(store, state, player);
      });
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.DELTA_SIGN_MARKER, this);

    return state;
  }

}