import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCardList, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

function* useSwirlingPetals(next: Function, store: StoreLike, state: State, effect: AttackEffect): IterableIterator<State> {
  const player = effect.player;
  const opponent = StateUtils.getOpponent(state, player);

  const benchCount = opponent.bench.reduce((sum, b) => {
    return sum + (b.cards.length > 0 ? 1 : 0);
  }, 0);

  if (benchCount > 0) {

    return store.prompt(state, new ChoosePokemonPrompt(
      player.id,
      GameMessage.CHOOSE_POKEMON_TO_SWITCH,
      PlayerType.TOP_PLAYER,
      [SlotType.BENCH],
      { allowCancel: false }
    ), targets => {
      if (!targets || targets.length === 0) {
        return;
      }
      opponent.active.clearEffects();
      opponent.switchPokemon(targets[0]);
      next();

      const hasBench = player.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      let target: PokemonCardList[] = [];
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), results => {
        target = results || [];
        next();

        if (target.length === 0) {
          return state;
        }

        // Discard trainer only when user selected a Pokemon
        player.active.clearEffects();
        player.switchPokemon(target[0]);
        return state;
      });
    });
  }
}


export class Floette extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = Y;
  public hp: number = 70;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [C];
  public evolvesFrom = 'Flabébé';

  public attacks = [{
    name: 'Swirling Petals',
    cost: [Y],
    damage: 0,
    text: 'Switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon. If you do, switch this Pokémon with 1 of your Benched Pokémon.'
  }];

  public set: string = 'FLI';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Floette';
  public fullName: string = 'Floette FLI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const generator = useSwirlingPetals(() => generator.next(), store, state, effect);
      return generator.next().value;
    }

    return state;
  }
}