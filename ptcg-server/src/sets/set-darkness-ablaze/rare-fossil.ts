import { CardType, GameError, GameLog, GameMessage, PokemonCard, PokemonType, Power, PowerType, Stage, State, StateUtils, StoreLike, TrainerCard, TrainerType } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class RareFossil extends TrainerCard {

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

  public hp: number = 70;

  public weakness = [];

  public retreat = [];

  public resistance = [];

  public attacks = [];

  public set: string = 'DAA';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '167';

  public name: string = 'Rare Fossil';

  public fullName: string = 'Rare Fossil DAA';

  public regulationMark = 'D';

  public powers: Power[] = [
    {
      name: 'Rare Fossil',
      text: 'At any time during your turn, you may discard this card from play.',
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.ABILITY
    }
  ];

  public text =
    'Play this card as if it were a 70-HP Basic [C] Pokémon. At any time during your turn, you may discard this card from play. This card can\'t be affected by any Special Conditions, and it can\'t retreat.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AddSpecialConditionsEffect && effect.player.active.cards.includes(this)) {
      effect.preventDefault = true;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      store.log(state, GameLog.LOG_PLAYER_DISCARDS_CARD, { name: player.name, card: this.name, effect: 'Rare Fossil' });

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

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    return state;
  }

}
