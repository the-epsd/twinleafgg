import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, BoardEffect } from '../../game/store/card/card-types';
import { StoreLike, State, ChooseCardsPrompt, PowerType, GameError, PlayerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class Gholdengoex extends PokemonCard {

  public regulationMark = 'G';

  public tags = [CardTag.POKEMON_ex];

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Gimmighoul';

  public cardType: CardType = CardType.METAL;

  public hp: number = 260;

  public weakness = [{ type: CardType.FIRE }];

  public resistance = [{ type: CardType.GRASS, value: -30 }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Coin Bonus',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may draw 1 card. If this ' +
      'Pokémon is in the Active Spot, draw 2 cards instead. '
  }];

  public attacks = [
    {
      name: 'Make It Rain',
      cost: [CardType.METAL],
      damage: 0,
      text: 'Discard any number of Basic Energy cards from your ' +
        'hand. This attack does 50 damage for each card discarded ' +
        'in this way.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '139';

  public name: string = 'Gholdengo ex';

  public fullName: string = 'Gholdengo ex PAR';

  public readonly MAKE_IT_RAIN_MARKER = 'MAKE_IT_RAIN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.MAKE_IT_RAIN_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.MAKE_IT_RAIN_MARKER, this);
    }


    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.MAKE_IT_RAIN_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      const isActive = player.active.getPokemonCard() === this;

      if (isActive) {
        player.deck.moveTo(player.hand, 2);
      } else {
        player.deck.moveTo(player.hand, 1);
      }

      player.marker.addMarker(this.MAKE_IT_RAIN_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addBoardEffect(BoardEffect.ABILITY_USED);
        }
      });
    }


    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      const player = effect.player;

      // Prompt player to choose cards to discard 
      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY },
        { allowCancel: false, min: 0 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        const discardEnergy = new DiscardCardsEffect(effect, cards);
        discardEnergy.target = player.active;
        store.reduceEffect(state, discardEnergy);
        player.hand.moveCardsTo(cards, player.discard);

        // Calculate damage
        const damage = cards.length * 50;
        effect.damage = damage;
        return state;
      });
    }

    return state;
  }
}
