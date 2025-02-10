import { Attack, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StoreLike, Weakness } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { HealEffect } from "../../game/store/effects/game-effects";
import { WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class Mantyke extends PokemonCard {

  public stage: Stage = Stage.BASIC;
  public cardType: CardType = W;
  public hp: number = 30;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [];

  public attacks: Attack[] = [
    { name: 'Buoyant Healing', cost: [], damage: 0, text: 'Heal 120 damage from 1 of your Benched Pokémon.' },
  ];

  public set: string = 'PAR';
  public regulationMark: string = 'G';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '39';
  public name: string = 'Mantyke';
  public fullName: string = 'Mantyke PAR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        {},
      ), (results) => {
        const targets = results || [];
        for (const target of targets) {
          const healEffect = new HealEffect(player, target, 120);
          return store.reduceEffect(state, healEffect);
        }
      });
    }

    return state;
  }
}