import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, Stage, CardType } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Greninjaex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public tags = [CardTag.POKEMON_ex];
  public evolvesFrom: string = 'Frogadier';
  public hp: number = 300;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Stealthy Slash',
    cost: [W],
    damage: 0,
    text: 'This attack does 30 damage to 1 of your opponent\'s Pokémon for each damage counter on that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Aqua Edge',
    cost: [W, W],
    damage: 160,
    text: ''
  }];

  public regulationMark: string = 'J';
  public set: string = '30C';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Greninja ex';
  public fullName: string = 'Greninja ex 30C';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Ref: set-stellar-crown/raging-bolt.ts (choose active or bench), set-vivid-voltage/barraskewda.ts (damage per counter on target)
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
        targets.forEach(target => {
          const damageAmount = 3 * target.damage;
          if (damageAmount > 0) {
            DAMAGE_OPPONENT_POKEMON(store, state, effect, damageAmount, [target]);
          }
        });
      });
    }
    return state;
  }
}
