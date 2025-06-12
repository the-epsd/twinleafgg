import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutOpponentEffect } from '../../game/store/effects/attack-effects';
import { StateUtils } from '../../game';

export class Haxorus extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Fraxure';
  public cardType = N;
  public hp: number = 170;
  public weakness = [];
  public resistance = [];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Cross-Cut',
      cost: [C, C],
      damage: 80,
      damageCalculation: '+',
      text: "If your opponent's Active Pokémon is an Evolution Pokémon, this attack does 80 more damage."
    },
    {
      name: 'Axe Bomber',
      cost: [F, M, C],
      damage: 0,
      text: "If your opponent's Active Pokémon is a Basic Pokémon, it is Knocked Out."
    }
  ];

  public set: string = 'SV11B';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Haxorus';
  public fullName: string = 'Haxorus SV11B';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.stage !== Stage.BASIC)) {
        effect.damage += 80;
      }
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && (opponentActive.stage === Stage.BASIC)) {
        const knockOut = new KnockOutOpponentEffect(effect, 999);
        knockOut.target = opponent.active;
        state = store.reduceEffect(state, knockOut);
      }
      return state;
    }
    return state;
  }
} 