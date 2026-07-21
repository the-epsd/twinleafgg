import { Attack, GameLog, GameMessage, State, StateUtils, StoreLike } from '../../../game';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../../game/store/card/card-types';
import { DealDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { AttackEffect } from '../../../game/store/effects/game-effects';
import { ChooseAttackPrompt } from '../../../game/store/prompts/choose-attack-prompt';
import { ChoosePokemonPrompt } from '../../../game/store/prompts/choose-pokemon-prompt';
import { PlayerType, SlotType } from '../../../game/store/actions/play-card-action';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Thievul extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Nickit';
  public cardType: CardType = D;
  public hp: number = 100;
  public weakness = [{ type: G }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Skill Thief',
      cost: [C, C],
      damage: 0,
      text: "If you have no cards in your hand, choose an attack from 1 of your opponent's Pokémon in play and use it as this attack.",
    },
    {
      name: 'Sharp Fang',
      cost: [D, C, C],
      damage: 80,
      text: '',
    },
  ];

  public set: string = 'PBL';
  public setNumber: string = '54';
  public regulationMark: string = 'J';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Thievul';
  public fullName: string = 'Thievul M5';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length > 0) {
        return state;
      }
      function* useSkillThief(next: Function): IterableIterator<State> {
        const opponent = StateUtils.getOpponent(state, player);
        let targetList = opponent.active;
        const hasBench = opponent.bench.some((b) => b.cards.length > 0);
        if (hasBench) {
          yield store.prompt(
            state,
            new ChoosePokemonPrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON,
              PlayerType.TOP_PLAYER,
              [SlotType.ACTIVE, SlotType.BENCH],
              { min: 1, max: 1, allowCancel: false },
            ),
            (selected) => {
              if (selected && selected.length > 0) {
                targetList = selected[0];
              }
              next();
            },
          );
        }
        const pokemonCard = targetList.getPokemonCard();
        if (!pokemonCard || pokemonCard.attacks.length === 0) {
          return state;
        }
        let chosen: Attack | undefined;
        yield store.prompt(
          state,
          new ChooseAttackPrompt(player.id, GameMessage.CHOOSE_ATTACK_TO_COPY, [pokemonCard], {
            allowCancel: false,
          }),
          (result: Attack | null) => {
            chosen = result ?? undefined;
            next();
          },
        );
        if (chosen === undefined) {
          return state;
        }
        const attackToCopy = chosen;
        store.log(state, GameLog.LOG_PLAYER_COPIES_ATTACK, {
          name: player.name,
          attack: attackToCopy.name,
        });
        const copyEffect = new AttackEffect(player, opponent, attackToCopy);
        store.reduceEffect(state, copyEffect);
        if (store.hasPrompts()) {
          yield store.waitPrompt(state, () => next());
        }
        if (copyEffect.damage > 0) {
          const dealDamage = new DealDamageEffect(copyEffect, copyEffect.damage);
          state = store.reduceEffect(state, dealDamage);
        }
        return state;
      }
      const generator = useSkillThief(() => generator.next());
      return generator.next().value;
    }
    return state;
  }
}
