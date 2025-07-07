import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State } from '../../game';
import { GamePhase } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';

export class Sylveon extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Eevee';
  public cardType: CardType = P;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C];

  public powers = [{
    name: 'Safeguard',
    powerType: PowerType.ABILITY,
    text: 'Prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon ex.'
  }];

  public attacks = [{
    name: 'Magical Shot',
    cost: [P, C, C],
    damage: 100,
    text: ''
  }];

  public set: string = 'PRE';
  public regulationMark = 'H';
  public setNumber = '40';
  public cardImage = 'assets/cardback.png';
  public name: string = 'Sylveon';
  public fullName: string = 'Sylveon PRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      const player = StateUtils.findOwner(state, effect.target);
      const opponent = StateUtils.findOwner(state, effect.source);

      if (player === opponent || pokemonCard !== this || sourceCard === undefined || state.phase !== GamePhase.ATTACK)
        return state;

      if (sourceCard.tags.includes(CardTag.POKEMON_ex) && !IS_ABILITY_BLOCKED(store, state, player, this))
        effect.preventDefault = true;
    }

    return state;
  }
}