import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect } from '../../game/store/effects/game-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Weavile extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.DARK;

  public hp: number = 90;

  public retreat = [];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public attacks = [
    {
      name: 'Rule of Evil',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 60 damage to each Pokémon that has an Ability (both yours and your opponent\'s). (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Slash',
      cost: [CardType.DARK, CardType.COLORLESS],
      damage: 70,
      text: ''
    }
  ];

  public set: string = 'BUS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name: string = 'Weavile';

  public fullName: string = 'Weavile BUS';

  public evolvesFrom = 'Sneasel';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // calculate damage for opponent
      const opponentActive = opponent.active.getPokemonCard();

      const stubPowerEffectForActive = new PowerEffect(opponent, {
        name: 'test',
        powerType: PowerType.ABILITY,
        text: ''
      }, opponent.active.getPokemonCard()!);

      try {
        store.reduceEffect(state, stubPowerEffectForActive);

        if (opponentActive && opponentActive.powers.length) {
          effect.damage = 60;
        }
      } catch {
        // no abilities in active
      }

      if (opponent.bench.some(b => b.cards.length > 0)) {
        const stubPowerEffectForBench = new PowerEffect(opponent, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, opponent.bench.filter(b => b.cards.length > 0)[0].getPokemonCard()!);

        try {
          store.reduceEffect(state, stubPowerEffectForBench);

          const benched = opponent.bench.filter(b => b.cards.length > 0);

          benched.forEach(target => {
            const damageEffect = new PutDamageEffect(effect, 60);
            damageEffect.target = target;
            store.reduceEffect(state, damageEffect);
          });
        } catch {
          // no abilities on bench
        }
      }

      // calculate damage for player
      const active = player.active.getPokemonCard();

      const stubPowerEffectForMyActive = new PowerEffect(player, {
        name: 'test',
        powerType: PowerType.ABILITY,
        text: ''
      }, player.active.getPokemonCard()!);

      try {
        store.reduceEffect(state, stubPowerEffectForMyActive);

        if (active && active.powers.length) {
          const damageEffect = new PutDamageEffect(effect, 60);
          damageEffect.target = player.active;
          store.reduceEffect(state, damageEffect);
        }
      } catch {
        // no abilities in active
      }

      if (player.bench.some(b => b.cards.length > 0)) {
        const stubForBench = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, player.bench.filter(b => b.cards.length > 0)[0].getPokemonCard()!);

        try {
          store.reduceEffect(state, stubForBench);

          const myBenched = player.bench.filter(b => b.cards.length > 0);

          myBenched.forEach(target => {
            const benchDamageEffect = new PutDamageEffect(effect, 60);
            benchDamageEffect.target = target;
            store.reduceEffect(state, benchDamageEffect);
          });
        } catch {
          // no abilities on bench
        }
      }
      return state;
    }
    return state;
  }
}