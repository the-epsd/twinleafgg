import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, PokemonType, TrainerType } from '../../game/store/card/card-types';
import { GameError, GameLog, GameMessage, Power, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class AntiquePlumeFossil extends TrainerCard {
  public trainerType = TrainerType.ITEM;
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public cardTypez: CardType = CardType.COLORLESS;
  public movedToActiveThisTurn = false;
  public pokemonType = PokemonType.NORMAL;
  public evolvesFrom = '';
  public cardTag = [];
  public tools = [];
  public archetype = [];
  public hp: number = 60;
  public weakness = [];
  public retreat = [];
  public resistance = [];
  public attacks = [];
  public maxTools: number = 1;
  public evolvesTo = [];
  public evolvesToStage = [];

  public powers: Power[] = [{
    name: 'Antique Plume Fossil',
    text: `Play this card as if it were a 60-HP [C] Basic Pokémon. This card can't be affected by any Special Conditions and can't retreat.

At any time during your turn, you may discard this card from play.`,
    useWhenInPlay: true,
    exemptFromAbilityLock: true,
    isFossil: true,
    powerType: PowerType.TRAINER_ABILITY
  }];

  public regulationMark = 'I';
  public set: string = 'WHT';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '79';
  public name: string = 'Antique Plume Fossil';
  public fullName: string = 'Antique Plume Fossil SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: 'Antique Plume Fossil' });

      const cardList = StateUtils.findCardList(state, this);
      cardList.moveCardTo(this, player.discard);
    }

    if (effect instanceof PlayItemEffect && effect.trainerCard === this) {
      const player = effect.player;

      const emptySlots = player.bench.filter(b => b.cards.length === 0);
      if (emptySlots.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      const playPokemonEffect = new PlayPokemonEffect(player, this as PokemonCard, emptySlots[0]);
      store.reduceEffect(state, playPokemonEffect);
    }

    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() === this) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    return state;
  }
}