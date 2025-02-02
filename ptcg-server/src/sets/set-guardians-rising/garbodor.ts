import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, ChooseCardsPrompt, Card, SuperType, EnergyCard, CoinFlipPrompt, GameMessage, TrainerCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

// GRI Garbodor 51 (https://limitlesstcg.com/cards/GRI/51)
export class Garbodor extends PokemonCard {

  public tags = [];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Trubbish';

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.PSYCHIC }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Trashalanche',
      cost: [CardType.PSYCHIC],
      damage: 20,
      text: 'This attack does 20 damage for each Item card in your opponent\'s discard pile.'
    },

    {
      name: 'Acid Spray',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 70,
      text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'GRI';

  public setNumber = '51';

  public cardImage = 'assets/cardback.png';

  public name: string = 'Garbodor';

  public fullName: string = 'Garbodor GRI';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Trashalanche
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      let opponentItems = 0;
      opponent.discard.cards.forEach(c => {
        if (c instanceof TrainerCard && c.trainerType === TrainerType.ITEM) {
          opponentItems += 1;
        }
      });

      effect.damage = opponentItems * 20;
    }

    // Acid Spray
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
        const player = effect.player;
        const opponent = StateUtils.getOpponent(state, player);

        return store.prompt(state, new CoinFlipPrompt(
          player.id, GameMessage.COIN_FLIP
        ), flipResult => {
          if (flipResult) {
            // Defending Pokemon has no energy cards attached
            if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
              return state;
            }
            let cards: Card[] = [];
            return store.prompt(state, new ChooseCardsPrompt(
              player,
              GameMessage.CHOOSE_CARD_TO_DISCARD,
              opponent.active,
              { superType: SuperType.ENERGY },
              { min: 1, max: 1, allowCancel: false }
            ), selected => {
              cards = selected || [];
              const discardEnergy = new DiscardCardsEffect(effect, cards);
              return store.reduceEffect(state, discardEnergy);
            });
          }
        });
      }
    }
    return state;
  }
}