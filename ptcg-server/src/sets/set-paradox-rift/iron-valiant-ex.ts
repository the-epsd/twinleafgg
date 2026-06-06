import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, PowerType, ConfirmPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EffectOfAbilityEffect, MovedToActiveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { MOVED_TO_ACTIVE_THIS_TURN, REMOVE_MARKER_AT_END_OF_TURN, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class IronValiantex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_ex, CardTag.FUTURE];
  public cardType: CardType = P;
  public hp: number = 220;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public powers = [{
    name: 'Tachyon Bits',
    powerType: PowerType.ABILITY,
    exemptFromInitialize: true,
    text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
  }];

  public attacks = [{
    name: 'Laser Blade',
    cost: [P, P, C],
    damage: 200,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'G';
  public set: string = 'PAR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '89';
  public name: string = 'Iron Valiant ex';
  public fullName: string = 'Iron Valiant ex PAR';

  public readonly TACHYON_BITS_MARKER = 'TACHYON_BITS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    REMOVE_MARKER_AT_END_OF_TURN(effect, this.TACHYON_BITS_MARKER, this);

    const player = state.players[state.activePlayer];
    if (
      effect instanceof MovedToActiveEffect &&
      effect.pokemonCard === this &&
      state.players[state.activePlayer] === effect.player &&
      MOVED_TO_ACTIVE_THIS_TURN(effect.player, this)
    ) {
      if (player.marker.hasMarker(this.TACHYON_BITS_MARKER, this)) {
        return state;
      }

      state = store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (!wantToUse) {
          player.marker.addMarker(this.TACHYON_BITS_MARKER, this);
          return;
        }

        try {
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return;
        }

        player.marker.addMarker(this.TACHYON_BITS_MARKER, this);

        state = store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { min: 1, max: 1, allowCancel: true },
        ), selected => {
          const targets = selected || [];

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addBoardEffect(BoardEffect.ABILITY_USED);
            }
          });
          if (targets.length > 0) {
            const damageEffect = new EffectOfAbilityEffect(player, this.powers[0], this, targets[0]);
            store.reduceEffect(state, damageEffect);
            if (damageEffect.target) {
              damageEffect.target.damage += 20;
            }
          }
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}
