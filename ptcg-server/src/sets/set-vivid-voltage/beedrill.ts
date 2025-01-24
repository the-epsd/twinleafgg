import { CardType, GameLog, PokemonCard, PowerType, Stage, State, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class BeedrillVIV extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom: string = 'Kakuna';

  public cardType: CardType = CardType.GRASS;

  public hp: number = 130;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [];

  public set = 'VIV';

  public setNumber = '3';

  public cardImage = 'assets/cardback.png';

  public name = 'Beedrill';

  public fullName = 'Beedrill VIV';

  public regulationMark: string = 'D';

  public powers = [
    {
      name: 'Elusive Master',
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, if this Pokemon is the last card in your hand, you may play it onto your Bench. If you do, draw 3 cards.'
    }
  ];

  public attacks = [{ name: 'Sharp Sting', cost: [CardType.GRASS, CardType.COLORLESS], damage: 120, text: '' }];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Elusive Master
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this && effect.target.cards.length === 0) {
      const player = effect.player;
      // Can't bench this Pokemon unless its our last card in our hand.
      if (player.hand.cards.filter(c => c !== this).length !== 0) { return state; }

      // Bench this Pokemon to the desired slot.
      effect.preventDefault = true;  // this might prevent errors from trying to bench a stage 2 idk
      store.log(state, GameLog.LOG_PLAYER_PLAYS_BASIC_POKEMON, { name: player.name, card: this.name });
      player.hand.moveCardTo(this, effect.target);
      effect.target.pokemonPlayedTurn = state.turn;

      // Then, draw 3 cards.
      player.deck.moveTo(player.hand, 3);
      return state;
    }

    return state;
  }
}