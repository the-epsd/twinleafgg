import { TrainerCard } from '../../game/store/card/trainer-card';
import { CardTag, EnergyType, SuperType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, CardList, EnergyCard, AttachEnergyPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { ToolEffect } from '../../game/store/effects/play-card-effects';

export class HeavyBaton extends TrainerCard {

  public regulationMark = 'H';

  public trainerType: TrainerType = TrainerType.TOOL;

  public set: string = 'TEF';

  public name: string = 'Heavy Baton';

  public fullName: string = 'Heavy Baton PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '151';

  public text: string =
    'If the Pokémon this card is attached to has a Retreat Cost of exactly 4, is in the Active Spot, and is Knocked Out by damage from an attack from your opponent\'s Pokémon, move up to 3 Basic Energy cards from that Pokémon to your Benched Pokémon in any way you like.';

  public readonly HEAVY_BATON_MARKER = 'HEAVY_BATON_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {

      const player = effect.player;

      const target = effect.target;
      const cards = target.getPokemons();

      const removedCards = [];

      const pokemonIndices = effect.target.cards.map((card, index) => index);

      const retreatCost = effect.target.getPokemonCard()?.retreat.length;

      try {
        const toolEffect = new ToolEffect(player, this);
        store.reduceEffect(state, toolEffect);
      } catch {
        return state;
      }

      if (retreatCost !== undefined && retreatCost == 4) {

        for (let i = pokemonIndices.length - 1; i >= 0; i--) {
          const removedCard = target.cards.splice(pokemonIndices[i], 1)[0];
          removedCards.push(removedCard);
          target.damage = 0;
        }

        if (cards.some(card => card.tags.includes(CardTag.POKEMON_EX) || card.tags.includes(CardTag.POKEMON_V) || card.tags.includes(CardTag.POKEMON_VSTAR) || card.tags.includes(CardTag.POKEMON_ex))) {
          effect.prizeCount += 1;
        }
        if (cards.some(card => card.tags.includes(CardTag.POKEMON_VMAX))) {
          effect.prizeCount += 2;
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
          { allowCancel: false, min: 0, max: 3 }
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
        });

      }
      return state;
    }
    return state;
  }
}