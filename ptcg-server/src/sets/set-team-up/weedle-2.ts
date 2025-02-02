import { CardType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class WeedleTEU2 extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 50;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [CardType.COLORLESS];

  public set = 'TEU';

  public setNumber = '2';

  public cardImage = 'assets/cardback.png';

  public name = 'Weedle';

  public fullName = 'Weedle TEU 2';

  public attacks = [
    {
      name: 'Tangle Drag',
      cost: [CardType.GRASS],
      damage: 0,
      text: 'Switch 1 of your opponent\'s Benched Pokemon with their Active Pokemon.'
    },
    { name: 'Bug Bite', cost: [CardType.GRASS], damage: 10, text: '' }
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Tangle Drag
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (!hasBench) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_SWITCH,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { allowCancel: false }
      ), result => {
        const cardList = result[0];
        opponent.switchPokemon(cardList);
      });
    }

    return state;
  }
}