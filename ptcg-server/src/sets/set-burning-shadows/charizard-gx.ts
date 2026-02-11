import { State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { WAS_ATTACK_USED, DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON, DISCARD_TOP_X_OF_OPPONENTS_DECK, BLOCK_IF_GX_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class CharizardGX extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Charmeleon';
  public tags = [CardTag.POKEMON_GX];
  public cardType: CardType = R;
  public hp: number = 250;
  public weakness = [{ type: W }];
  public resistance = [];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Wing Attack',
      cost: [C, C, C],
      damage: 70,
      text: ''
    },
    {
      name: 'Crimson Storm',
      cost: [R, R, R, C, C],
      damage: 300,
      text: 'Discard 3 [R] Energy from this Pokémon.'
    },
    {
      name: 'Raging Out-GX',
      cost: [R, C, C],
      damage: 0,
      text: 'Discard the top 10 cards of your opponent\'s deck. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'BUS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '20';
  public name: string = 'Charizard-GX';
  public fullName: string = 'Charizard-GX BUS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crimson Storm: Discard 3 [R] energy from this Pokémon
    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_SPECIFIC_ENERGY_FROM_THIS_POKEMON(store, state, effect, [CardType.FIRE, CardType.FIRE, CardType.FIRE]);
    }
    
    // Raging Out-GX: mill opponent 10, no damage
    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;
      DISCARD_TOP_X_OF_OPPONENTS_DECK(store, state, effect.player, 10, this, this.attacks[2]);
    }

    return state;
  }
}