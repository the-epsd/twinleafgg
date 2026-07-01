import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DAMAGE_OPPONENT_POKEMON, OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';


export class Morpeko extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 80;
  public weakness = [{ type: F }];
  public retreat = [C];

  public attacks = [{
    name: 'Torment',
    cost: [C],
    damage: 20,
    text: 'Choose 1 of your opponent\'s Active Pokémon\'s attacks. During your opponent\'s next turn, that Pokémon can\'t use that attack.'
  },
  {
    name: 'Spark',
    cost: [L, C],
    damage: 50,
    text: 'This attack also does 20 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'RCL';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '73';
  public name: string = 'Morpeko';
  public fullName: string = 'Morpeko RCL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK(store, state, effect, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 20, targets);
      });
      return state;
    }

    return state;
  }
}