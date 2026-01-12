import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardTag } from '../../game/store/card/card-types';
import { Effect } from '../../game/store/effects/game-effects';
import { State, StateUtils, StoreLike } from '../../game';
import { MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MegaHeracrossex extends PokemonCard {
  public stage = Stage.BASIC;
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType = G;
  public hp = 280;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Juggernaut Horn',
    cost: [G, G],
    damage: 100,
    damageCalculation: '+',
    text: 'If this Pokémon was damaged by an attack during your opponent\'s last turn, this attack does that much more damage.'
  },
  {
    name: 'Mountain Ramming',
    cost: [G, G, G],
    damage: 170,
    text: 'Discard the top 2 cards of your opponent\'s deck.'
  }];

  public set: string = 'PFL';
  public regulationMark = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Mega Heracross ex';
  public fullName: string = 'Mega Heracross ex PFL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const activeCard = effect.player.active.getPokemonCard();
      if (activeCard !== undefined && activeCard.damageTakenLastTurn !== undefined) {
        effect.damage += activeCard.damageTakenLastTurn;
      }
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 2, sourceCard: this, sourceEffect: this.attacks[1] });
    }

    return state;
  }
}