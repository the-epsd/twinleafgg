import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { GameError, GameMessage, StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED, MULTIPLE_COIN_FLIPS_PROMPT } from '../../game/store/prefabs/prefabs';

export class Jolteon extends PokemonCard {
  public tags = [CardTag.TEAM_PLASMA];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = L;
  public hp: number = 90;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [
    {
      name: 'Pin Missile',
      cost: [C],
      damage: 20,
      damageCalculation: 'x' as 'x',
      text: 'Flip 4 coins. This attack does 20 damage times the number of heads.'
    },
    {
      name: 'Electri-Defuse',
      cost: [L, C],
      damage: 40,
      text: 'If the Defending Pokémon is a Pokémon-EX, that Pokémon can\'t attack during your opponent\'s next turn.'
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '34';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Jolteon';
  public fullName: string = 'Jolteon PLF';

  private readonly ELECTRI_DEFUSE_MARKER = 'ELECTRI_DEFUSE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      MULTIPLE_COIN_FLIPS_PROMPT(store, state, effect.player, 4, results => {
        const heads = results.filter(r => r).length;
        effect.damage = 20 * heads;
      });
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();

      if (defending && defending.tags.includes(CardTag.POKEMON_EX)) {
        opponent.active.marker.addMarker(this.ELECTRI_DEFUSE_MARKER, this);
      }
    }

    if (effect instanceof AttackEffect
      && effect.player.active.marker.hasMarker(this.ELECTRI_DEFUSE_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect
      && effect.player.active.marker.hasMarker(this.ELECTRI_DEFUSE_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.ELECTRI_DEFUSE_MARKER, this);
    }

    return state;
  }
}
