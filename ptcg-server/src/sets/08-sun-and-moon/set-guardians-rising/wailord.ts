import { CardType, PlayerType, PokemonCard, Stage, State, StoreLike, pokemonHasCardType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { HealEffect } from '../../../game/store/effects/game-effects';
import { COIN_FLIP_PROMPT, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { PREVENT_DAMAGE, PREVENT_EFFECTS_OF_ATTACKS } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Wailord extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Wailmer';
  public cardType: CardType[] = [W];
  public hp: number = 200;
  public weakness = [{ type: G }];
  public retreat = [C, C, C, C];

  public attacks = [{
    name: 'Dive',
    cost: [W, W, C],
    damage: 40,
    text: 'Flip a coin. If heads, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
  }, {
    name: 'Open Sea',
    cost: [W, W, W, C],
    damage: 80,
    text: 'Heal 30 damage from each of your Water Pokémon.'
  }];

  public set: string = 'GRI';
  public setNumber: string = '30';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Wailord';
  public fullName: string = 'Wailord GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Dive
    if (WAS_ATTACK_USED(effect, 0, this)) {
      COIN_FLIP_PROMPT(store, state, effect.player, result => {
        if (result) {
          PREVENT_DAMAGE(store, state, effect, this);
          PREVENT_EFFECTS_OF_ATTACKS(store, state, effect, this);
        }
      });
    }

    // Open Sea
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        const pokemonCard = cardList.getPokemonCard();
        if (pokemonCard && pokemonHasCardType(pokemonCard, CardType.WATER) && cardList.damage > 0) {
          store.reduceEffect(state, new HealEffect(player, cardList, 30));
        }
      });
    }

    return state;
  }
}
