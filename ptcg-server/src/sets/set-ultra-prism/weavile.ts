import { PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardType, SpecialCondition, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Weavile extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.DARK;

  public hp: number = 90;

  public retreat = [CardType.COLORLESS];

  public weakness = [{ type: CardType.FIGHTING }];

  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];

  public attacks = [
    {
      name: 'Icy Wind',
      cost: [CardType.COLORLESS],
      damage: 10,
      text: 'Your opponent\'s Active Pokémon is now Asleep.'
    },
    {
      name: 'Evil Admonition',
      cost: [CardType.DARK],
      damage: 50,
      damageCalculation: 'x',
      text: 'This attack does 50 damage for each of your opponent\'s Pokémon that has an Ability.'
    }
  ];

  public set: string = 'UPR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '74';

  public name: string = 'Weavile';

  public fullName: string = 'Weavile UPR';

  public evolvesFrom = 'Sneasel';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let benchPokemon: PokemonCard[] = [];
      const pokemonWithAbilities: PokemonCard[] = [];
      const opponentActive = opponent.active.getPokemonCard();

      const stubPowerEffectForActive = new PowerEffect(opponent, {
        name: 'test',
        powerType: PowerType.ABILITY,
        text: ''
      }, opponent.active.getPokemonCard()!);

      try {
        store.reduceEffect(state, stubPowerEffectForActive);

        if (opponentActive && opponentActive.powers.length) {
          pokemonWithAbilities.push(opponentActive);
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

          benchPokemon = opponent.bench.map(b => b.getPokemonCard()).filter(card => card !== undefined) as PokemonCard[];
          pokemonWithAbilities.push(...benchPokemon.filter(card => card.powers.length));
        } catch {
          // no abilities on bench
        }
      }

      const abilities = pokemonWithAbilities.length;
      effect.damage = abilities * 50;

      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const sleepEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.ASLEEP]);
      store.reduceEffect(state, sleepEffect);

      return state;
    }

    return state;
  }

}
