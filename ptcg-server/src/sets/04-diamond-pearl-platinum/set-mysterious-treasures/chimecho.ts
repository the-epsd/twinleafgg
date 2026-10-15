import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage } from '../../../game/store/card/card-types';
import { State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, DRAW_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Chimecho extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Call In',
    cost: [C],
    damage: 0,
    text: 'Draw a card. If Chingling is anywhere under Chimecho, draw 2 more cards.'
  },
  {
    name: 'Strange Bell',
    cost: [P],
    damage: 20,
    text: 'If the Defending Pokémon is a Basic Pokémon, that Pokémon is now Confused.'
  }];

  public set: string = 'MT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '22';
  public name: string = 'Chimecho';
  public fullName: string = 'Chimecho MT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Call In
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      DRAW_CARDS(store, state, player, 1);
      const hasChingling = player.active.cards.some(
        c => c instanceof PokemonCard && c.name === 'Chingling'
      );
      if (hasChingling) {
        DRAW_CARDS(store, state, player, 2);
      }
    }

    // Strange Bell
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = StateUtils.getOpponent(state, effect.player);
      const defending = opponent.active.getPokemonCard();
      if (defending && defending.stage === Stage.BASIC) {
        ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, opponent, this);
      }
    }

    return state;
  }
}
