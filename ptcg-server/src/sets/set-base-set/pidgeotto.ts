import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { Attack } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';
import { StateUtils } from '../..';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AFTER_ATTACK, SWITCH_ACTIVE_WITH_BENCHED } from '../../game/store/prefabs/prefabs';

export class Pidgeotto extends PokemonCard {

  public set = 'BS';

  public fullName = 'Pidgeotto BS';

  public name = 'Pidgeotto';

  public stage = Stage.STAGE_1;

  public evolvesFrom = 'Pidgey';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '22';

  public hp = 60;

  public cardType = CardType.COLORLESS;

  public weakness = [{ type: CardType.LIGHTNING }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  private mirrorMoveEffects: AbstractAttackEffect[] = [];

  public attacks: Attack[] = [
    {
      name: 'Whirlwind',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 20,
      text: 'If your opponent has any Benched Pokémon, he or she chooses 1 of them and switches it with the Defending Pokémon. (Do the damage before switching the Pokémon.)'
    },
    {
      name: 'Mirror Move',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'If Pidgeotto was attacked last turn, do the final result of that attack on Pidgeotto to the Defending Pokémon.'
    }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (AFTER_ATTACK(effect, 0, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      SWITCH_ACTIVE_WITH_BENCHED(store, state, opponent);
    }

    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      this.mirrorMoveEffects.push(effect);

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      if (effect.player.active.cards.includes(this) || effect.player.bench.some(b => b.cards.includes(this))) {
        this.mirrorMoveEffects = [];
      }

      return state;
    }

    return state;
  }

}
