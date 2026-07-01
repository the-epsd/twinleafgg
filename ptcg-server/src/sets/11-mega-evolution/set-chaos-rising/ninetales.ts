import { CardType, Stage } from '../../../game/store/card/card-types';
import { Effect } from '../../../game/store/effects/effect';
import {
  PokemonCard,
  StoreLike,
  State,
  StateUtils,
  CardTarget,
  PlayerType,
  SlotType,
  ChoosePokemonPrompt,
  GameMessage,
} from '../../../game';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PutCountersEffect } from '../../../game/store/effects/attack-effects';

export class Ninetales extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Vulpix';
  public hp: number = 120;
  public cardType: CardType = R;
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Nine-Tailed Transfer',
      cost: [R],
      damage: 0,
      text: "Move all damage counters from 1 of your Benched Pokémon to your opponent's Active Pokémon. ",
    },
    {
      name: 'Will-o-Wisp',
      cost: [R, R],
      damage: 70,
      text: '',
    },
  ];

  public regulationMark = 'J';
  public set: string = 'CRI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';
  public name: string = 'Ninetales';
  public fullName: string = 'Ninetales M4';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Magical Echo
    // Ref: set-silver-tempest/altaria.ts (That one is AI-generated. Be warned)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasDamagedBench = player.bench.some((b) => b.cards.length > 0 && b.damage > 0);
      if (!hasDamagedBench) {
        return state;
      }

      const blocked: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList === player.active || cardList.damage === 0) {
          blocked.push(target);
        }
      });

      return store.prompt(
        state,
        new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false, blocked },
        ),
        (selected) => {
          if (!selected || selected.length === 0) {
            return;
          }
          const source = selected[0];
          const damageToMove = source.damage;
          source.damage = 0;

          const damageEffect = new PutCountersEffect(effect, damageToMove);
          damageEffect.target = opponent.active;
          store.reduceEffect(state, damageEffect);
        },
      );
    }

    return state;
  }
}
