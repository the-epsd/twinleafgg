import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Florges extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public cardType: CardType = Y;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }]
  public retreat = [C, C];
  public evolvesFrom = 'Floette';

  public powers = [{
    name: "Wondrous Gift",
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may flip a coin. If heads, put an Item card from your discard pile on top of your deck.'
  }];

  public attacks = [{
    name: 'Mist Guard',
    cost: [Y, Y, C],
    damage: 70,
    text: 'Prevent all damage done to this Pokémon by attacks from [N] Pokémon during your opponent\'s next turn.'
  }];

  public set: string = 'FLI';
  public name: string = 'Florges';
  public fullName: string = 'Florges FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '86';

  public readonly MIST_GUARD_MARKER = 'MIST_GUARD_MARKER';
  public readonly CLEAR_MIST_GUARD_MARKER = 'CLEAR_MIST_GUARD_MARKER';


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.MIST_GUARD_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_MIST_GUARD_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.MIST_GUARD_MARKER)) {
      const card = effect.source.getPokemonCard();
      const dragonPokemon = card && card.cardType == N;

      if (dragonPokemon) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.CLEAR_MIST_GUARD_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_MIST_GUARD_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.MIST_GUARD_MARKER, this);
        });
      }
    }

    return state;
  }
}