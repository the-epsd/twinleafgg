import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, StoreLike, State } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, COIN_FLIP_PROMPT } from '../../game/store/prefabs/prefabs';

export class Grimer extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Lure Poison',
      cost: [P],
      damage: 0,
      text: 'Flip a coin. If heads, switch 1 of your opponent\'s Benched Pokémon with the Defending Pokémon. The new Defending Pokémon is now Poisoned.'
    },
    {
      name: 'Sludge Toss',
      cost: [P, C, C],
      damage: 30,
      text: ''
    }
  ];

  public set: string = 'PLF';
  public setNumber: string = '45';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Grimer';
  public fullName: string = 'Grimer PLF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          const hasBench = opponent.bench.some(b => b.cards.length > 0);
          if (!hasBench) {
            return;
          }

          store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), targets => {
            if (targets && targets.length > 0) {
              opponent.switchPokemon(targets[0]);
              opponent.active.addSpecialCondition(SpecialCondition.POISONED);
            }
          });
        }
      });
    }

    return state;
  }
}
