import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Clefairy extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = P;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public retreat = [C];

  public attacks = [{
    name: 'Follow Me',
    cost: [P],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon.'
  },
  {
    name: 'Flop',
    cost: [P, P],
    damage: 30,
    text: ''
  }];

  public regulationMark = 'J';
  public set: string = 'M3';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '29';
  public name: string = 'Clefairy';
  public fullName: string = 'Clefairy M3';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Follow Me - Switch opponent's Benched with Active
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Check if opponent has benched Pokemon
      const hasBench = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBench) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        const targets = selected || [];
        if (targets.length > 0) {
          opponent.active.clearEffects();
          opponent.switchPokemon(targets[0]);
        }
      });
    }

    return state;
  }
}
