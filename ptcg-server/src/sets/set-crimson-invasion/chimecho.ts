import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { EvolveEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { GameMessage } from '../../game/game-message';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { GameError, PowerType } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { CheckPokemonPowersEffect } from '../../game/store/effects/check-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chimecho extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 70;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS];

  public attacks = [{
    name: 'Bell of Silence',
    cost: [CardType.PSYCHIC],
    damage: 10,
    text: 'Your opponent can\'t play any Pokémon that has an Ability from their hand during their next turn.'
  }];

  public set: string = 'CIN';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '43';

  public name: string = 'Chimecho';

  public fullName: string = 'Chimecho CIN';

  public readonly OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.marker.addMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;
      const powersEffect = new CheckPokemonPowersEffect(player, effect.pokemonCard);
      state = store.reduceEffect(state, powersEffect);
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this) && powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EvolveEffect) {
      const player = effect.player;
      const powersEffect = new CheckPokemonPowersEffect(player, effect.pokemonCard);
      state = store.reduceEffect(state, powersEffect);
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this) && powersEffect.powers.some(power => power.powerType === PowerType.ABILITY)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_ITEM_CARDS_MARKER, this);
    }
    return state;
  }
}

