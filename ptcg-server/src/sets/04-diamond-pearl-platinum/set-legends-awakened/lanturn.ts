import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, Stage, SuperType } from '../../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AFTER_ATTACK, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';
import { YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED } from '../../../game/store/prefabs/attack-effects';

export class Lanturn extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Chinchou';
  public hp: number = 90;
  public cardType: CardType[] = [W];
  public weakness = [{ type: G, value: +20 }];
  public retreat = [C];

  public attacks = [{
    name: 'Rushing Water',
    cost: [C, C],
    damage: 20,
    text: 'Move an Energy card attached to the Defending Pokémon to another of your opponent\'s Pokémon.'
  },
  {
    name: 'Confuse Ray',
    cost: [W, L],
    damage: 40,
    text: 'The Defending Pokémon is now Confused.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '58';
  public name: string = 'Lanturn';
  public fullName: string = 'Lanturn LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Rushing Water
    if (AFTER_ATTACK(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasEnergy = opponent.active.cards.some(c => c.superType === SuperType.ENERGY);
      const hasOtherPokemon = opponent.bench.some(b => b.cards.length > 0);
      if (!hasEnergy || !hasOtherPokemon) {
        return state;
      }
      const blocked: number[] = [];
      opponent.active.cards.forEach((card, index) => {
        if (card.superType !== SuperType.ENERGY) {
          blocked.push(index);
        }
      });
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_ATTACH,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false, blocked },
      ), selected => {
        const cards: Card[] = selected || [];
        if (cards.length === 0) {
          return;
        }
        return store.prompt(state, new ChoosePokemonPrompt(
          player.id,
          GameMessage.CHOOSE_POKEMON_TO_ATTACH_CARDS,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          { min: 1, max: 1, allowCancel: false },
        ), targets => {
          if (targets && targets.length > 0) {
            MOVE_CARDS(store, state, opponent.active, targets[0], { cards: [cards[0]], sourceCard: this });
          }
        });
      });
    }

    // Confuse Ray
    if (WAS_ATTACK_USED(effect, 1, this)) {
      YOUR_OPPPONENTS_ACTIVE_POKEMON_IS_NOW_CONFUSED(store, state, effect);
    }

    return state;
  }
}
