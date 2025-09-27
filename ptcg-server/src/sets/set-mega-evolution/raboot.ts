import { CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raboot extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Scorbunny';
  public hp: number = 100;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Jumping Kick',
    cost: [C],
    damage: 40,
    text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public regulationMark: string = 'I';
  public set: string = 'MEG';
  public setNumber: string = '27';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Raboot';
  public fullName: string = 'Raboot M1L';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Jumping Kick
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 40, targets);
      });
    }
    return state;
  }
}
