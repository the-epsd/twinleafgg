import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { StoreLike, State, StateUtils, AttachEnergyPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Stage, CardType, SuperType } from '../../game/store/card/card-types';
import { MOVE_CARD_TO, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Seadra extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Horsea';
  public cardType: CardType = W;
  public hp: number = 70;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Confuse Ray',
    cost: [W, C],
    damage: 10,
    text: 'The Defending Pokémon is now Confused.'
  },
  {
    name: 'Aqua Trick',
    cost: [W, C, C],
    damage: 30,
    text: 'Move 1 Energy card attached to the Defending Pokémon to 1 of your opponent\'s Benched Pokémon. If your opponent has no Benched Pokémon, this effect does nothing.'
  }];

  public set: string = 'TRR';
  public name: string = 'Seadra';
  public fullName: string = 'Seadra TRR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '48';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    //Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        opponent.active,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0, max: 1 }
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARD_TO(state, transfer.card, target);
        }
      });
    }

    return state;
  }

}