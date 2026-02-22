import { ChoosePokemonPrompt, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { AfterDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Murkrow extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = D;
  public hp: number = 50;
  public weakness = [{ type: L, value: +10 }];
  public resistance = [{ type: F, value: -20 }];
  public retreat = [C];

  public powers = [{
    name: 'Dusk Stone',
    text: 'Murkrow can evolve during the turn you play it.',
    powerType: PowerType.HELD_ITEM
  }];

  public attacks = [{
    name: 'Feint Attack',
    cost: [D, C],
    damage: 20,
    shredAttack: true,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 20 damage to that Pokémon. This attack\'s damage isn\'t affected by Weakness, Resistance, Poké-Powers, Poké-Bodies, or any other effects on that Pokémon.'
  }];

  public set: string = 'SW';
  public name: string = 'Murkrow';
  public fullName: string = 'Murkrow SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '95';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.canEvolve = false;
    }

    // if (effect instanceof EvolveEffect && effect.target === this && state.turn === 2) {
    //   const player = effect.player;
    // }
    if (effect instanceof PlayPokemonEffect) {
      const player = effect.player;

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }
      player.canEvolve = true;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.pokemonPlayedTurn = state.turn - 1;
        }
      });
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        target.damage += 20;
        const afterDamage = new AfterDamageEffect(effect, 30);
        state = store.reduceEffect(state, afterDamage);
      });
    }

    return state;
  }
}
