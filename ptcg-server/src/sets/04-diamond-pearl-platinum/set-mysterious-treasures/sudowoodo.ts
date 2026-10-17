import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN } from '../../../game/store/prefabs/effect-of-attack-prefabs';

export class Sudowoodo extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 80;
  public cardType: CardType[] = [F];
  public weakness = [{ type: W }];
  public retreat = [C];

  public attacks = [{
    name: 'Sidestep',
    cost: [C],
    damage: 20,
    text: 'If Bonsly is anywhere under Sudowoodo, flip a coin. If heads, prevent all effects of an attack, including damage, done to Sudowoodo during your opponent\'s next turn.'
  }, {
    name: 'Persuade',
    cost: [F, F],
    damage: 30,
    text: 'Your opponent switches the Defending Pokémon with 1 of his or her Benched Pokémon. The new Defending Pokémon can\'t retreat during your opponent\'s next turn.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '35';
  public name: string = 'Sudowoodo';
  public fullName: string = 'Sudowoodo MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Sidestep
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const hasBonsly = effect.player.active.getPokemons().some(p => p.name === 'Bonsly');
      if (hasBonsly) {
        return FLIP_COIN_TO_PREVENT_DAMAGE_AND_EFFECTS_DURING_OPPONENTS_NEXT_TURN(store, state, effect, this);
      }
    }

    // Persuade — opponent switches, then new Active can't retreat
    if (AFTER_ATTACK(effect, 1, this)) {
      const opponent = effect.opponent;
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        opponent.id,
        GameMessage.CHOOSE_NEW_ACTIVE_POKEMON,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), selected => {
        if (!selected || selected.length === 0) {
          return;
        }
        opponent.switchPokemon(selected[0], store, state);
        opponent.active.cannotRetreatNextTurn = true;
      });
    }

    return state;
  }
}
