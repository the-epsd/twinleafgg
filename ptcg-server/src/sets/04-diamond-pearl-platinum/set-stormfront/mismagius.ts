import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, TrainerType } from '../../../game/store/card/card-types';
import { CardList, ChooseCardsPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike, TrainerCard } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { MOVE_CARDS, MOVE_POKEMON_OFF_BOARD, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Mismagius extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Misdreavus';
  public hp: number = 80;
  public cardType: CardType[] = [P];
  public weakness = [{ type: D, value: +20 }];
  public resistance = [{ type: C, value: -20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Crash Chant',
    cost: [],
    damage: 20,
    damageCalculation: 'x',
    text: 'Choose up to 4 in any combination of Pokémon Tool cards and Technical Machine cards in play (both yours and your opponent\'s) and discard them. This attack does 20 damage times the number of cards discarded in this way.'
  },
  {
    name: 'Horror Chant',
    cost: [P, C],
    damage: 40,
    text: 'If your opponent has 4 or more Benched Pokémon, choose 1 of them and return that Pokémon and all cards attached to it to your opponent\'s hand.'
  }];

  public set: string = 'SF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '7';
  public name: string = 'Mismagius';
  public fullName: string = 'Mismagius SF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Crash Chant
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const toolPool = new CardList();
      const toolOwners: { card: TrainerCard; owner: typeof player; list: typeof player.active }[] = [];

      const collectFrom = (owner: typeof player, perspective: PlayerType) => {
        owner.forEachPokemon(perspective, (cardList) => {
          cardList.tools.forEach(tool => {
            if (tool instanceof TrainerCard && tool.trainerType === TrainerType.TOOL) {
              toolPool.cards.push(tool);
              toolOwners.push({ card: tool, owner, list: cardList });
            }
          });
        });
      };
      collectFrom(player, PlayerType.BOTTOM_PLAYER);
      collectFrom(opponent, PlayerType.TOP_PLAYER);

      if (toolPool.cards.length === 0) {
        effect.damage = 0;
        return state;
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        toolPool,
        { trainerType: TrainerType.TOOL },
        { min: 0, max: Math.min(4, toolPool.cards.length), allowCancel: false },
      ), selected => {
        const cards = selected || [];
        effect.damage = 20 * cards.length;
        cards.forEach(card => {
          const match = toolOwners.find(entry => entry.card === card);
          if (match) {
            MOVE_CARDS(store, state, match.list, match.owner.discard, { cards: [card], sourceCard: this });
          }
        });
      });
    }

    // Horror Chant
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const benched = opponent.bench.filter(b => b.cards.length > 0);
      if (benched.length < 4) {
        return state;
      }
      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 1, allowCancel: false },
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        MOVE_POKEMON_OFF_BOARD(store, state, targets[0], {
          pokemonDestination: opponent.hand,
          sourceCard: this,
        });
      });
    }

    return state;
  }
}
