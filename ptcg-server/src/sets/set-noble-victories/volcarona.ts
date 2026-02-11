import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, EnergyCard, AttachEnergyPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED } from '../../game/store/prefabs/attack-effects';

export class Volcarona extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Larvesta';
  public cardType: CardType = R;
  public hp: number = 110;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Fiery Dance',
      cost: [R],
      damage: 30,
      text: 'Attach a basic Energy card from your discard pile to 1 of your Pokémon.'
    },
    {
      name: 'Heat Wave',
      cost: [R, C, C],
      damage: 60,
      text: 'The Defending Pokémon is now Burned.'
    }
  ];

  public set: string = 'NVI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Volcarona';
  public fullName: string = 'Volcarona NVI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard && c.energyType === EnergyType.BASIC;
      });

      if (!hasEnergyInDiscard) {
        return state;
      }

      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        if (transfers.length > 0) {
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            player.discard.moveCardTo(transfer.card, target);
          }
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_BURNED(store, state, effect);
    }

    return state;
  }
}
