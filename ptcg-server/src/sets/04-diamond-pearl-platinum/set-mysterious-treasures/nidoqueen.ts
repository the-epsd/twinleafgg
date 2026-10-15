import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { PowerType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { CheckAttackCostEffect } from '../../../game/store/effects/check-effects';
import { IS_POKEBODY_BLOCKED, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

const MOTHER_PHEROMONE_NAMES = [
  'Nidoran ♀',
  'Nidoran \u2640',
  'Nidorina',
  'Nidoran ♂',
  'Nidoran \u2642',
  'Nidorino',
  'Nidoking',
];

export class Nidoqueen extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Nidorina';
  public hp: number = 120;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +30 }];
  public resistance = [{ type: L, value: -20 }];
  public retreat = [C, C];

  public powers = [{
    name: 'Mother Pheromone',
    powerType: PowerType.POKEBODY,
    text: 'The attack cost of your Nidoran ♀, Nidorina, Nidoran ♂, Nidorino, and Nidoking\'s attacks is Colorless less.'
  }];

  public attacks = [{
    name: 'Give Aid',
    cost: [P, P, C],
    damage: 90,
    text: 'If you have the same number of or less Benched Pokémon than your opponent, this attack\'s base damage is 50 instead of 90.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '31';
  public name: string = 'Nidoqueen';
  public fullName: string = 'Nidoqueen MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Mother Pheromone
    if (effect instanceof CheckAttackCostEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player || !StateUtils.isPokemonInPlay(owner, this)) {
        return state;
      }

      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }

      const attackingPokemon = player.active.getPokemonCard();
      if (!attackingPokemon || !MOTHER_PHEROMONE_NAMES.includes(attackingPokemon.name)) {
        return state;
      }

      const index = effect.cost.indexOf(CardType.COLORLESS);
      if (index !== -1) {
        effect.cost.splice(index, 1);
      }
    }

    // Give Aid
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const playerBench = player.bench.filter(b => b.cards.length > 0).length;
      const opponentBench = opponent.bench.filter(b => b.cards.length > 0).length;

      if (playerBench <= opponentBench) {
        effect.damage = 50;
      }
    }

    return state;
  }
}
