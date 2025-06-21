import { TrainerCard, TrainerType, Stage, CardType, PokemonType, Power, PowerType, StoreLike, State, GameLog, StateUtils, GameError, GameMessage, PokemonCard } from '../../game';
import { AddSpecialConditionsEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { PowerEffect, RetreatEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class MysteriousFossil extends TrainerCard {

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

  public hp: number = 50;
  public weakness = [];
  public retreat = [];
  public resistance = [];
  public attacks = [];
  public attacksThisTurn: number = 0;
  public maxAttacksThisTurn: number = 1;
  public allowSubsequentAttackChoice: boolean = false;

  public set: string = 'PK';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '85';
  public name: string = 'Mysterious Fossil';
  public fullName: string = 'Mysterious Fossil PK';

  public powers: Power[] = [
    {
      name: 'Mysterious Fossil',
      text: 'Play Mysterious Fossil as if it were a Basic Pokémon. While in play, Mysterious Fossil counts as a Pokémon (instead of a Trainer card). Mysterious Fossil has no attacks, can\'t retreat, and can\'t be Asleep, Confused, Paralyzed, or Poisoned. If Mysterious Fossil is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. (Discard it anyway.) At any time during your turn before your attack, you may discard Mysterious Fossil from play.',
      useWhenInPlay: true,
      exemptFromAbilityLock: true,
      powerType: PowerType.TRAINER_ABILITY
    }
  ];

  // public text =
  //   'Play Mysterious Fossil as if it were a Basic Pokémon. While in play, Mysterious Fossil counts as a Pokémon (instead of a Trainer card). Mysterious Fossil has no attacks, can\'t retreat, and can\'t be Asleep, Confused, Paralyzed, or Poisoned. If Mysterious Fossil is Knocked Out, it doesn\'t count as a Knocked Out Pokémon. (Discard it anyway.)';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

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

    if (effect instanceof KnockOutEffect && effect.target.getPokemonCard() === this) {
      effect.prizeCount = 0;
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

    if (effect instanceof AddSpecialConditionsEffect && effect.target.getPokemonCard() === this) {
      effect.preventDefault = true;
    }

    if (effect instanceof KnockOutEffect && effect.player.active.getPokemonCard() === this) {
      effect.prizeCount = 0;
      return state;
    }

    if (effect instanceof RetreatEffect && effect.player.active.getPokemonCard() === this) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    return state;
  }

}
