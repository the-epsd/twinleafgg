import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PlayerType } from '../../game';
import { AbstractAttackEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { DISCARD_A_STADIUM_CARD_IN_PLAY } from '../../game/store/prefabs/attack-effects';

export class Purugly extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Glameow';
  public cardType: CardType = C;
  public hp: number = 110;
  public weakness = [{ type: F }];
  public retreat = [C, C];

  public readonly OWN_THE_PLACE_MARKER = 'PURUGLY_UPR_OWN_THE_PLACE_MARKER';
  public readonly CLEAR_OWN_THE_PLACE_MARKER = 'PURUGLY_UPR_CLEAR_OWN_THE_PLACE_MARKER';

  public attacks = [
    {
      name: 'Own the Place',
      cost: [C],
      damage: 20,
      text: 'If your opponent has a Stadium card in play, discard it. If you do, prevent all effects of attacks, including damage, done to this Pokémon during your opponent\'s next turn.'
    },
    {
      name: 'Toss Aside',
      cost: [C, C, C],
      damage: 60,
      text: 'Discard random cards from your opponent\'s hand until they have 3 cards in their hand.'
    }
  ];

  public set: string = 'UPR';
  public setNumber: string = '109';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Purugly';
  public fullName: string = 'Purugly UPR';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attack 1: Own the Place
    // Refs: set-burning-shadows/machamp-gx.ts (Bedrock Breaker - discard stadium), set-breakpoint/sigilyph.ts (Reflective Shield - prevent damage with markers)
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const stadiumCard = StateUtils.getStadiumCard(state);
      if (stadiumCard !== undefined) {
        DISCARD_A_STADIUM_CARD_IN_PLAY(state);
        // Successfully discarded - add prevention markers
        player.active.marker.addMarker(this.OWN_THE_PLACE_MARKER, this);
        opponent.marker.addMarker(this.CLEAR_OWN_THE_PLACE_MARKER, this);
      }
    }

    // Prevent all effects of attacks including damage
    // Ref: set-crimson-invasion/regice.ts (Iceberg Shield - AbstractAttackEffect prevention)
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      if (pokemonCard !== this) {
        return state;
      }

      if (!effect.target.marker.hasMarker(this.OWN_THE_PLACE_MARKER, this)) {
        return state;
      }

      const player = StateUtils.findOwner(state, effect.target);
      const attacker = StateUtils.findOwner(state, effect.source);

      if (player === attacker) {
        return state;
      }

      effect.preventDefault = true;
    }

    // Cleanup at end of opponent's turn
    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_OWN_THE_PLACE_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_OWN_THE_PLACE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, cardList => {
        cardList.marker.removeMarker(this.OWN_THE_PLACE_MARKER, this);
      });
    }

    // Attack 2: Toss Aside
    // Ref: set-plasma-storm/giratina.ts (Shadow Claw - random discard from opponent hand)
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      while (opponent.hand.cards.length > 3) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const cardToDiscard = opponent.hand.cards[randomIndex];
        opponent.hand.moveCardTo(cardToDiscard, opponent.discard);
      }
    }

    return state;
  }
}
