import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DRAW_CARDS_UNTIL_CARDS_IN_HAND } from '../../game/store/prefabs/prefabs';

export class Espeon extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = P;
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Psy Alert',
      cost: [C],
      damage: 20,
      text: 'Draw cards until you have 6 cards in your hand.'
    },
    {
      name: 'Shadow Ball',
      cost: [P],
      damage: 0,
      text: 'This attack does 40 damage to 1 of your opponent\'s Pokémon. Also apply Weakness and Resistance for Benched Pokémon.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '48';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Espeon';
  public fullName: string = 'Espeon PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Psy Alert
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS_UNTIL_CARDS_IN_HAND(player, 6);
    }

    // Attack 2: Shadow Ball - 40 damage to any of opponent's Pokemon, applying W/R even for bench
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

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
        // Use DealDamageEffect for all targets (applies W/R even for bench)
        const dealDamage = new DealDamageEffect(effect, 40);
        dealDamage.target = targets[0];
        store.reduceEffect(state, dealDamage);
      });
    }

    return state;
  }
}
