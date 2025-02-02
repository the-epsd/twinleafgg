import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils, CoinFlipPrompt, PlayerType, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import {CheckProvidedEnergyEffect} from '../../game/store/effects/check-effects';

export class TogepiCleffaIgglybuffGX extends PokemonCard {
  public tags = [CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = Y;
  public hp: number = 240;
  public weakness = [{ type: M }];
  public resistance = [{ type: D, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Rolling Panic',
      cost: [Y, Y, C],
      damage: 120,
      damageCalculation: '+',
      text: 'Flip a coin until you get tails. This attack does 30 more damage for each heads.'
    },
    {
      name: 'Supreme Puff-GX',
      cost: [Y, Y],
      damage: 0,
      gxAttack: true,
      text: 'Take another turn after this one. (Skip the between-turns step.) If this Pokémon has at least 14 extra [Y] Energy attached to it (in addition to this attack\'s cost), your opponent shuffles all of their Benched Pokémon and all cards attached to them into their deck. (You can\'t use more than 1 GX attack in a game.)'
    }
  ];

  public set: string = 'CEC';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '143';
  public name: string = 'Togepi & Cleffa & Igglybuff-GX';
  public fullName: string = 'Togepi & Cleffa & Igglybuff-GX CEC';

  public readonly SUPREME_PUFF_MARKER = 'SUPREME_PUFF_MARKER';
  public readonly SUPREME_PUFF_MARKER_2 = 'SUPREME_PUFF_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // turn skipping shenanegains (thanks for dialga-gx)
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SUPREME_PUFF_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.SUPREME_PUFF_MARKER, this);
      effect.player.marker.removeMarker(this.SUPREME_PUFF_MARKER_2, this);
      effect.player.usedTurnSkip = false;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SUPREME_PUFF_MARKER, this)) {
      effect.player.marker.addMarker(this.SUPREME_PUFF_MARKER_2, this);
    }

    // Rolling Panic
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      let heads = 0;

      store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          heads++;
          return this.reduceEffect(store, state, effect);
        }
      });

      effect.damage += heads * 30;
    }

    // Supreme Puff-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;

      if (player.usedGX === true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }

      player.usedGX = true;
      player.marker.addMarker(this.SUPREME_PUFF_MARKER, this);
      effect.player.usedTurnSkip = true;

      // Check for the extra energy cost.
      const extraEffectCost: CardType[] = [Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y, Y];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (!meetsExtraEffectCost) { return state; }  // If we don't have the extra energy, we just deal damage.

      const opponent = StateUtils.getOpponent(state, player);

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card !== opponent.active.getPokemonCard()){
          cardList.moveTo(opponent.deck);
        }
      });
      store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
        opponent.deck.applyOrder(order);
      });
    }

    return state;
  }
}
