import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import {
  StoreLike, State, PlayerType,
  PokemonCardList,
  Card,
  ChoosePrizePrompt,
  ConfirmPrompt,
  GameMessage,
  GameError
} from '../../game';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';


export class Cresselia extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 120;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -30 }];

  public retreat = [CardType.COLORLESS];

  public attacks = [
    {
      name: 'Healing Pirouette',
      cost: [CardType.PSYCHIC],
      damage: 0,
      text: 'Heal 20 damage from each of your Pokémon.'
    },
    {
      name: 'Crescent Purge',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.PSYCHIC],
      damage: 80,
      damageCalculation: '+',
      text: 'You may turn of your face-down Prize cards face up. If you do, this attack does 80 more damage. (That Prize card remains face up for the rest of the game.)'
    }
  ];

  public set: string = 'SFA';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '21';

  public name: string = 'Cresselia';

  public fullName: string = 'Cresselia SFA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList: PokemonCardList) => {
        const healEffect = new HealEffect(player, cardList, 20);
        state = store.reduceEffect(state, healEffect);
        return state;
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const prizes = player.prizes.filter(p => p.isSecret);
      const cards: Card[] = [];
      prizes.forEach(p => { p.cards.forEach(c => cards.push(c)); });

      if (prizes.length > 0) {
        state = store.prompt(state, new ConfirmPrompt(
          effect.player.id,
          GameMessage.WANT_TO_USE_ABILITY,
        ), wantToUse => {
          if (wantToUse) {

            state = store.prompt(state, new ChoosePrizePrompt(
              player.id,
              GameMessage.CHOOSE_POKEMON,
              { count: 1, allowCancel: true },
            ), chosenPrize => {
              const prizeCard = chosenPrize[0];

              if (prizeCard.faceUpPrize == true) {
                throw new GameError(GameMessage.CANNOT_USE_POWER);
              }

              if (chosenPrize === null || chosenPrize.length === 0) {
                return state;
              }

              // prizeCard.isSecret = false;
              // prizeCard.isPublic = true;
              prizeCard.faceUpPrize = true;
              effect.damage += 80;
            });
          }
        });
      }
    }
    return state;
  }
}