import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { GameError, GameMessage, PlayerType, StateUtils } from '../../game';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';

export class Eiscueex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public cardType: CardType = R;
  public hp: number = 210;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Scalding Block',
      cost: [W, W, W],
      damage: 160,
      text: 'Discard an Energy from this Pokémon. During your opponent\'s next turn, the Defending Pokémon can\'t attack.'
    }
  ];

  public regulationMark = 'G';
  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '42';
  public name: string = 'Eiscue ex';
  public fullName: string = 'Eiscue ex OBF';

  public readonly SCALDING_BLOCK_MARKER = 'SCALDING_BLOCK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
      opponent.marker.addMarker(this.SCALDING_BLOCK_MARKER, this);
      opponent.active.marker.addMarker(this.SCALDING_BLOCK_MARKER, this);
    }

    if (effect instanceof AttackEffect
      && effect.player.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)
      && effect.source.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)) {
      effect.player.marker.removeMarker(this.SCALDING_BLOCK_MARKER, this);

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (cardList.marker.hasMarker(this.SCALDING_BLOCK_MARKER, this)) {
          cardList.marker.removeMarker(this.SCALDING_BLOCK_MARKER, this);
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}
