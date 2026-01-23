import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { WAS_ATTACK_USED, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';
import { AfterAttackEffect } from '../../game/store/effects/game-phase-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Lilligant extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Petilil';
  public cardType: CardType = G;
  public hp: number = 80;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Aromax',
      cost: [G],
      damage: 0,
      text: 'Heal all damage from 1 of your Benched Pokemon.'
    },
    {
      name: 'Windmill',
      cost: [G, C],
      damage: 30,
      text: 'Switch this Pokemon with 1 of your Benched Pokemon.'
    }
  ];

  public set: string = 'NVI';
  public setNumber: string = '5';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Lilligant';
  public fullName: string = 'Lilligant NVI';

  private usedWindmill: boolean = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aromax - heal all damage from benched Pokemon
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), targets => {
        if (targets && targets.length > 0) {
          targets[0].damage = 0;
        }
      });
    }

    // Windmill - mark for switching after attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      this.usedWindmill = true;
    }

    // After Windmill attack, switch self with benched
    if (effect instanceof AfterAttackEffect && this.usedWindmill) {
      this.usedWindmill = false;
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);

      if (hasBenched) {
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      }
    }

    // Cleanup
    if (effect instanceof EndTurnEffect && this.usedWindmill) {
      this.usedWindmill = false;
    }

    return state;
  }
}
