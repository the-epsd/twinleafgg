import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardTag, CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, DamageMap, PlayerType, PutDamagePrompt, SlotType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckHpEffect } from '../../game/store/effects/check-effects';
import { PutCountersEffect } from '../../game/store/effects/attack-effects';
import { PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Dragoniteex extends PokemonCard {
  public stage: Stage = Stage.STAGE_2;
  public evolvesFrom: string = 'Dragonair';
  public tags = [CardTag.POKEMON_ex, CardTag.DELTA_SPECIES];
  public cardType: CardType = G;
  public hp: number = 150;
  public retreat = [C, C];

  public attacks = [{
    name: 'Deafen',
    cost: [C, C],
    damage: 40,
    text: 'Your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand during your opponent\'s next turn.',
  },
  {
    name: 'Dragon Roar',
    cost: [G, G, C, C],
    damage: 0,
    text: 'Put 8 damage counters on the Defending Pokémon. If that Pokémon would be Knocked Out by this attack, put any damage counters not necessary to Knock Out the Defending Pokémon on your opponent\'s Benched Pokémon in any way you like.',
  }];

  public set: string = 'DF';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '91';
  public name: string = 'Dragonite ex';
  public fullName: string = 'Dragonite ex DF';

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
      const opponent = effect.opponent;
      const defending = opponent.active;

      // Check current HP and current damage on the defending Pokémon
      const checkHpEffect = new CheckHpEffect(opponent, defending);
      store.reduceEffect(state, checkHpEffect);

      // Calculate total damage already on the defending Pokémon
      const currentDamage = defending.damage;

      // If the Pokémon would be Knocked Out by this attack, only put enough to KO
      const damageToKO = Math.max(0, checkHpEffect.hp - currentDamage);
      const damageToPlace = Math.min(80, damageToKO);

      // Place damage counters on the Defending Pokémon
      if (damageToPlace > 0) {
        PUT_X_DAMAGE_COUNTERS_ON_YOUR_OPPONENTS_ACTIVE_POKEMON(damageToPlace / 10, store, state, effect);
      }

      // Put the rest wherever you want
      const remainingDamage = 80 - damageToPlace;
      if (remainingDamage > 0) {
        const opponentBench = opponent.bench.reduce((left, b) => left + (b.cards.length ? 1 : 0), 0);

        if (opponentBench === 0) {
          return state;
        }

        const maxAllowedDamage: DamageMap[] = [];
        opponent.forEachPokemon(PlayerType.TOP_PLAYER, (cardList, card, target) => {
          maxAllowedDamage.push({ target, damage: card.hp + (cardList.damage || 0) });
        });

        return store.prompt(state, new PutDamagePrompt(
          effect.player.id,
          GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
          PlayerType.TOP_PLAYER,
          [SlotType.BENCH],
          remainingDamage,
          maxAllowedDamage,
          { allowCancel: false }
        ), targets => {
          const results = targets || [];
          const player = effect.player;
          for (const result of results) {
            const target = StateUtils.getTarget(state, player, result.target);
            const putCountersEffect = new PutCountersEffect(effect, result.damage);
            putCountersEffect.target = target;
            store.reduceEffect(state, putCountersEffect);
          }
        });
      }
    }

    return state;
  }
}