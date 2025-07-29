import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { DAMAGE_OPPONENT_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Dewgong extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = W;
  public hp: number = 120;
  public weakness = [{ type: M }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Tail Whap',
    cost: [C, C],
    damage: 60,
    text: ''
  },
  {
    name: 'Dual Blizzard',
    cost: [C, C, C],
    damage: 0,
    text: 'Discard 2 Energy from this Pokémon. This attack does 60 damage to 2 of your opponent\'s Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'UNB';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '45';
  public name: string = 'Dewgong';
  public fullName: string = 'Dewgong UNB';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 2);

      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      // Count all Pokémon in play (active + bench with cards)
      const opponentTargets = [opponent.active, ...opponent.bench].filter(p => p.cards.length > 0);
      const numTargets = opponentTargets.length;
      const minMax = numTargets >= 2 ? 2 : 1;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: minMax, max: minMax, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        DAMAGE_OPPONENT_POKEMON(store, state, effect, 60, targets);
      });
    }

    return state;
  }
}