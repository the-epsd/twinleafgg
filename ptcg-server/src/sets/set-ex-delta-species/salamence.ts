import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';

export class Salamence extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Shelgon';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = R;
  public additionalCardTypes = [M];
  public hp: number = 110;
  public weakness = [{ type: C }];
  public resistance = [{ type: R, value: -30 }, { type: F, value: -30 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fire Dance',
      cost: [R, C],
      damage: 30,
      text: 'Search your discard pile for a [R] Energy card and attach it to 1 of your Pokémon.'
    },
    {
      name: 'Delta Blast',
      cost: [R, M, C, C],
      damage: 100,
      text: 'Discard a [M] Energy card attached to Salamence.'
    }
  ];

  public set: string = 'DS';
  public name: string = 'Salamence';
  public fullName: string = 'Salamence DS';
  public setNumber: string = '14';
  public cardImage: string = 'assets/cardback.png';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.provides.includes(CardType.FIRE);
      });
      if (!hasEnergyInDiscard) {
        return state;
      }

      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, name: 'Fire Energy' },
        { allowCancel: true, min: 1, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1, CardType.METAL);
    }

    return state;
  }

}
