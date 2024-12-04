import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, BoardEffect } from '../../game/store/card/card-types';
import { CoinFlipPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Dragonite extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom = 'Dragonair';
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 100;
  public resistance = [{ type: CardType.FIGHTING, value: -30 }];
  public retreat = [CardType.COLORLESS];

  public powers = [{
    name: 'Step In',
    useWhenInPlay: true,
    powerType: PowerType.POKEPOWER,
    text: 'Once during your turn (before your attack), if Dragonite is on your Bench, you may switch it with your Active Pokémon.'
  }];

  public attacks = [{
    name: 'Slam',
    cost: [C, C, C, C],
    damage: 40,
    damageCalculation: 'x',
    text: 'Flip 2 coins. This attack does 40 damage times the number of heads.'
  }];

  public set: string = 'FO';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '4';
  public name: string = 'Dragonite';
  public fullName: string = 'Dragonite FO';

  public readonly STEP_IN_MARKER = 'STEP_IN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);

      if (player.active.cards[0] == this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      // Index of this Dragonite on bench
      const benchIndex = player.bench.indexOf(cardList as PokemonCardList);

      player.active.clearEffects();
      player.switchPokemon(player.bench[benchIndex]); // Switching this Dragonite with Active

      player.marker.addMarker(this.STEP_IN_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });

      return state;

    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.STEP_IN_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP),
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], results => {
        let heads: number = 0;
        results.forEach(r => { heads += r ? 1 : 0; });
        effect.damage = 40 * heads;
      });
      return state;
    }



    return state;
  }
}