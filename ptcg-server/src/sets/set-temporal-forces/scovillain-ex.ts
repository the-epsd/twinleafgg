import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SpecialCondition, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, GameError, GameMessage, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { AttackEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class Scovillainex extends PokemonCard {

  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Capsakid';
  public tags = [CardTag.POKEMON_ex];
  public cardType: CardType = G;
  public hp: number = 260;
  public weakness = [{ type: R }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Chili Snapper Bind',
      cost: [C],
      damage: 0,
      text: 'Your opponent\'s Active Pokémon is now Burned. The Defending Pokémon can\'t retreat during your opponent\'s next turn.'
    },
    {
      name: 'Two-Headed Crushing',
      cost: [G, G],
      damage: 140,
      text: 'Discard a random card from your opponent\'s hand. Discard the top card of your opponent\'s deck.'
    }
  ];

  public regulationMark = 'G';
  public set = 'TEF';
  public setNumber: string = '22';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Scovillain ex';
  public fullName: string = 'Scovillain ex TEF';

  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      const specialConditionEffect = new AddSpecialConditionsEffect(effect, [SpecialCondition.BURNED]);
      store.reduceEffect(state, specialConditionEffect);
      opponent.active.marker.addMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof RetreatEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
    }

    if (effect instanceof EndTurnEffect && effect.player.active.marker.hasMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this)) {
      effect.player.active.marker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      if (opponent.hand.cards.length > 0) {
        const randomIndex = Math.floor(Math.random() * opponent.hand.cards.length);
        const randomCard = opponent.hand.cards[randomIndex];
        opponent.hand.moveCardTo(randomCard, opponent.discard);
      }
    }
    return state;
  }
}