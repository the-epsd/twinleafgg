import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { PowerType } from '../../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { DELTA_PLUS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Dustox extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Cascoon';
  public cardType: CardType = G;
  public hp: number = 130;
  public weakness = [{ type: R }];
  public retreat = [C];

  public powers = [{
    name: 'Delta Plus',
    powerType: PowerType.ANCIENT_TRAIT,
    text: 'If your opponent\'s Pokemon is Knocked Out by damage from an ' +
      'attack of this Pokemon, take 1 more Prize card.'
  }];

  public attacks = [{
    name: 'Flap',
    cost: [G],
    damage: 20,
    text: ''
  },
  {
    name: 'Wind Shard',
    cost: [G, C, C],
    damage: 0,
    text: ' This attack does 50 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) '
  }];

  public set: string = 'ROS';
  public cardImage: string = 'assets/cardback.png';
  public fullName: string = 'Dustox ROS';
  public name: string = 'Dustox';
  public setNumber: string = '8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 50);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
      return state;
    }

    return DELTA_PLUS(store, state, effect, this);
  }
}