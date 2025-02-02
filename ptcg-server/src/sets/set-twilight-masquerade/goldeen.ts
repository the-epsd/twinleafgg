import { CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { Card, ChooseCardsPrompt, CoinFlipPrompt, EnergyCard, GameMessage, PokemonCard, PowerType, State, StateUtils, StoreLike } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';

export class Goldeen extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public regulationMark = 'H';

  public cardType: CardType = W;

  public hp: number = 50;

  public weakness = [{ type: L }];

  public retreat = [C];

  public canAttackTwice: boolean = false;

  public powers = [{
    name: 'Festival Lead',
    powerType: PowerType.ABILITY,
    text: 'If Festival Grounds is in play, this Pokémon may use an attack it has twice. If the first attack Knocks Out your opponent\'s Active Pokémon, you may attack again after your opponent chooses a new Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Whirlpool',
      cost: [C, C],
      damage: 60,
      text: 'Flip a coin. If heads, discard an Energy from your opponent\'s Active Pokémon.'
    }
  ];

  public set: string = 'TWM';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '44';

  public name: string = 'Goldeen';

  public fullName: string = 'Goldeen TWM';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const stadiumCard = StateUtils.getStadiumCard(state);

      // Defending Pokemon has no energy cards attached
      if (!opponent.active.cards.some(c => c instanceof EnergyCard)) {
        return state;
      }

      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {

          let card: Card;
          return store.prompt(state, new ChooseCardsPrompt(
            player,
            GameMessage.CHOOSE_CARD_TO_DISCARD,
            opponent.active,
            { superType: SuperType.ENERGY },
            { min: 1, max: 1, allowCancel: false }
          ), selected => {
            card = selected[0];

            opponent.active.moveCardTo(card, opponent.discard);
          });
        }
      });

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

      // Check if 'Festival Plaza' stadium is in play
      if (stadiumCard && stadiumCard.name === 'Festival Grounds') {
        this.canAttackTwice = true;
      } else {
        this.canAttackTwice = false;
      }

      // Increment attacksThisTurn
      player.active.attacksThisTurn = (player.active.attacksThisTurn || 0) + 1;

    }
    return state;
  }
}
