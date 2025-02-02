import { GameMessage, PlayerType, SlotType, StateUtils } from '../..';
import { CardType, Stage } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Attack, Power } from '../../game/store/card/pokemon-types';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { ChoosePokemonPrompt } from '../../game/store/prompts/choose-pokemon-prompt';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class Ninetales extends PokemonCard {

  public set = 'BS';

  public name: string = 'Ninetales';

  public evolvesFrom = 'Vulpix';

  public fullName = 'Ninetales BS';

  public stage: Stage = Stage.STAGE_1;

  public cardType: CardType = CardType.FIRE;

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '12';

  public hp: number = 80;

  public weakness = [{ type: CardType.WATER }];

  public retreat: CardType[] = [CardType.COLORLESS];

  public powers: Power[] = [];

  public attacks: Attack[] = [{
    name: 'Lure',
    damage: 0,
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    text: 'If your opponent has any Benched Pokémon, choose 1 of them and switch it with his or her Active Pokémon.'
  }, {
    name: 'Fire Blast',
    cost: [CardType.FIRE, CardType.FIRE, CardType.FIRE, CardType.FIRE],
    damage: 80,
    text: 'Discard 1 {R} Energy card attached to Ninetales in order to use this attack.'
  }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      if (opponent.bench.some(b => b.cards.length > 0)) {
        return store.prompt(state, new ChoosePokemonPrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_SWITCH,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
        ), ([bench]) => {
          opponent.switchPokemon(bench);
        });
      }

    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      DISCARD_X_ENERGY_FROM_THIS_POKEMON(state, effect, store, CardType.FIRE, 1);
    }

    return state;

  }

}