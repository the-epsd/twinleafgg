import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Chinchou extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.LIGHTNING;
  public hp: number = 60;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.METAL, value: -20 }];
  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Pound',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: ''
    },
    {
      name: 'Spark',
      cost: [CardType.LIGHTNING, CardType.COLORLESS],
      damage: 10,
      text: 'This attack does 10 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];

  public set: string = 'CES';
  public setNumber: string = '49';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Chinchou';
  public fullName: string = 'Chinchou CES';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Spark attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const benched = opponent.bench.filter(b => b.cards.length > 0);
      if (benched.length === 0) {
        return state;
      }
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: Math.min(2, benched.length), max: Math.min(2, benched.length), allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        for (const target of targets) {
          const damageEffect = new PutDamageEffect(effect, 10);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        }
      });
      return state;
    }
    return state;
  }
}
