import { AttachEnergyPrompt, GameMessage, PokemonCardList } from '../../game';
import { PlayerType, SlotType } from '../../game/store/actions/play-card-action';
import { CardType, EnergyType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import {DISCARD_X_ENERGY_FROM_THIS_POKEMON} from '../../game/store/prefabs/costs';
import {WAS_ATTACK_USED} from '../../game/store/prefabs/prefabs';
import { StateUtils } from '../../game/store/state-utils';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Xerneas extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 130;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [ C, C ];

  public attacks = [{
    name: 'Geomancy',
    cost: [Y],
    damage: 0,
    text: 'Choose 2 of your Benched Pokémon. For each of those Pokémon, search your deck for a [Y] Energy card and attach it to that Pokémon. Shuffle your deck afterward.'
  }, {
    name: 'Rainbow Spear',
    cost: [Y, Y, C],
    damage: 100,
    text: 'Discard an Energy attached to this Pokémon.'
  }];

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Xerneas';
  public fullName: string = 'Xerneas STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      
      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
      if (benchIndex === -1) {
        return state;
      }

      const benchSpots = player.bench.filter(b => b.cards.length > 0).length;
      const min = Math.min(2, benchSpots);
      const max = Math.min(2, benchSpots);
      
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fairy Energy' },
        { allowCancel: false, min, max, differentTargets: true }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }

        return state;
      });
    }

    // Rainbow Spear
    if (WAS_ATTACK_USED(effect, 1, this)){
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);
    }

    return state;
  }
}
