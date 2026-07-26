import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import {
  Card,
  StoreLike,
  State,
  ChoosePokemonPrompt,
  PlayerType,
  SlotType,
} from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../../game/store/effects/attack-effects';
import { GameMessage } from '../../../game/game-message';
import { CheckProvidedEnergyEffect } from '../../../game/store/effects/check-effects';
import { ChooseEnergyPrompt } from '../../../game/store/prompts/choose-energy-prompt';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Ambipom extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Aipom';
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Slap',
    cost: [C, C],
    damage: 50,
    text: ''
  },
  {
    name: 'Dual Tail',
    cost: [C, C, C],
    damage: 0,
    text: 'Discard 2 Energy from this Pokémon, and this attack does 60 damage to each of 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark = 'I';
  public set: string = 'PFL';
  public setNumber: string = '79';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ambipom';
  public fullName: string = 'Ambipom M2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dual Tail
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false },
      ), energy => {
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { min: 1, max: 2, allowCancel: false },
        ), selected => {
          const targets = selected || [];
          DAMAGE_OPPONENT_POKEMON(store, state, effect, 60, targets);
          const cards: Card[] = (energy || []).map(e => e.card);
          const discardEnergy = new DiscardCardsEffect(effect, cards);
          discardEnergy.target = player.active;
          store.reduceEffect(state, discardEnergy);
        });
      });
    }

    return state;
  }
}
