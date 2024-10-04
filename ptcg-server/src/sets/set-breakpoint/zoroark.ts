import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType } from '../../game/store/card/pokemon-types';
import { StoreLike, State, StateUtils, PokemonCardList, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class Zoroark extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public cardType: CardType = CardType.DARK;
  public evolvesFrom: string = 'Zorua';
  public hp: number = 100;
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Stand In',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), if this Pokemon is on your Bench, you may switch this Pokemon with your Active Pokemon.'
  }];

  public attacks = [{
    name: 'Mind Jack',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 10,
    text: 'This attack does 30 more damage for each of your opponent\'s Benched Pokémon.'
  }];

  public set: string = 'BKT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Zoroark';
  public fullName: string = 'Zoroark BKT';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      if (player.active.cards[0] == this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Index of this Zoroark on bench
      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);

      player.active.clearEffects();
      player.switchPokemon(player.bench[benchIndex]); // Switching this Zoroark with Active

      return state;

    }

    if(effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const opponentBenched = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

      effect.damage += 30 * opponentBenched;
    }

    return state;
  }
}