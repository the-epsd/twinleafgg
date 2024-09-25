import { CardList, EnergyCard } from '../../game';
import { GameMessage } from '../../game/game-message';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { TrainerCard } from '../../game/store/card/trainer-card';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class WishfulBaton extends TrainerCard {

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'BUS';

  public name: string = 'Wishful Baton';

  public fullName: string = 'Wishful Baton BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '128';

  public text: string =
    'If the Pokémon this card is attached to is your Active Pokémon and is Knocked Out by damage from an opponent\'s attack, move up to 3 basic Energy cards from that Pokémon to 1 of your Benched Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this) && effect.player.marker.hasMarker(effect.player.DAMAGE_DEALT_MARKER)) {

      const player = effect.player;

      const target = effect.target;
      const cards = target.getPokemons();

      const removedCards = [];

      const pokemonIndices = effect.target.cards.map((card, index) => index);

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      for (let i = pokemonIndices.length - 1; i >= 0; i--) {
        const removedCard = target.cards.splice(pokemonIndices[i], 1)[0];
        removedCards.push(removedCard);
        target.damage = 0;
      }

      const energyToAttach = new CardList();

      const toolCard = new CardList();
      toolCard.cards = removedCards.filter(c => c instanceof TrainerCard && c.trainerType === TrainerType.TOOL);

      const lostZoned = new CardList();
      lostZoned.cards = cards;

      const specialEnergy = new CardList();
      specialEnergy.cards = removedCards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.SPECIAL);

      const basicEnergy = new CardList();
      basicEnergy.cards = removedCards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC);

      lostZoned.moveTo(player.discard);
      toolCard.moveTo(player.discard);
      specialEnergy.moveTo(player.discard);

      basicEnergy.moveTo(energyToAttach);

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        energyToAttach,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 3, sameTarget: true }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          energyToAttach.moveCardTo(transfer.card, target);
        }

        energyToAttach.moveTo(player.discard);
      });
    }
    return state;
  }
}


