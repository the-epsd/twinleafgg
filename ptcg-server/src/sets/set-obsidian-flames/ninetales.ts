import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = R;
  public hp: number = 120;
  public weakness = [{ type: W }];
  public retreat = [C];
  public evolvesFrom = 'Vulpix';

  public attacks = [{
    name: 'Will-O-Wisp',
    cost: [R],
    damage: 20,
    text: ''
  },
  {
    name: 'Nine-Tailed Dance',
    cost: [R, R],
    damage: 0,
    text: 'Put 9 damage counters on 1 of your opponent\'s Pokémon.During your next turn, this Pokémon can\'t attack.'
  }];

  public regulationMark = 'G';
  public set = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name = 'Ninetales';
  public fullName = 'Ninetales OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const putCountersEffect = new PutCountersEffect(effect, 90);
        putCountersEffect.target = targets[0];
        store.reduceEffect(state, putCountersEffect);

      });
    }

    // Nine-Tailed Dance
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    return state;
  }
}