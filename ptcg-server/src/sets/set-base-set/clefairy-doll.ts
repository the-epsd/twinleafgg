import { GameError, GameLog, GameMessage, PokemonCard, PowerType, StateUtils, TrainerCard } from '../../game';
import { CardType, PokemonType, Stage, TrainerType } from '../../game/store/card/card-types';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { KnockOutEffect, PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { State } from '../../game/store/state/state';
import { StoreLike } from '../../game/store/store-like';

export class ClefairyDoll extends TrainerCard {
  public name = 'Clefairy Doll';
  public cardImage: string = 'assets/cardback.png';
  public setNumber = '70';
  public set = 'BS';
  public fullName = 'Clefairy Doll BS';

  public evolvesFrom = '';
  public cardTag = [];
  public tools = [];
  public archetype = [];

  public trainerType = TrainerType.ITEM;

  public hp = 10;
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = C;
  public movedToActiveThisTurn = false;
  public pokemonType = PokemonType.NORMAL;

  public weakness = [];
  public resistance = [];
  public retreat = [];

  public attacks = [];

  public powers = [
    {
      name: 'Clefairy Doll',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      text: 'At any time during your turn before your attack, you may discard Clefairy Doll.'
    }
  ];

  public text = 'Play Clefairy Doll as if it were a Basic Pokémon. While in play, Clefairy Doll counts a a Pokémon (instead of a Trainer card). Clefairy Doll has no attacks, can\'t retreat, and can\'t be Asleep, Confused, Paralyzed, or Poisoned. If Clefairy Doll is Knocked Out, it doesn\'t count as a Knocked Out Pokémon.';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Clefairy Doll can't be affected by special conditions
    if (effect instanceof AddSpecialConditionsEffect && effect.player.active.cards.includes(this)) {
      effect.preventDefault = true;
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const cardList = effect.player.active;
      const player = effect.player;

      store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_IN_HAND, { name: effect.player.name, card: this.name });

      if (player.bench.every(b => b.cards.length === 0)) {
        // technical implementation does not matter exactly because this ends the game
        effect.player.active.moveCardsTo(effect.player.active.cards, player.deck);
      } else {
        player.switchPokemon(cardList);
        const mysteriousFossilCardList = StateUtils.findCardList(state, this);
        mysteriousFossilCardList.moveCardsTo(mysteriousFossilCardList.cards.filter(c => c === this), effect.player.discard);
        mysteriousFossilCardList.moveCardsTo(mysteriousFossilCardList.cards.filter(c => c !== this), effect.player.discard);
      }
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

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount = 0;
      return state;
    }

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    return state;
  }
}
