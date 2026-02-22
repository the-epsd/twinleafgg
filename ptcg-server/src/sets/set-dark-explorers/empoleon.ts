import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { PowerType, StoreLike, State, StateUtils, GameError, GameMessage, PlayerType, ChooseCardsPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';

import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { DRAW_CARDS, MOVE_CARDS, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class Empoleon extends PokemonCard {

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Prinplup';

  public cardType: CardType = W;

  public hp: number = 140;

  public weakness = [{ type: L }];

  public retreat = [C, C];

  public powers = [{
    name: 'Diving Draw',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard ' +
      'a card from your hand. If you do, draw 2 cards.'
  }];

  public attacks = [
    {
      name: 'Attack Command',
      cost: [W],
      damage: 10,
      text: 'Does 10 damage times the number of Pokémon in play (both yours ' +
        'and your opponent\'s).'
    }
  ];

  public set: string = 'DEX';

  public name: string = 'Empoleon';

  public fullName: string = 'Empoleon DEX';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '29';

  public readonly DIVING_DRAW_MAREKER = 'DIVING_DRAW_MAREKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.DIVING_DRAW_MAREKER, this);
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      if (player.hand.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }
      if (player.marker.hasMarker(this.DIVING_DRAW_MAREKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      state = store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        {},
        { allowCancel: true, min: 1, max: 1 }
      ), cards => {
        cards = cards || [];
        if (cards.length === 0) {
          return;
        }
        player.marker.addMarker(this.DIVING_DRAW_MAREKER, this);
        MOVE_CARDS(store, state, player.hand, player.discard, { cards, sourceCard: this, sourceEffect: this.powers[0] });
        DRAW_CARDS(player, 2);
      });

      return state;
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let pokemonInPlay = 0;
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, () => { pokemonInPlay += 1; });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, () => { pokemonInPlay += 1; });
      effect.damage = 10 * pokemonInPlay;
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.DIVING_DRAW_MAREKER, this)) {
      effect.player.marker.removeMarker(this.DIVING_DRAW_MAREKER, this);
    }

    return state;
  }

}
