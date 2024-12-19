import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State, ConfirmPrompt, GameMessage, SuperType, PlayerType, AttachEnergyPrompt, SlotType, StateUtils, EnergyCard, CardTarget } from '../../game';
import { CheckPokemonStatsEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, EvolveEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Archaludonex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Duraludon';
  public cardType: CardType = M;
  public hp: number = 300;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Energy Attachment',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokemon during your turn, you may attach 2 Basic [M] Energy from your discard pile to your [M] Pokémon in any way you like.'
  }];

  public attacks = [{
    name: 'Metal Defender',
    cost: [M, M, M],
    damage: 220,
    text: 'During your opponent\'s next turn, this Pokemon has no Weakness.'
  }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '130';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Archaludon ex';
  public fullName: string = 'Archaludon ex SV8';

  public readonly METAL_DEFENDER_MARKER = 'METAL_DEFENDER_MARKER';
  public readonly CLEAR_METAL_DEFENDER_MARKER = 'CLEAR_METAL_DEFENDER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EvolveEffect && effect.pokemonCard === this) {
      const player = effect.player;

      const hasMetalEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.name === 'Metal Energy';
      });
      if (!hasMetalEnergyInDiscard) {
        return state;
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (card.cardType !== M) {
          blocked2.push(target);
        }
      });

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {

        if (wantToUse) {
          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_ACTIVE,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.ACTIVE, SlotType.BENCH],
            { superType: SuperType.ENERGY, name: 'Metal Energy' },
            { allowCancel: false, min: 0, max: 2, blockedTo: blocked2 }
          ), transfers => {
            transfers = transfers || [];

            if (transfers.length === 0) {
              return state;
            }

            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.discard.moveCardTo(transfer.card, target);
            }
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      player.active.attackMarker.addMarker(this.METAL_DEFENDER_MARKER, this);
      opponent.attackMarker.addMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
    }

    if (effect instanceof CheckPokemonStatsEffect) {
      const player = StateUtils.findOwner(state, effect.target);
      if (player.active.attackMarker.hasMarker(this.METAL_DEFENDER_MARKER, this)) {
        effect.weakness = [];
        return state;
      }
    }

    if (effect instanceof EndTurnEffect
      && effect.player.attackMarker.hasMarker(this.CLEAR_METAL_DEFENDER_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.CLEAR_METAL_DEFENDER_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
        cardList.attackMarker.removeMarker(this.METAL_DEFENDER_MARKER, this);
      });
    }
    return state;
  }
}