import { Attack, CardType, PokemonCard, Power, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';
import { CONFIRMATION_PROMPT, IS_POKEPOWER_BLOCKED, JUST_EVOLVED, SEARCH_DECK_FOR_CARDS_TO_HAND, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Persian extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Meowth';
  public cardType: CardType = C;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public powers: Power[] = [
    {
      name: 'Prowl',
      powerType: PowerType.POKEPOWER,
      useWhenInPlay: false,
      text: 'Once during your turn, when you play Persian from your hand to evolve 1 of your Pokémon, you may search your deck for any 1 card and put it into your hand. Shuffle your deck afterward.'
    }
  ];

  public attacks: Attack[] = [
    {
      name: 'Snap Tail',
      cost: [C, C],
      damage: 0,
      text: 'Choose 1 of your opponent\'s Pokémon. This attack does 30 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
  ];

  public set: string = 'DS';
  public setNumber: string = '50';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Persian';
  public fullName: string = 'Persian DS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Prowl
    if (JUST_EVOLVED(effect, this) && !IS_POKEPOWER_BLOCKED(store, state, effect.player, this)) {
      if (CONFIRMATION_PROMPT(store, state, effect.player, result => {
        if (result) {
          const player = effect.player;
          SEARCH_DECK_FOR_CARDS_TO_HAND(store, state, player, this, {}, { min: 1, max: 1 }, this.powers[0]);
        }
      }))
        return state;
    }

    // Snap Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(30, effect, store, state);
    }
    return state;
  }
}