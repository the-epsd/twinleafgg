import { SerializerContext, Serialized, Serializer } from './serializer.interface';
import { CardList } from '../store/state/card-list';
import { Card } from '../store/card/card';
import { GameError } from '../game-error';
import { GameCoreError } from '../game-message';
import { PokemonCardList } from '../store/state/pokemon-card-list';

export class CardListSerializer implements Serializer<CardList> {

  public readonly types = ['CardList', 'PokemonCardList'];
  public readonly classes = [CardList, PokemonCardList];

  constructor() { }

  public serialize(cardList: CardList): Serialized {
    const data: any = { ...cardList };
    let constructorName = 'CardList';

    if (cardList instanceof PokemonCardList) {
      constructorName = 'PokemonCardList';
      if (cardList.tools.length > 0) {
        data.tool = cardList.tools[0].id;
      }
      if (cardList.showAllStageAbilities !== undefined) {
        data.showAllStageAbilities = cardList.showAllStageAbilities;
      }
    }

    return {
      ...data,
      _type: constructorName,
      cards: cardList.cards.map(card => card.id)
    };
  }

  public deserialize(data: Serialized, context: SerializerContext): CardList {
    const instance = data._type === 'PokemonCardList'
      ? new PokemonCardList()
      : new CardList();

    delete (data as any)._type;

    const indexes: number[] = data.cards;
    data.cards = indexes.map(index => this.fromIndex(index, context));

    // Explicitly handle PokemonCardList properties
    if (instance instanceof PokemonCardList) {
      // If a tool is present, add it only to tools, not to cards
      if (data.tool !== undefined) {
        const toolCard = this.fromIndex(data.tool, context);
        instance.tools.push(toolCard);
      }
      instance.showBasicAnimation = data.showBasicAnimation || false;
      instance.triggerEvolutionAnimation = data.triggerEvolutionAnimation || false;
      instance.triggerAttackAnimation = data.triggerAttackAnimation || false;
      // Copy computedHp if present
      if (typeof data.computedHp === 'number') {
        (instance as any).computedHp = data.computedHp;
      }
    }

    return Object.assign(instance, data);
  }

  private fromIndex(index: number, context: SerializerContext): Card {
    const card = context.cards[index];
    if (card === undefined) {
      throw new GameError(GameCoreError.ERROR_SERIALIZER, `Card not found on index '${index}'.`);
    }
    return card;
  }

}
