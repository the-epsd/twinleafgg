import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { CardTag, CardType, Stage } from '../../../game/store/card/card-types';
import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { DealDamageEffect, PutDamageEffect } from '../../../game/store/effects/attack-effects';
import { Effect } from '../../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { OPPONENT_CANNOT_PLAY_CARDS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Golbat';
  protected _tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType[] = [G, M];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [];

  public attacks = [
    {
      name: 'Radar Jam',
      cost: [C, C],
      damage: 30,
      text: "Your opponent can't play any Trainer cards (except for Supporter cards) from his or her hand during your opponent's next turn.",
    },
    {
      name: 'Target Attack',
      cost: [G, M, C],
      damage: 0,
      text: "Choose 1 of your opponent's Pokémon. This attack does 40 damage to that Pokémon. If that Pokémon already has damage counters on it, this attack does 60 damage instead. (Don't apply Weakness and Resistance for Benched Pokémon.)",
    },
  ];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Radar Jam
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENT_CANNOT_PLAY_CARDS(store, state, effect, this, { item: true, tool: true, stadium: true });
    }

    // Target Attack
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        const damage = target.damage > 0 ? 50 : 30;
        let damageEffect: DealDamageEffect | PutDamageEffect;
        if (target === opponent.active) {
          damageEffect = new DealDamageEffect(effect, damage);
        } else {
          damageEffect = new PutDamageEffect(effect, damage);
        }
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}
