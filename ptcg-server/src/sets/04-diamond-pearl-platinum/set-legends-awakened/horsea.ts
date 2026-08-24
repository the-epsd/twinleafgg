import { PokemonCard, Stage, CardType, StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType } from "../../../game";
import { Effect } from "../../../game/store/effects/effect";
import { DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK } from "../../../game/store/prefabs/effect-of-attack-prefabs";
import { AFTER_ATTACK, WAS_ATTACK_USED } from "../../../game/store/prefabs/prefabs";

export class Horsea extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType = W;
  public weakness = [{ type: L }];
  public retreat = [C];

  public attacks = [{
    name: 'Smokescreen',
    cost: [C],
    damage: 0,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  },
  {
    name: 'Reverse Thrust',
    cost: [W],
    damage: 10,
    text: 'Switch Horsea with 1 of your Benched Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '102';
  public name: string = 'Horsea';
  public fullName: string = 'Horsea LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Smokescreen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      return DEFENDING_POKEMON_FLIPS_COIN_TO_ATTACK(store, state, effect, this);
    }

    // Reverse Thrust
    if (AFTER_ATTACK(effect, 1, this)) {
      const player = effect.player;
      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: true },
      ), selected => {
        if (!selected || selected.length === 0) {
          return state;
        }
        const target = selected[0];
        player.switchPokemon(target);
      });
    }

    return state;
  }
}
