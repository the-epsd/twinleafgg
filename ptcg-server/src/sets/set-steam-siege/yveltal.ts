import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Yveltal extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 130;
  public weakness = [{ type: L }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Oblivion Wing',
    cost: [D],
    damage: 30,
    text: 'Attach a [D] Energy card from your discard pile to 1 of your Benched Pokémon.'
  },
  {
    name: 'Darkness Blade',
    cost: [D, D, C],
    damage: 100,
    text: 'Flip a coin. If tails, this Pokémon can\'t attack during your next turn.'
  }];

  public set: string = 'STS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '65';
  public name: string = 'Yveltal';
  public fullName: string = 'Yveltal STS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.provides.includes(CardType.DARK);
      });

      if (!hasEnergyInDiscard) {
        return state;
      }

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, name: 'Darkness Energy' },
        { allowCancel: false, min: 1, max: 1 }
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

      return state;
    }

    return state;
  }
}