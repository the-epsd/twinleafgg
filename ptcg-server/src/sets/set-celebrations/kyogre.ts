import { CardType, EnergyType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardList } from '../../game/store/state/card-list';
import { ChoosePokemonPrompt, EnergyCard, GameMessage, PlayerType, PokemonCard, SlotType, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Kyogre extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'E';

  public cardType: CardType = CardType.WATER;

  public hp: number = 130;

  public weakness = [{ type: CardType.LIGHTNING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Aqua Storm',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS],
      damage: 0,
      text: 'Discard the top 5 cards of your deck, and then choose 2 of your opponent\'s Benched Pokémon. This attack does 50 damage for each Energy card you discarded in this way to each of those Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    },
    {
      name: 'Surf',
      cost: [CardType.WATER, CardType.WATER, CardType.COLORLESS, CardType.COLORLESS],
      damage: 120,
      text: ''
    }
  ];

  public set: string = 'CEL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '3';

  public name: string = 'Kyogre';

  public fullName: string = 'Kyogre CEL';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        return state;
      }

      const deckTop = new CardList();

      // Move top 5 cards from deckTop
      player.deck.moveTo(deckTop, 5);

      // Filter for Basic Energy cards
      const basicEnergy = deckTop.cards.filter(c =>
        c instanceof EnergyCard &&
        c.energyType === EnergyType.BASIC
      );

      // Move all cards to discard
      deckTop.moveTo(player.discard, deckTop.cards.length);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 2, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += basicEnergy.length * 50;
        });
        return state;
      });
    }
    return state;
  }
}
