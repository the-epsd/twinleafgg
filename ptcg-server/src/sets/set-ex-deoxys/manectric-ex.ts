import { PokemonCard } from '../../game/store/card/pokemon-card';
import { CardType, Stage, TrainerType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, GameError, StateUtils, PokemonCardList, Card } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { TrainerEffect } from '../../game/store/effects/play-card-effects';
import { ADD_MARKER, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { DiscardCardsEffect } from '../../game/store/effects/attack-effects';
import { THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON } from '../../game/store/prefabs/attack-effects';

export class Manectricex extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = L;
  public hp: number = 100;
  public weakness = [{ type: F }];
  public resistance = [{ type: M, value: -30 }];
  public retreat = [C];

  public attacks = [{
    name: 'Disconnect',
    cost: [L, C],
    damage: 40,
    text: 'Your opponent can\'t play any Trainer cards (except for Supporter cards) from his or her hand during your opponent\'s next turn.',
  },
  {
    name: 'Mega Shot',
    cost: [L, L, C],
    damage: 0,
    text: 'Discard all [L] Energy attached to Manectric ex and then choose 1 of your opponent\'s Pokémon. This attack does 80 damage to that Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)',
  }];

  public set: string = 'DX';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '101';
  public name: string = 'Manectric ex';
  public fullName: string = 'Manectric ex DX';

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
      // Discard all [L]
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      if (!(cardList instanceof PokemonCardList))
        throw new GameError(GameMessage.INVALID_TARGET);

      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      state = store.reduceEffect(state, checkProvidedEnergy);

      // Only discard cards that provide LIGHTNING or ANY energy
      const cards: Card[] = checkProvidedEnergy.energyMap
        .filter(e => e.provides.includes(CardType.LIGHTNING) || e.provides.includes(CardType.ANY))
        .map(e => e.card);

      const discardEnergy = new DiscardCardsEffect(effect, cards);
      discardEnergy.target = cardList;
      store.reduceEffect(state, discardEnergy);

      // Deal damage to opponent's Pokémon
      THIS_ATTACK_DOES_X_DAMAGE_TO_1_OF_YOUR_OPPONENTS_POKEMON(80, effect, store, state);
    }

    return state;
  }
}