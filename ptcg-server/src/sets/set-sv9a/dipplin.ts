import {Card, ChooseEnergyPrompt, EnergyCard, GameMessage} from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {CheckProvidedEnergyEffect} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import {  MOVE_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Dipplin extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Applin';
  public regulationMark = 'I';
  public cardType: CardType = G;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public retreat = [ C, C, C ];

  public attacks = [{
    name: 'Energy Loop',
    cost: [ G ],
    damage: 50,
    text: 'Put an Energy attached to this Pokémon into your hand.'
  }];

  public set: string = 'SV9a';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '10';
  public name: string = 'Dipplin';
  public fullName: string = 'Dipplin SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Energy Loop
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      if (!player.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      state = store.prompt(state, new ChooseEnergyPrompt(
        player.id,
        GameMessage.CHOOSE_ENERGIES_TO_DISCARD,
        checkProvidedEnergy.energyMap,
        [CardType.COLORLESS, CardType.COLORLESS],
        { allowCancel: false }
      ), energy => {
        const cards: Card[] = (energy || []).map(e => e.card);
        MOVE_CARDS_TO_HAND(store, state, player, cards);
      });
    }

    return state;
  }
}