import { PokemonCard, Stage, CardType, StoreLike, State, StateUtils, PlayerType, CardTag } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, HealEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class IronMoth extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIRE;
  public hp: number = 120;
  public weakness = [{ type: CardType.WATER }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Suction',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 30,
      text: 'Heal from this Pokémon the same amount of damage you did to your opponent\'s Active Pokémon.'
    },
    {
      name: 'Anachronism Repulsor',
      cost: [CardType.FIRE, CardType.FIRE, CardType.COLORLESS],
      damage: 120,
      text: 'During your next turn, prevent all damage done to this Pokémon by attacks from Ancient Pokémon.'
    }
  ];
  public regulationMark = 'H';
  public set: string = 'SFA';
  public name: string = 'Iron Moth';
  public fullName: string = 'Iron Moth SFA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '9';

  public readonly WILD_REJECTOR_MARKER: string = 'WILD_REJECTOR_MARKER';
  public readonly CLEAR_WILD_REJECTOR_MARKER: string = 'CLEAR_WILD_REJECTOR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      // Absorption
      if (effect.damage > 0) {
        const target = StateUtils.getTarget(state, player, effect.target);
        const healEffect = new HealEffect(player, target, effect.damage);
        state = store.reduceEffect(state, healEffect);
      }
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      player.active.marker.addMarker(this.WILD_REJECTOR_MARKER, this);
      opponent.marker.addMarker(this.CLEAR_WILD_REJECTOR_MARKER, this);
      return state;
    }

    if (effect instanceof PutDamageEffect
      && effect.target.marker.hasMarker(this.WILD_REJECTOR_MARKER)) {
      const card = effect.source.getPokemonCard();
      const ancientPokemon = card && card.tags.includes(CardTag.ANCIENT);

      if (ancientPokemon) {
        effect.preventDefault = true;
      }

      return state;
    }

    if (effect instanceof EndTurnEffect) {
      if (effect.player.marker.hasMarker(this.CLEAR_WILD_REJECTOR_MARKER, this)) {
        effect.player.marker.removeMarker(this.CLEAR_WILD_REJECTOR_MARKER, this);
        const opponent = StateUtils.getOpponent(state, effect.player);
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList) => {
          cardList.marker.removeMarker(this.WILD_REJECTOR_MARKER, this);
        });
      }
    }

    return state;
  }

}
