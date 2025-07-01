import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Empoleon extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Prinplup';
  public cardType: CardType = W;
  public hp: number = 130;
  public weakness = [{ type: L, value: +30 }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Dual Splash',
    cost: [W, C],
    damage: 0,
    text: 'Choose 2 of your opponent\'s Pokémon. This attack does 30 damage to each of them. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  },
  {
    name: 'Aqua Jet',
    cost: [W, W, C],
    damage: 50,
    damageCalculation: '+',
    text: 'Does 50 damage plus 10 more damage for each of your Benched Pokémon. Flip a coin. If tails, this attack does 10 damage to each of your Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'MD';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '17';
  public name: string = 'Empoleon';
  public fullName: string = 'Empoleon MD';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentTargets = [opponent.active, ...opponent.bench].filter(p => p.cards.length > 0);
      const numTargets = opponentTargets.length;
      const minMax = numTargets >= 2 ? 2 : 1;

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: minMax, max: minMax, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 30);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);
        });
        return state;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;

      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      effect.damage += playerBench * 10;

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (!result) {
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList) => {
            if (cardList === player.active) {
              return;
            }
            const damage = new PutDamageEffect(effect, 10);
            damage.target = cardList;
            store.reduceEffect(state, damage);
          });
        }
      });
    }

    return state;
  }
}