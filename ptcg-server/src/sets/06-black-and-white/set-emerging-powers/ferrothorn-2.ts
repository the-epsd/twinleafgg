import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType } from '../../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';

export class Ferrothorn2 extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Ferroseed';
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: P, value: -20 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Iron Defense',
    cost: [M],
    damage: 0,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Power Whip',
    cost: [C, C],
    damage: 0,
    text: 'Does 10 damage for each Energy attached to this Pokémon to 1 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'EPO';
  public setNumber: string = '73';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Ferrothorn';
  public fullName: string = 'Ferrothorn EPO 73';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Iron Defense
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Power Whip
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const energyCount = player.active.cards.filter(c => c.superType === SuperType.ENERGY).length;
      const damage = 10 * energyCount;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        const target = targets[0];
        const putDamage = new PutDamageEffect(effect, damage);
        putDamage.target = target;
        store.reduceEffect(state, putDamage);
      });
    }

    return state;
  }
}
