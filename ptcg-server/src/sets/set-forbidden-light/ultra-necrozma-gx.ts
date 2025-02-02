import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import {
  StoreLike, State, StateUtils, GameError, GameMessage,
  PlayerType,
  EnergyCard
} from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { DiscardCardsEffect, PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';

// FLI Ultra Necrozma-GX 95 (https://limitlesstcg.com/cards/FLI/95)
export class UltraNecrozmaGX extends PokemonCard {

  public tags = [CardTag.POKEMON_GX, CardTag.ULTRA_BEAST];

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.DRAGON;

  public hp: number = 190;

  public weakness = [{ type: CardType.FAIRY }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Photon Geyser',
      cost: [CardType.PSYCHIC, CardType.METAL],
      damage: 20,
      text: 'Discard all basic [P] Energy from this Pokémon. This attack does 80 more damage for each card you discarded in this way.'
    },

    {
      name: 'Sky-Scorching Light-GX',
      cost: [CardType.PSYCHIC, CardType.METAL],
      damage: 0,
      gxAttack: true,
      text: 'You can use this attack only if the total of both players\' remaining Prize cards is 6 or less. Put 6 damage counters on each of your opponent\'s Pokémon. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'FLI';

  public name: string = 'Ultra Necrozma-GX';

  public fullName: string = 'Ultra Necrozma-GX FLI';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '95';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Photon Geyser
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const psychicEnergy = player.active.cards.filter(card =>
        card instanceof EnergyCard && card.name === 'Psychic Energy'
      );

      const discardEnergy = new DiscardCardsEffect(effect, psychicEnergy);
      discardEnergy.target = player.active;
      store.reduceEffect(state, discardEnergy);

      const damageAmount = psychicEnergy.length * 80;
      const damageEffect = new PutDamageEffect(effect, damageAmount);
      damageEffect.target = opponent.active;
      store.reduceEffect(state, damageEffect);
    }
    // Sky Scorching Light-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (player.getPrizeLeft() + opponent.getPrizeLeft() > 6) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      // Check if player has used GX attack
      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      // set GX attack as used for game
      player.usedGX = true;

      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card) => {
        const damageEffect = new PutCountersEffect(effect, 60);
        damageEffect.target = cardList;
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}