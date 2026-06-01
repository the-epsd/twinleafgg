import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../game/store/card/card-types';
import { CardTarget, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { MoveDamageCountersEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../game/store/prefabs/attack-effects';

export class Cofagrigus extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Yamask';
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: D }];
  public resistance = [{ type: F, value: -30 }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Extended Damagriiigus',
      cost: [P, C],
      damage: 0,
      text: 'Move all damage counters from 1 of your Benched Pokémon to 1 of your opponent\'s Pokémon.'
    },
    {
      name: 'Perplex',
      cost: [P, C, C],
      damage: 60,
      text: 'Your opponent\'s Active Pokémon is now Confused.'
    }
  ];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '40';
  public name: string = 'Cofagrigus';
  public fullName: string = 'Cofagrigus WHT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const blockedSources: CardTarget[] = [];
      let hasDamagedBench = false;
      player.bench.forEach((cardList, index) => {
        if (cardList.cards.length > 0 && cardList.damage > 0) {
          hasDamagedBench = true;
          return;
        }
        blockedSources.push({ player: PlayerType.BOTTOM_PLAYER, slot: SlotType.BENCH, index });
      });

      if (!hasDamagedBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false, blocked: blockedSources }
      ), sources => {
        if (!sources || sources.length === 0) {
          return;
        }

        const source = sources[0];
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.ACTIVE, SlotType.BENCH],
          { allowCancel: false }
        ), targets => {
          if (!targets || targets.length === 0) {
            return;
          }

          const moveEffect = new MoveDamageCountersEffect(player);
          state = store.reduceEffect(state, moveEffect);
          if (moveEffect.preventDefault) {
            return;
          }

          const damageToMove = source.damage;
          source.damage = 0;
          targets[0].damage += damageToMove;
        });
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }
}
