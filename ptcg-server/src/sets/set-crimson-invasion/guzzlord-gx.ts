
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, GamePhase, CardList, EnergyCard } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect } from '../../game/store/effects/game-effects';
import { BLOCK_IF_GX_ATTACK_USED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class GuzzlordGX extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.DARK;
  public hp: number = 210;
  public tags = [CardTag.ULTRA_BEAST, CardTag.POKEMON_GX];
  public weakness = [{ type: CardType.FIGHTING }];
  public resistance = [{ type: CardType.PSYCHIC, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [{
    name: 'Eat Sloppily',
    cost: [D],
    damage: 0,
    text: 'Discard the top 5 cards of your deck. If any of those cards are Energy cards, attach them to this Pokémon.'
  },
  {
    name: 'Tyrannical Hole',
    cost: [D, D, D, C, C],
    damage: 180,
    text: ''
  },
  {
    name: 'Glutton-GX',
    cost: [D, D, D, D, D],
    damage: 100,
    text: 'If your opponent\'s Pokémon is Knocked Out by damage from this attack, take 2 more Prize cards. (You can\'t use more than 1 GX attack in a game.)'
  }];

  public set: string = 'CIN';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '63';
  public name: string = 'Guzzlord-GX';
  public fullName: string = 'Guzzlord-GX CIN';

  private usedGluttonGX = false;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const temp = new CardList();
      player.deck.moveTo(temp, 5);
      const energyCards = temp.cards.filter(c => c instanceof EnergyCard);
      temp.moveCardsTo(energyCards, player.active);
      temp.moveTo(player.discard);
      return state;
    }

    if (WAS_ATTACK_USED(effect, 2, this)) {
      const player = effect.player;
      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;
      this.usedGluttonGX = true;
    }

    if (effect instanceof KnockOutEffect && effect.target === effect.player.active) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Do not activate between turns, or when it's not opponents turn.
      if (state.phase !== GamePhase.ATTACK || state.players[state.activePlayer] !== opponent) {
        return state;
      }

      // Guzzy wasn't attacking
      const pokemonCard = opponent.active.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      // Check if the attack that caused the KnockOutEffect is "Red Banquet"
      if (this.usedGluttonGX === true) {
        if (effect.prizeCount > 0) {
          effect.prizeCount += 2;
        }
        this.usedGluttonGX = false;
      }

      return state;
    }
    return state;
  }
}