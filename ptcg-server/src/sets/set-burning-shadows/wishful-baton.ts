import { TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';


export class WishfulBaton extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BUS';

  public name: string = 'Wishful Baton';

  public fullName: string = 'Wishful Baton BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public text: string =
    'If the Pokémon this card is attached to is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, move up to 3 basic Energy cards from that Pokémon to 1 of your Benched Pokémon.';

  // public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
  //   if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {
  //     const player = effect.player;
  //     const target = effect.target;

  //     if (IS_TOOL_BLOCKED(store, state, effect.player, this)) { return state; }

  //     // Get all cards from the target
  //     const allCards = [...target.cards];

  //     // Filter out basic energy cards
  //     const basicEnergy = allCards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC);

  //     // If there are basic energy cards, prompt to attach them
  //     if (basicEnergy.length > 0) {
  //       const energyToAttach = new CardList();
  //       energyToAttach.cards = basicEnergy;

  //       // Remove the energy cards from the target so they don't get moved to discard/lost zone
  //       target.cards = target.cards.filter(c => !(c instanceof EnergyCard && c.energyType === EnergyType.BASIC));

  //       // Remove the Wishful Baton from both the cards array and the tool property
  //       target.cards = target.cards.filter(c => c !== this);
  //       target.tool = undefined;

  //       // Move the Wishful Baton to the discard pile using MOVE_CARDS
  //       state = MOVE_CARDS(store, state, target, player.discard, { cards: [this] });

  //       // Prevent the default knockout behavior since we're handling the energy cards
  //       effect.preventDefault = true;

  //       return store.prompt(state, new AttachEnergyPrompt(
  //         player.id,
  //         GameMessage.ATTACH_ENERGY_TO_BENCH,
  //         energyToAttach,
  //         PlayerType.BOTTOM_PLAYER,
  //         [SlotType.BENCH],
  //         { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
  //         { allowCancel: false, min: 0, max: 3, sameTarget: true }
  //       ), transfers => {
  //         transfers = transfers || [];
  //         if (transfers.length === 0) {
  //           // If no transfers were made, move all energy to discard
  //           state = MOVE_CARDS(store, state, energyToAttach, player.discard, { cards: energyToAttach.cards });
  //           return state;
  //         }

  //         for (const transfer of transfers) {
  //           const target = StateUtils.getTarget(state, player, transfer.to);
  //           energyToAttach.moveCardTo(transfer.card, target);
  //         }

  //         // Move any remaining energy to discard
  //         if (energyToAttach.cards.length > 0) {
  //           state = MOVE_CARDS(store, state, energyToAttach, player.discard, { cards: energyToAttach.cards });
  //         }
  //         return state;
  //       });
  //     }
  //   }
  //   return state;
  // }
}