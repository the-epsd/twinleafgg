import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game/store/state-utils';
import { ChooseCardsPrompt, GameError, GameMessage, PowerType } from '../../game';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER_AT_END_OF_TURN, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN, SHUFFLE_DECK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Pidgeot extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Pidgeotto';
  public cardType: CardType = C;
  public hp: number = 100;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [];

  public powers = [{
    name: 'Quick Search',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), you may choose any 1 card from your deck and put it into your hand. Shuffle your deck afterward. You can\'t use more than 1 Quick Search Poké-Power each turn. This power can\'t be used if Pidgeot is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Clutch',
    cost: [C, C],
    damage: 40,
    text: 'The Defending Pokémon can\'t retreat until the end of your opponent\'s next turn.'
  }];

  public set: string = 'RG';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Pidgeot';
  public fullName: string = 'Pidgeot RG';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
  public readonly QUICK_SEARCH_POWER_MARKER = 'QUICK_SEARCH_POWER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (HAS_MARKER(this.QUICK_SEARCH_POWER_MARKER, player)) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.QUICK_SEARCH_POWER_MARKER, player, this);
      ABILITY_USED(player, this);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 1, max: 1, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        SHUFFLE_DECK(store, state, player);
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, opponent.active, this);
    }

    if (effect instanceof RetreatEffect && HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, effect.player.active, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.QUICK_SEARCH_POWER_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    return state;
  }

}