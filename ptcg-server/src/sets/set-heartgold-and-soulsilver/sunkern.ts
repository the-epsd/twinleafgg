import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, PokemonCardList, ChoosePokemonPrompt, PlayerType, SlotType, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { HealEffect } from '../../game/store/effects/game-effects';

export class Sunkern extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 40;
  public weakness = [{ type: R }];
  public resistance = [{ type: W, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Cure Kernels',
    cost: [C],
    damage: 0,
    text: 'Remove 2 damage counters from 1 of your Pokémon.'
  },
  {
    name: 'Seed Bomb',
    cost: [G, C],
    damage: 20,
    text: ''
  }];

  public set: string = 'HS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Sunkern';
  public fullName: string = 'Sunkern HS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;

      const blocked: CardTarget[] = [];
      let hasPokemonWithDamage: boolean = false;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage === 0) {
          blocked.push(target);
        } else {
          hasPokemonWithDamage = true;
        }
      });

      if (hasPokemonWithDamage === false) {
        return state;
      }

      let targets: PokemonCardList[] = [];
      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_HEAL,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false, blocked }
      ), results => {
        targets = results || [];
        if (targets.length === 0) {
          return state;
        }

        targets.forEach(target => {
          // Heal Pokemon
          const healEffect = new HealEffect(player, target, 20);
          store.reduceEffect(state, healEffect);
        });
      });
    }

    return state;
  }
}
