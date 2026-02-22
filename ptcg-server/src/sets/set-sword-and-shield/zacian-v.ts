import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, GameMessage, GameError, CardList, EnergyCard, AttachEnergyPrompt, PlayerType, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class ZacianV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_V];
  public cardType: CardType = M;
  public hp: number = 220;
  public weakness = [{ type: R }];
  public retreat = [C, C];
  public resistance = [{ type: G, value: -30 }];

  public powers = [{
    name: 'Intrepid Sword',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may look at the top 3 cards of your deck and attach any number of [M] Energy cards you find there to this Pokémon. Put the other cards into your hand. If you use this Ability, your turn ends.'
  }];

  public attacks = [{
    name: 'Brave Blade',
    cost: [M, M, M],
    damage: 230,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name: string = 'Zacian V';
  public fullName: string = 'Zacian V SSH';

  public readonly BRAVE_BLADE_MARKER = 'BRAVE_BLADE_MARKER';
  public readonly BRAVE_BLADE_MARKER_2 = 'BRAVE_BLADE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intrepid Sword
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      const topdecks = new CardList();
      player.deck.moveTo(topdecks, 3);

      // Find the slot for this Zacian V using the new system
      const zacianSlot = StateUtils.findPokemonSlot(state, this);
      if (!zacianSlot) {
        // Should never happen, but safety check
        return state;
      }
      // Find the CardTarget for this Zacian V slot
      let zacianTarget: CardTarget | undefined;
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (list === zacianSlot && card === this) {
          zacianTarget = target;
        } else {
          blockedTo.push(target);
        }
      });
      if (!zacianTarget) {
        // Should never happen, but safety check
        return state;
      }

      // Filter Metal Energy
      const metalEnergies = topdecks.cards.filter(card => card instanceof EnergyCard && card.name === 'Metal Energy');
      const metals = metalEnergies.length;

      if (metals === 0) {
        topdecks.moveTo(player.hand);
      } else {
        // Only allow attaching to this Zacian V
        state = store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_CARDS,
          topdecks,
          PlayerType.BOTTOM_PLAYER,
          // Only this Zacian V's slot
          [zacianTarget.slot],
          { superType: SuperType.ENERGY, name: 'Metal Energy' },
          { allowCancel: false, min: 0, max: metals, sameTarget: true, blockedTo }
        ), transfers => {
          transfers = transfers || [];
          // Attach selected Metal Energies to this Zacian V
          for (const transfer of transfers) {
            // Only allow attaching to this Zacian V
            if (
              transfer.to.player === zacianTarget!.player &&
              transfer.to.slot === zacianTarget!.slot &&
              transfer.to.index === zacianTarget!.index
            ) {
              topdecks.moveCardTo(transfer.card, StateUtils.getTarget(state, player, transfer.to));
            }
          }
          // Move the rest to hand
          topdecks.moveTo(player.hand);
        });
      }

      // end the turn
      const endTurnEffect = new EndTurnEffect(player);
      return store.reduceEffect(state, endTurnEffect);
    }

    // Brave Blade
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      if (effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.marker.addMarker(this.BRAVE_BLADE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.BRAVE_BLADE_MARKER, this);
      effect.player.marker.removeMarker(this.BRAVE_BLADE_MARKER_2, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER, this)) {
      effect.player.marker.addMarker(this.BRAVE_BLADE_MARKER_2, this);
    }

    return state;
  }
}