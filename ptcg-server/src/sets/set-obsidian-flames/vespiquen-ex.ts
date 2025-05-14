import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { HealTargetEffect, PutCountersEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Vespiquenex extends PokemonCard {
  public regulationMark = 'G';
  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Combee';
  public cardType: CardType = P;
  public hp: number = 270;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Healing Pheromone',
      cost: [G],
      damage: 0,
      text: 'Heal 60 damage from 1 of your Pokémon.'
    },
    {
      name: 'Phantom Queen',
      cost: [G, G, G],
      damage: 200,
      text: 'Put 3 damage counters on each of your opponent\'s Benched Pokémon that has any damage counters on it.'
    }
  ];

  public set: string = 'OBF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '96';
  public name: string = 'Vespiquen ex';
  public fullName: string = 'Vespiquen ex OBF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new HealTargetEffect(effect, 60);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;

      if (opponent.active.damage > 0) {
        const activeDamageEffect = new PutCountersEffect(effect, 20);
        activeDamageEffect.target = opponent.active;
        store.reduceEffect(state, activeDamageEffect);
      }

      opponent.bench.forEach((bench, index) => {
        if (bench.cards.length > 0 && bench.damage > 0) {
          const damageEffect = new PutCountersEffect(effect, 30);
          damageEffect.target = bench;
          store.reduceEffect(state, damageEffect);
        }
      });
    }

    return state;
  }
}