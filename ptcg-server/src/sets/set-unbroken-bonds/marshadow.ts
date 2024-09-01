import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, StateUtils, GameError, PokemonCardList } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';

export class Marshadow extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 80;

  public weakness = [{ type: CardType.DARK }];

  public resistance = [{ type: CardType.FIGHTING, value: -20 }];

  public retreat = [CardType.COLORLESS];

  public powers = [
    {
      name: 'Resetting Hole',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn (before your attack), if this Pokémon is on your Bench, you may discard any Stadium card in play. If you do, discard this Pokémon and all cards attached to it.'
    }
  ];

  public attacks = [
    {
      name: 'Red Knuckles',
      cost: [CardType.COLORLESS],
      damage: 10,
      damageCalculation: '+',
      text: 'If your opponent\'s Active Pokémon is an Ultra Beast, this attack does 60 more damage.'
    }
  ];

  public set: string = 'UNB';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '81';

  public name: string = 'Marshadow';

  public fullName: string = 'Marshadow UNB';

  public readonly REFRIGERATED_STREAM_MARKER = 'REFRIGERATED_STREAM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {

      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {

        const cardList = StateUtils.findCardList(state, stadiumCard);
        const player = StateUtils.findOwner(state, cardList);

        if (player.active.cards[0] == this) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        const benchIndex = player.bench.indexOf(cardList as PokemonCardList);
        if (benchIndex === -1) {
          throw new GameError(GameMessage.CANNOT_USE_POWER);
        }

        // Discard Stadium
        cardList.moveTo(player.discard);
        return state;
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentActive = opponent.active.getPokemonCard();
      if (opponentActive && opponentActive.tags.includes(CardTag.ULTRA_BEAST)) {
        effect.damage += 60;
      }
    }

    return state;
  }
}