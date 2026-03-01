import { ChoosePokemonPrompt, GameError, GameMessage, PlayerType, SlotType, State, StoreLike } from '../../game';
import { CardTag, CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { DealDamageEffect, PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class Crobat extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Golbat';
  public tags = [CardTag.DELTA_SPECIES];
  public cardType: CardType = G;
  public additionalCardTypes = [M];
  public hp: number = 90;
  public weakness = [{ type: P }];
  public retreat = [];

  public attacks = [{
    name: 'Radar Jam',
    cost: [C, C],
    damage: 30,
    text: 'Your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand during your opponent\'s next turn.'
  },
  {
    name: 'Target Attack',
    cost: [G, M, C],
    damage: 0,
    text: 'Choose 1 of your opponent\'s Pokémon. This attack does 40 damage to that Pokémon. If that Pokémon already has damage counters on it, this attack does 60 damage instead. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
  }];

  public set: string = 'DS';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '2';
  public name: string = 'Crobat';
  public fullName: string = 'Crobat DS';

  public readonly OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER = 'OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      const opponent = effect.opponent;

      ADD_MARKER(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, opponent, this);
    }

    if (effect instanceof TrainerEffect && effect.trainerCard.trainerType !== TrainerType.SUPPORTER) {
      const player = effect.player;
      if (player.marker.hasMarker(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.OPPONENT_CANNOT_PLAY_TRAINER_CARDS_MARKER, this);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      const targets = opponent.getPokemonInPlay();
      if (targets.length === 0)
        return state;

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
      ), selected => {
        const target = selected[0];
        const damage = target.damage > 0 ? 50 : 30;
        let damageEffect: DealDamageEffect | PutDamageEffect;
        if (target === opponent.active) {
          damageEffect = new DealDamageEffect(effect, damage);
        } else {
          damageEffect = new PutDamageEffect(effect, damage);
        }
        damageEffect.target = target;
        store.reduceEffect(state, damageEffect);
      });
    }

    return state;
  }
}