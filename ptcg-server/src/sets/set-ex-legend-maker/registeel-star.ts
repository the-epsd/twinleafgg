import { CardTag, CardType, DamageMap, GameMessage, GamePhase, PlayerType, PokemonCard, PutDamagePrompt, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { AddMarkerEffect, PutCountersEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class RegisteelStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR];
  public cardType: CardType = M;
  public hp: number = 90;
  public weakness = [{ type: R }];
  public resistance = [{ type: G, value: -30 }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Barrier Attack',
    cost: [M],
    damage: 30,
    text: 'During your opponent\'s next turn, any damage done to Registeel Star by attacks is reduced by 10 (after applying Weakness and Resistance).'
  },
  {
    name: 'Final Laser',
    cost: [M, M, C],
    damage: 70,
    text: 'Put 3 damage counters on your opponent\'s Pokémon in any way you like. If your opponent has only 1 Prize card left and Registeel Star is the only Pokémon you have in play, put 6 damage counters instead.'
  }];

  public set: string = 'LM';
  public setNumber: string = '92';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Registeel Star';
  public fullName: string = 'Registeel Star LM';

  public readonly BARRIER_ATTACK_MARKER = 'BARRIER_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Flame Screen
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const addMarkerEffect = new AddMarkerEffect(effect, this.BARRIER_ATTACK_MARKER, this);
      return store.reduceEffect(state, addMarkerEffect);
    }

    if (effect instanceof PutDamageEffect
      && effect.source.marker.hasMarker(this.BARRIER_ATTACK_MARKER, this)) {

      // It's not an attack
      if (state.phase !== GamePhase.ATTACK) {
        return state;
      }

      effect.damage -= 10;
      return state;
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.active.marker.removeMarker(this.BARRIER_ATTACK_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      let damage = 30;

      const playerBench = player.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);
      if (playerBench === 0 && opponent.getPrizeLeft() === 1) {
        damage = 60;
      }

      const maxAllowedDamage: DamageMap[] = [];
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
        maxAllowedDamage.push({ target, damage: card.hp + damage });
      });

      return store.prompt(state, new PutDamagePrompt(
        effect.player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        damage,
        maxAllowedDamage,
        { allowCancel: false }
      ), targets => {
        const results = targets || [];
        for (const result of results) {
          const target = StateUtils.getTarget(state, player, result.target);
          const putCountersEffect = new PutCountersEffect(effect, result.damage);
          putCountersEffect.target = target;
          store.reduceEffect(state, putCountersEffect);
        }
      });
    }

    return state;
  }
}