
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { GameError, GameMessage, StateUtils } from '../..';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ADD_MARKER, HAS_MARKER, REMOVE_MARKER, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Walrein extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Sealeo';
  public cardType: CardType = W;
  public hp: number = 170;
  public weakness = [{ type: M }];
  public retreat = [C, C, C];

  public attacks = [
    {
      name: 'Frigid Fangs',
      cost: [W],
      damage: 60,
      text: 'During your opponent\'s next turn, Pokémon that have 2 or less Energy attached can\'t attack. (This includes new Pokémon that come into play.)'
    },
    {
      name: 'Megaton Fall',
      cost: [W, W],
      damage: 170,
      text: 'This Pokémon also does 50 damage to itself.'
    }
  ];

  public set: string = 'SSP';
  public regulationMark = 'H';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Walrein';
  public fullName: string = 'Walrein SSP';

  public readonly FRIGID_FANGS_MARKER = 'FRIGID_FANGS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      ADD_MARKER(this.FRIGID_FANGS_MARKER, opponent, this);
    }

    if (effect instanceof AttackEffect) {
      if (HAS_MARKER(this.FRIGID_FANGS_MARKER, effect.player, this)) {
        const checkProvidedEnergyEffect = new CheckProvidedEnergyEffect(effect.player);
        store.reduceEffect(state, checkProvidedEnergyEffect);
        const energyCount = checkProvidedEnergyEffect.energyMap
          .reduce((left, p) => left + p.provides.length, 0);

        if (energyCount <= 2) {
          throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
        }
      }
    }

    if (effect instanceof EndTurnEffect) {
      if (HAS_MARKER(this.FRIGID_FANGS_MARKER, effect.player, this)) {
        REMOVE_MARKER(this.FRIGID_FANGS_MARKER, effect.player, this);
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 50);
    }
    return state;
  }
}