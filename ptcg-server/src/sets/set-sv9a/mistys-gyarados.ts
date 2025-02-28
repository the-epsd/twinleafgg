import { Attack, CardList, CardTag, CardType, PokemonCard, Stage, State, StoreLike, Weakness } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class MistysGyarados extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Misty\'s Magikarp';
  public tags: string[] = [CardTag.MISTYS];
  public cardType: CardType = W;
  public hp: number = 180;
  public weakness: Weakness[] = [{ type: L }];
  public retreat: CardType[] = [C, C, C, C];

  public attacks: Attack[] = [
    {
      name: 'Splashing Panic',
      cost: [W],
      damage: 70,
      damageCalculation: 'x',
      text: 'Discard the top 7 cards of your deck. This attack does 70 damage times the amount of Misty\'s Pokémon you find there.',
    },
    { name: 'Waterfall', cost: [W, C, C], damage: 120, text: '' },
  ];

  public set: string = 'SV9a';
  public regulationMark: string = 'I';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '26';
  public name: string = 'Misty\'s Gyarados';
  public fullName: string = 'Misty\'s Gyarados SV9a';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const deckTop = new CardList();
      player.deck.moveTo(deckTop, 7);

      const mistysPokemon = deckTop.cards.filter(c => c.tags.includes(CardTag.MISTYS) && c instanceof PokemonCard);

      effect.damage = 70 * mistysPokemon.length;
      deckTop.moveTo(player.discard, deckTop.cards.length);
    }

    return state;
  }
}