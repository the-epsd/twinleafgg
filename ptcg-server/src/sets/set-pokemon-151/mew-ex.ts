import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { PowerType } from '../../game/store/card/pokemon-types';
import { GameError, GameMessage, PlayerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { COPY_OPPONENT_ACTIVE_ATTACK, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Mewex extends PokemonCard {

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public tags = [CardTag.POKEMON_ex];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 180;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [];

  public powers = [{
    name: 'Restart',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw cards until you ' +
      'have 3 cards in your hand.'
  }];

  public attacks = [{
    name: 'Genome Hacking',
    cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 0,
    copycatAttack: true,
    text: 'Choose 1 of the Defending Pokemon\'s attacks and use it ' +
      'as this attack.'
  }];

  public set: string = 'MEW';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public name: string = 'Mew ex';

  public fullName: string = 'Mew ex MEW';

  public readonly RESTART_MARKER = 'RESTART_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.RESTART_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.RESTART_MARKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.RESTART_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.hand.cards.length >= 3) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      while (player.hand.cards.length < 3) {
        if (player.deck.cards.length === 0) {
          break;
        }
        player.deck.moveTo(player.hand, 1);
      }
      player.marker.addMarker(this.RESTART_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

    }

    if (effect instanceof EndTurnEffect) {

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, player => {
        if (player instanceof Mewex) {
          player.marker.removeMarker(this.RESTART_MARKER);
        }
      });

    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return COPY_OPPONENT_ACTIVE_ATTACK(store, state, effect as AttackEffect);
    }

    return state;
  }

}
