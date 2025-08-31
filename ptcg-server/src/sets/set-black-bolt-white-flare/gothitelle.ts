import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, GameMessage, StateUtils, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { ABILITY_USED, DRAW_CARDS, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Gothitelle extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = P;
  public hp: number = 150;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];
  public evolvesFrom = 'Gothorita';

  public powers = [{
    name: 'Distorted Future',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is in the Active Spot, you may have your opponent shuffle their hand into their deck and draw 3 cards.'
  }];

  public attacks = [{
    name: 'Synchro Shot',
    cost: [P, C],
    damage: 90,
    damageCalculation: '+',
    text: 'If you have the same number of cards in your hand as your opponent, this attack does 90 more damage.'
  }];

  public set: string = 'WHT';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '43';
  public name: string = 'Gothitelle';
  public fullName: string = 'Gothitelle WHT';

  public readonly DISTORTED_FUTURE_MARKER = 'DISTORTED_FUTURE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Can't use ability if already used
      if (player.marker.hasMarker(this.DISTORTED_FUTURE_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.DISTORTED_FUTURE_MARKER, this);
      ABILITY_USED(player, this);

      if (player.active.getPokemonCard() !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      MOVE_CARDS(store, state, opponent.hand, opponent.deck, { sourceCard: this });
      DRAW_CARDS(opponent, 3);
    }

    if (effect instanceof EndTurnEffect) {
      const player = (effect as EndTurnEffect).player;
      player.marker.removeMarker(this.DISTORTED_FUTURE_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;

      player.marker.removeMarker(this.DISTORTED_FUTURE_MARKER, this);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      if (player.hand.cards.length === opponent.hand.cards.length) {
        effect.damage += 90;
      }
    }

    return state;
  }
}