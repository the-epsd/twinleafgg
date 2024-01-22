import { CardTag, CardType, Stage } from '../../game/store/card/card-types';
import { StoreLike } from '../../game/store/store-like';
import { State } from '../../game/store/state/state';
import { Effect } from '../../game/store/effects/effect';
import { CardTarget, GameError, GameMessage, PlayerType, PokemonCard, PowerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';

export class HisuianZoroarkVSTAR extends PokemonCard {

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Hisuian Zoroark V';

  public tags = [CardTag.POKEMON_VSTAR];

  public regulationMark = 'F';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 270;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Phantom Star',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'During your turn, you may discard your hand and draw 7 cards. (You can\'t use more than 1 VSTAR Power in a game.)'
  }];

  public attacks = [
    {
      name: 'Nightly Raid',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'This attack does 50 damage for each of your Pokémon that has any damage counters on it.'
    }
  ];

  public set: string = 'LOR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '147';

  public name: string = 'Hisuian Zoroark VSTAR';

  public fullName: string = 'Hisuian Zoroark VSTAR LOR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.usedVSTAR === true) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const cards = player.hand.cards.filter(c => c !== this);
      player.hand.moveCardsTo(cards, player.discard);
      player.deck.moveTo(player.hand, 7);
      player.usedVSTAR = true;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      const blocked: CardTarget[] = [];

      const hasBenched = player.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
        if (cardList.damage == 0) {
          return state;
        } else {
          blocked.push(target);
        }
      });

      if (!blocked.length) {
        effect.damage = 0;
      }

      if (blocked.length) {
        // You have damaged benched Pokemon
        effect.damage = blocked.length * 50;

      }

      return state;
    }
    return state;
  }
}


