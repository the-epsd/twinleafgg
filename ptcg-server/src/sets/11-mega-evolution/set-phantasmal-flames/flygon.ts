import { ConfirmPrompt, GameMessage, Player, PokemonCard, PowerType, Stage, State, StateUtils, StoreLike } from '../../../game';
import { CardType } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../../game/store/effects/play-card-effects';
import { KnockOutEffect } from '../../../game/store/effects/game-effects';
import { GamePhase } from '../../../game/store/state/state';
import { DISCARD_TOP_X_OF_OPPONENTS_DECK, IS_ABILITY_BLOCKED } from '../../../game/store/prefabs/prefabs';

export class Flygon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Vibrava';
  public hp: number = 150;
  public cardType: CardType = F;
  public weakness = [{ type: G }];
  public resistance = [];
  public retreat = [C];

  public powers = [{
    name: 'Sandy Flapping',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this Pokémon from your hand to evolve 1 of your Pokémon, you may use this Ability. You may also use this Ability if this Pokémon is in the Active Spot and is Knocked Out by damage from an attack from your opponent\'s Pokémon. Discard the top 2 cards of your opponent\'s deck.',
  }];

  public attacks = [{
    name: 'Cutting Wind',
    cost: [F, F],
    damage: 130,
    text: '',
  }];
  
  public regulationMark: string = 'I';
  public set: string = 'PFL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Flygon';
  public fullName: string = 'Flygon PFL';

  public readonly SANDY_FLAPPING_MARKER = 'FLYGON_SANDY_FLAPPING_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    const discardOpponentTop2 = (player: Player) => {
      const opponent = StateUtils.getOpponent(state, player);
      if (opponent.deck.cards.length === 0) {
        return;
      }
      DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, player, 2, this, effect);
    };

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.SANDY_FLAPPING_MARKER, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      if (player.marker.hasMarker(this.SANDY_FLAPPING_MARKER, this)) {
        return state;
      }
      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {
          player.marker.addMarker(this.SANDY_FLAPPING_MARKER, this);
          discardOpponentTop2(player);
        }
      });
    }

    if (effect instanceof KnockOutEffect
      && effect.target === effect.player.active
      && effect.target.getPokemonCard() === this
      && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
      const owner = effect.player;
      if (owner.marker.hasMarker(this.SANDY_FLAPPING_MARKER, this)) {
        return state;
      }
      if (IS_ABILITY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }
      owner.marker.addMarker(this.SANDY_FLAPPING_MARKER, this);
      discardOpponentTop2(owner);
    }

    return state;
  }
}
