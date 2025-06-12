import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, StateUtils } from '../../game';
import { ABILITY_USED, ADD_MARKER, HAS_MARKER, REMOVE_MARKER, REMOVE_MARKER_AT_END_OF_TURN, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Aipom extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public evolvesFrom = 'Aipom';
  public cardType: CardType = C;
  public hp: number = 60;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers = [{
    name: 'Scampering Tail',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may put the top card of your opponent\'s deck on the bottom of their deck without looking at it.'
  }];

  public attacks = [{
    name: 'Tail Smack',
    cost: [C, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '169';
  public name: string = 'Aipom';
  public fullName: string = 'Aipom CEC';

  public readonly SCAMPERING_TAIL_MARKER = 'SCAMPERING_TAIL_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    REMOVE_MARKER_AT_END_OF_TURN(effect, this.SCAMPERING_TAIL_MARKER, this);

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.SCAMPERING_TAIL_MARKER, player, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (HAS_MARKER(this.SCAMPERING_TAIL_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (opponent.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      ADD_MARKER(this.SCAMPERING_TAIL_MARKER, player, this);
      ABILITY_USED(player, this);

      // Move the top card of the opponent's deck to the bottom of their deck
      const topCard = opponent.deck.cards.shift();
      if (topCard) {
        opponent.deck.cards.push(topCard);
      }
    }

    return state;
  }
}