import { CardType, ChooseCardsPrompt, GameMessage, PokemonCard, Stage, State, StoreLike, SuperType, TrainerCard, TrainerType } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { DEFENDING_POKEMON_CANNOT_ATTACK } from '../../../game/store/prefabs/effect-of-attack-prefabs';
import { MOVE_CARDS, SHOW_CARDS_TO_PLAYER, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Spiritomb extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public hp: number = 70;
  public cardType: CardType[] = [P];
  public retreat = [C];

  public attacks = [{
    name: 'Lightless World',
    cost: [C],
    damage: 0,
    text: 'Put 2 Supporter cards from your discard pile into your hand.',
  },
  {
    name: 'Terrify',
    cost: [C],
    damage: 10,
    text: 'If the Defending Pokémon is a Basic Pokémon, it can\'t attack during your opponent\'s next turn.',
  }];

  public set: string = 'UPR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '53';
  public name: string = 'Spiritomb';
  public fullName: string = 'Spiritomb UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Lightless World
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = effect.opponent;
      const hasSupporter = player.discard.cards.some(
        (c) => c instanceof TrainerCard && c.trainerType === TrainerType.SUPPORTER,
      );

      if (!hasSupporter) {
        return state;
      }

      store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.discard,
        { superType: SuperType.TRAINER, trainerType: TrainerType.SUPPORTER },
        { min: 0, max: 2, allowCancel: true }
      ), selected => {
        const cards = selected || [];
        if (cards.length > 0) {
          MOVE_CARDS(store, state, player.discard, player.hand, { cards, sourceCard: this });
          SHOW_CARDS_TO_PLAYER(store, state, opponent, cards);
        }
      });
    }

    // Terrify
    if (WAS_ATTACK_USED(effect, 1, this)) {
      if (effect.opponent.active.getPokemonCard()?.stage === Stage.BASIC) {
        return DEFENDING_POKEMON_CANNOT_ATTACK(store, state, effect, this);
      }
    }

    return state;
  }
}
