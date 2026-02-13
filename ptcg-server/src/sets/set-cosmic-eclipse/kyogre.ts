import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, EnergyType, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType, SlotType, GameMessage, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { EnergyCard } from '../../game/store/card/energy-card';
import { AttachEnergyPrompt } from '../../game/store/prompts/attach-energy-prompt';
import { ChooseCardsPrompt } from '../../game/store/prompts/choose-cards-prompt';
import { WAS_ATTACK_USED, MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class Kyogre extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: G }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'High Water',
    cost: [C],
    damage: 130,
    text: 'Attach 2 [W] Energy cards from your discard pile to 1 of your Pokémon.'
  },
  {
    name: 'Swirling Waves',
    cost: [W, W, C, C],
    damage: 130,
    text: 'Discard an Energy from this Pokémon.'
  }];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Kyogre';
  public fullName: string = 'Kyogre CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // High Water ability
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      // Count Water Energy cards in discard
      const waterEnergyCards = player.discard.cards.filter(c => {
        return c.superType === SuperType.ENERGY
          && c.energyType === EnergyType.BASIC
          && (c as EnergyCard).provides.includes(CardType.WATER);
      });

      // If there are 0 Water Energy, return state without prompting
      if (waterEnergyCards.length === 0) {
        return state;
      }

      // Determine how many energy cards to attach based on availability
      const minToAttach = waterEnergyCards.length === 1 ? 1 : 2;
      const maxToAttach = waterEnergyCards.length === 1 ? 1 : 2;

      // Prompt to attach Water Energy from discard to 1 of player's Pokemon
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { min: minToAttach, max: maxToAttach, allowCancel: false }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        // Filter to only Water Energy cards
        const validTransfers = transfers.filter(transfer => {
          const card = transfer.card;
          return card.superType === SuperType.ENERGY
            && card.energyType === EnergyType.BASIC
            && (card as EnergyCard).provides.includes(CardType.WATER);
        });

        if (validTransfers.length < minToAttach) {
          throw new GameError(GameMessage.INVALID_TARGET);
        }

        // Attach energy cards to target Pokemon
        for (const transfer of validTransfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this });
        }
      });
    }

    // Swirling Waves attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      // Prompt to discard 1 energy from this Pokemon
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const cards = selected || [];
        if (cards.length === 0) {
          return;
        }
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        return store.reduceEffect(state, discardEnergy);
      });
    }

    return state;
  }
}
