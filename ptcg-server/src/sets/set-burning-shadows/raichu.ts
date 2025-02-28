import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { ADD_PARALYZED_TO_PLAYER_ACTIVE, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, JUST_EVOLVED, THIS_POKEMON_DOES_DAMAGE_TO_ITSELF, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Raichu extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Pikachu';
  public cardType: CardType = L;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -20 }];
  public retreat = [C];

  public powers: Power[] = [
    {
      name: 'Evoshock',
      powerType: PowerType.ABILITY,
      text: 'When you play this Pokémon from your hand to evolve 1 of your Pokémon during your turn, ' +
        'you may leave your opponent\'s Active Pokémon Paralyzed.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Volt Tackle',
      cost: [L, L, C],
      damage: 130,
      text: 'This Pokémon does 30 damage to itself.'
    },
  ];

  public set: string = 'BUS';
  public setNumber: string = '41';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Raichu';
  public fullName: string = 'Raichu BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (JUST_EVOLVED(effect, this) && !IS_ABILITY_BLOCKED(store, state, effect.player, this))
      if (CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result)
          ADD_PARALYZED_TO_PLAYER_ACTIVE(store, state, StateUtils.getOpponent(state, effect.player), this);
      }))
        if (WAS_ATTACK_USED(effect, 0, this))
          THIS_POKEMON_DOES_DAMAGE_TO_ITSELF(store, state, effect, 30);
    return state;
  }
}