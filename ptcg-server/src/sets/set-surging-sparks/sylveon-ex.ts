import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, ShuffleDeckPrompt, SlotType, State, StateUtils, StoreLike } from '../..';

import { Effect } from '../../game/store/effects/effect';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Sylveonex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;

  public evolvesFrom = 'Eevee';

  public tags = [CardTag.POKEMON_ex, CardTag.POKEMON_TERA];

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 270;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Magical Charm',
      cost: [CardType.PSYCHIC, CardType.COLORLESS, CardType.COLORLESS],
      damage: 160,
      text: 'During your opponent\'s next turn, the Defending Pokemon\'s attacks do 100 less damage (before applying Weakness and Resistance).'
    },
    {
      name: 'Angelite',
      cost: [CardType.WATER, CardType.LIGHTNING, CardType.PSYCHIC],
      damage: 0,
      text: 'Choose 2 of your opponent\'s Benched Pokémon. They shuffle those Pokémon and all attached cards into their deck. If 1 of your Pokémon used Angelite during your last turn, this attack can\'t be used.'
    }
  ];

  public set: string = 'SSP';

  public regulationMark = 'H';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '86';

  public name: string = 'Sylveon ex';

  public fullName: string = 'Sylveon ex SSP';

  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';

  public readonly ANGELITE_MARKER = 'ANGELITE_MARKER';
  public readonly CLEAR_ANGELITE_MARKER = 'CLEAR_ANGELITE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect
      && effect.player.marker.hasMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
      effect.player.marker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      const opponent = StateUtils.getOpponent(state, effect.player);
      opponent.active.marker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.CLEAR_ANGELITE_MARKER, this)) {
      effect.player.marker.removeMarker(this.ANGELITE_MARKER, this);
      effect.player.marker.removeMarker(this.CLEAR_ANGELITE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ANGELITE_MARKER, this)) {
      effect.player.marker.addMarker(this.CLEAR_ANGELITE_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      opponent.active.marker.addMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this);
    }

    if (effect instanceof DealDamageEffect && effect.source.marker.hasMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER, this)) {
      effect.damage -= 100;
      return state;
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const hasBench = opponent.bench.some(b => b.cards.length > 0);

      if (hasBench === false) {
        return state;
      }

      if (effect.player.marker.hasMarker(this.ANGELITE_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ANGELITE_MARKER, this);

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH],
        { min: 1, max: 2, allowCancel: false },
      ), selected => {
        const targets = selected || [];
        player.marker.addMarker(this.ANGELITE_MARKER, this);

        targets.forEach(target => {
          target.clearEffects();
          target.damage = 0;
          target.moveTo(opponent.deck);

          return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
            opponent.deck.applyOrder(order);
          });
        });
      });
    }

    if (effect instanceof PutDamageEffect && effect.target.cards.includes(this) && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      effect.preventDefault = true;
    }
    return state;
  }

}

