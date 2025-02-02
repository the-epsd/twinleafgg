import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, Card, ChooseCardsPrompt, GameMessage, PowerType, StateUtils, GameError } from '../../game'; import { AttackEffect, PowerEffect, UseAttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';

// CEC Ultra Necrozma 164 (https://limitlesstcg.com/cards/CEC/164)
export class UltraNecrozma extends PokemonCard {

  public tags = [CardTag.ULTRA_BEAST]; // idk is this how you indicate that the pokemon is an ultra beast?

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 110;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [
    {
      name: 'Ultra Burst',
      powerType: PowerType.ABILITY,
      text: 'This Pokémon can\'t attack unless your opponent has 2 or fewer Prize cards remaining.'
    }
  ];

  public attacks = [
    {
      name: 'Luster of Downfall',
      cost: [CardType.PSYCHIC, CardType.METAL],
      damage: 170,
      text: 'Discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'CEC';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '164';

  public name: string = 'Ultra Necrozma';

  public fullName: string = 'Ultra Necrozma CEC';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // check to see if the opponent has less than 3 prize cards before allowing an attack
    // (Ultra Burst)
    if (effect instanceof UseAttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }

      if (opponent.getPrizeLeft() > 2) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    // Luster of Downfall
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const activeCardList = opponent.active;
      const activePokemonCard = activeCardList.getPokemonCard();

      let hasPokemonWithEnergy = false;

      if (activePokemonCard && activeCardList.cards.some(c => c.superType === SuperType.ENERGY)) {
        hasPokemonWithEnergy = true;
      }

      if (!hasPokemonWithEnergy) {
        return state;
      }

      let cards: Card[] = [];
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        opponent.active,
        { superType: SuperType.ENERGY },
        { min: 1, max: 1, allowCancel: false },
      ), selected => {
        cards = selected || [];
      });
      const discardEnergy = new DiscardCardsEffect(effect, cards);
      return store.reduceEffect(state, discardEnergy);
    }

    return state;
  }

}