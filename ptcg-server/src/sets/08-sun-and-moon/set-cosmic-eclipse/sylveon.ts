import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, TrainerType } from '../../../game/store/card/card-types';
import { StoreLike, State } from '../../../game';
import { TrainerCard } from '../../../game/store/card/trainer-card';
import { Effect } from '../../../game/store/effects/effect';
import { EndTurnEffect } from '../../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../../game/store/effects/play-card-effects';
import { WAS_ATTACK_USED, DEFENDING_POKEMON_DOES_LESS_DAMAGE } from '../../../game/store/prefabs/prefabs';

export class Sylveon extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = Y;
  public hp: number = 110;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C, C];

  public readonly TAG_TEAM_SUPPORTER_PLAYED_MARKER = 'SYLVEON_CEC_TAG_TEAM_SUPPORTER_PLAYED';

  public attacks = [{
    name: 'Moonblast',
    cost: [Y],
    damage: 30,
    text: 'During your opponent\'s next turn, the Defending Pokémon\'s attacks do 30 less damage (before applying Weakness and Resistance).'
  },
  {
    name: 'Beloved Pulse',
    cost: [Y, C, C],
    damage: 80,
    damageCalculation: '+',
    text: 'If you played a TAG TEAM Supporter card from your hand during this turn, this attack does 80 more damage.'
  }];

  public set: string = 'CEC';
  public setNumber: string = '155';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Sylveon';
  public fullName: string = 'Sylveon CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof TrainerEffect
      && effect.trainerCard instanceof TrainerCard
      && effect.trainerCard.trainerType === TrainerType.SUPPORTER
      && effect.trainerCard.tags.includes(CardTag.TAG_TEAM)) {
      effect.player.marker.addMarker(this.TAG_TEAM_SUPPORTER_PLAYED_MARKER, this);
    }

    // Moonblast
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_DOES_LESS_DAMAGE(store, state, effect, this, 30);
    }

    // Beloved Pulse
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      if (player.marker.hasMarker(this.TAG_TEAM_SUPPORTER_PLAYED_MARKER, this)) {
        effect.damage += 80;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.TAG_TEAM_SUPPORTER_PLAYED_MARKER, this);
    }

    return state;
  }
}
