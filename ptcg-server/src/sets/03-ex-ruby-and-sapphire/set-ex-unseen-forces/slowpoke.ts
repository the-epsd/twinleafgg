import { CardType, ChooseCardsPrompt, EnergyCard, EnergyType, GameMessage, PokemonCard, Stage, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { COIN_FLIP_PROMPT, MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Slowpoke extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 50;
  public cardType: CardType[] = [P];
  public weakness = [{ type: P }];
  public retreat = [C];

  public attacks = [{
    name: 'Fishing Tail',
    cost: [C],
    damage: 0,
    text: 'Search your discard pile for a Basic Pokémon, Evolution card, or basic Energy card, show it to your opponent, and put it into your hand.',
  },
  {
    name: 'Trip Over',
    cost: [C, C],
    damage: 20,
    damageCalculation: '+',
    text: 'Flip a coin. If heads, this attack does 20 damage plus 10 more damage.',
  }];

  public set: string = 'UF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '72';
  public name: string = 'Slowpoke';
  public fullName: string = 'Slowpoke UF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fishing Tail
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let pokemons = 0;
      let energies = 0;
      const blocked: number[] = [];
      player.discard.cards.forEach((c, index) => {
        if (c instanceof EnergyCard && c.energyType === EnergyType.BASIC) {
          energies += 1;
        } else if (c instanceof PokemonCard) {
          pokemons += 1;
        } else {
          blocked.push(index);
        }
      });

      if (pokemons === 0 && energies === 0) {
        return state;
      }

      const maxPokemons = Math.min(pokemons, 1);
      const maxEnergies = Math.min(energies, 1);

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        {},
        { min: 0, max: 1, allowCancel: false, blocked, maxPokemons, maxEnergies }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.discard, player.hand, { cards });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
      });
    }

    // Trip Over
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      return COIN_FLIP_PROMPT(store, state, player, result => {
        if (result) {
          effect.damage += 10;
        }
      });
    }

    return state;
  }
}
