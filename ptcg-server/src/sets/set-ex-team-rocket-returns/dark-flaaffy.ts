import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class DarkFlaaffy extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Mareep';
  public tags = [CardTag.DARK];
  public cardType: CardType = L;
  public additionalCardTypes = [D];
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Thunder Slash',
    cost: [C],
    damage: 10,
    text: 'If the Defending Pokémon is a Basic Pokémon, the Defending Pokémon is now Paralyzed. Dark Flaaffy can\'t use Thunder Slash during your next turn.'
  },
  {
    name: 'Headbutt',
    cost: [L, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'TRR';
  public setNumber: string = '33';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Dark Flaaffy';
  public fullName: string = 'Dark Flaaffy TRR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Handle Thunder Slash attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const defendingPokemon = opponent.active.getPokemonCard();

      if (!player.active.cannotUseAttacksNextTurnPending.includes('Thunder Slash')) {
        player.active.cannotUseAttacksNextTurnPending.push('Thunder Slash');
      }

      // Check if defending Pokémon is Basic
      if (defendingPokemon && defendingPokemon.stage === Stage.BASIC) {
        const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.PARALYZED]);
        store.reduceEffect(state, specialConditionEffect);
      }
    }

    return state;
  }
} 