import { PokemonCard, Stage, CardType, CardTag, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, StateUtils, State, StoreLike, ChooseCardsPrompt, ShuffleDeckPrompt, SuperType, TrainerType, GameError } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class MagnezoneVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Magnezone V';

  public cardType: CardType = CardType.LIGHTNING;

  public tags = [CardTag.POKEMON_VSTAR];

  public hp: number = 270;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Magnetic Grip',
      cost: [CardType.LIGHTNING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 180,
      text: 'Search your deck for up to 2 Item cards, reveal them, and put them into your hand. Then, shuffle your deck.'
    },
    {
      name: 'Splitting Beam',
      cost: [CardType.LIGHTNING, CardType.LIGHTNING],
      damage: 0,
      text: 'This attack does 90 damage to 2 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 VSTAR Power in a game.)'
    }
  ];

  public set: string = 'LOR';

  public regulationMark = 'F';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '57';

  public name: string = 'Magnezone VSTAR';

  public fullName: string = 'Magnezone VSTAR LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        { superType: SuperType.TRAINER, trainerType: TrainerType.ITEM },
        { min: 0, max: 2, allowCancel: true }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.LABEL_VSTAR_USED);
      }

      player.usedVSTAR = true;

      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 2, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 90);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);

      });

      return state;
    }
    return state;
  }
}