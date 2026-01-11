import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class HopsZacianex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.HOPS, CardTag.POKEMON_ex];
  public cardType: CardType = M;
  public hp: number = 230;
  public retreat = [C, C];
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];

  public attacks = [{
    name: 'Insta-Strike',
    cost: [C],
    damage: 30,
    text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },

  {
    name: 'Brave Slash',
    cost: [M, M, M, C],
    damage: 240,
    text: 'During your next turn, this Pokémon can\'t use Brave Slash.'
  }];

  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public set: string = 'JTG';
  public setNumber = '111';
  public name: string = 'Hop\'s Zacian ex';
  public fullName: string = 'Hop\'s Zacian ex JTG';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
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
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (!player.active.cannotUseAttacksNextTurnPending.includes('Brave Slash')) {
        player.active.cannotUseAttacksNextTurnPending.push('Brave Slash');
      }
    }
    return state;
  }
}