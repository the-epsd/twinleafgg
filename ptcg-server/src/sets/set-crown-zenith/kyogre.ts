import { AttachEnergyPrompt, ChooseEnergyPrompt, ChoosePokemonPrompt, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { GameMessage } from '../../game/game-message';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';

import { DAMAGE_OPPONENT_POKEMON, MOVE_CARDS, SHUFFLE_DECK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Kyogre extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.WATER;

  public hp: number = 140;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Wave Summoning',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for a [W] Energy card and attach it to this Pokémon. Then, shuffle your deck.'
    }, {
      name: 'Dynamic Wave',
      cost: [CardType.WATER, CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 0,
      text: 'Put 3 Energy attached to this Pokémon into your hand. This attack does 180 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public set: string = 'CRZ';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '36';

  public name: string = 'Kyogre';

  public fullName: string = 'Kyogre CRZ';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {

      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_HAND,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          MOVE_CARDS(store, state, player.active, player.hand, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[1] });
        }

        const min = Math.min(1);
        const max = Math.min(1);

        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min, max, allowCancel: false }
        ), selected => {
          const targets = selected || [];
          DAMAGE_OPPONENT_POKEMON(store, state, effect, 180, targets);
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {

      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Water Energy' },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          SHUFFLE_DECK(store, state, player);
          return;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.deck, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
          SHUFFLE_DECK(store, state, player);
          return state;
        }
      });
    }
    return state;
  }
}