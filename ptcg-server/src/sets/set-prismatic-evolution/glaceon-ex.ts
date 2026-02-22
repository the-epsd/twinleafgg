import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, SlotType, ChoosePokemonPrompt } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
//import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayerType } from '../../game';

import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Glaceonex extends PokemonCard {

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public cardType: CardType = W;

  public hp: number = 270;

  public weakness = [{ type: M }];

  public retreat = [C];

  public attacks = [
    {
      name: 'Frost Bullet',
      cost: [W, C],
      damage: 110,
      text: 'This attack does 30 damage to 1 of your opponent\'s Benched Pokémon.'
    },
    {
      name: 'Euclase',
      cost: [G, W, D],
      damage: 0,
      text: 'Knock Out 1 of your opponent\'s Pokémon that has exactly 6 damage counters on it.'
    }
  ];

  public regulationMark: string = 'H';
  public set: string = 'PRE';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Glaceon ex';
  public fullName: string = 'Glaceon ex PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Frost Bullet
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
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
    }

    // Euclase
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets[0].damage === 60) {
          // shash their knees
          targets[0].damage += 999;
        }
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }
}