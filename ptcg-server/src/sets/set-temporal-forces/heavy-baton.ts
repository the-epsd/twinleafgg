import { TrainerCard } from '../../game/store/card/trainer-card';
import { TrainerType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State, GamePhase } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { StateUtils } from '../../game/store/state-utils';
import { Card, EnergyCard } from '../../game';
import { BetweenTurnsEffect } from '../../game/store/effects/game-phase-effects';

export class HeavyBaton extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'PAR';

  public name: string = 'Heavy Baton';

  public fullName: string = 'Heavy Baton PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public text: string =
    'If the Pokémon this card is attached to has a Retreat Cost of exactly 4, is in the Active Spot, and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 3 Basic Energy cards from that Pokémon to your Benched Pokémon in any way you like.';

  public readonly RESCUE_SCARF_MAREKER = 'RESCUE_SCARF_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = player.bench.some(b => b.cards.length > 0);
      //   const energyList = new CardList();

      // Get attached energy cards
      const attachedEnergies = effect.target.cards.filter(card => {
        return card instanceof EnergyCard;
      });

      //   attachedEnergies.forEach(energy => {
      //     energy.cards.moveTo(energyList);
      //   });

      //   const retreatCost = effect.target.getPokemonCard()?.retreat;

      //   if (retreatCost && retreatCost.length === 4 && retreatCost.every(cost => cost === CardType.COLORLESS)) {
      //     // Retreat cost is 4 colorless energy
      //   }
      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      if (hasBench === false) {
        return state;
      }

      const target = effect.target;
      const cards = target.getPokemons();
      cards.forEach(card => {
        attachedEnergies.forEach(energyCard => this.marker.addMarker(this.RESCUE_SCARF_MAREKER, card));
      });
    
      if (effect instanceof BetweenTurnsEffect) {
        state.players.forEach(player => {

          if (!player.marker.hasMarker(this.RESCUE_SCARF_MAREKER)) {
            return;
          }

          const rescued: Card[] = player.marker.markers
            .filter(m => m.name === this.RESCUE_SCARF_MAREKER)
            .map(m => m.source);

          player.discard.moveCardsTo(rescued, player.hand);
          player.marker.removeMarker(this.RESCUE_SCARF_MAREKER);

        });
      }
      return state;
    }
    return state;
  }
}

//   return store.prompt(state, new AttachEnergyPrompt(
//     player.id,
//     GameMessage.ATTACH_ENERGY_TO_BENCH,
//     energyList,
//     PlayerType.BOTTOM_PLAYER,
//     [ SlotType.BENCH ],
//     { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
//     { allowCancel: false, min: 0, max: 3 }
//   ), transfers => {
//     transfers = transfers || [];
//     for (const transfer of transfers) {
//       const target = StateUtils.getTarget(state, player, transfer.to);
//       energyList.moveCardTo(transfer.card, target);
//     }
