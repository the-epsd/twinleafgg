import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, StateUtils, ChoosePokemonPrompt, PlayerType, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED, DISCARD_ALL_ENERGY_FROM_POKEMON, DAMAGE_OPPONENT_POKEMON } from '../../game/store/prefabs/prefabs';

export class Dartrix extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Rowlet';
  public cardType: CardType = G;
  public hp: number = 100;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Leafage',
    cost: [G],
    damage: 10,
    text: ''
  },
  {
    name: 'Phaser Shot',
    cost: [C, C, C],
    damage: 0,
    text: 'Discard all Energy attached to this Pokemon. Choose 1 of your opponent\'s Pokemon. This attack does 90 damage to that Pokemon. (Don\'t apply Weakness and Resistance for Benched Pokemon.)'
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '11';
  public name: string = 'Dartrix';
  public fullName: string = 'Dartrix M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Discard all energy from this Pokemon
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);

      // Check if opponent has any Pokemon
      const hasPokemon = opponent.active.cards.length > 0 ||
        opponent.bench.some(b => b.cards.length > 0);

      if (!hasPokemon) {
        return state;
      }

      // Prompt to choose 1 opponent Pokemon (active or bench)
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 90, targets);
      });
    }
    return state;
  }
}
