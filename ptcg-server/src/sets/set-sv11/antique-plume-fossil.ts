import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, PokemonType } from '../../game/store/card/card-types';
import { GameError, GameLog, GameMessage, Power, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { KnockOutEffect, PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS } from '../../game/store/prefabs/prefabs';

export class AntiquePlumeFossil extends TrainerCard {
  public superType = SuperType.TRAINER;
  public regulationMark = 'I';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 60;
  public movedToActiveThisTurn = false;
  public pokemonType = PokemonType.NORMAL;
  public evolvesFrom = '';
  public cardTag = [];
  public tools = [];
  public archetype = [];
  public weakness = [];
  public retreat = [];
  public resistance = [];
  public attacks = [];
  public attacksThisTurn: number = 0;
  public maxAttacksThisTurn: number = 1;
  public allowSubsequentAttackChoice: boolean = false;

  public powers: Power[] = [{
    name: 'Antique Plume Fossil',
    text: `Play this card as if it were a 60-HP [C] Basic Pokémon. This card can't be affected by any Special Conditions and can'\' retreat.

At any time during your turn, you may discard this card from play.`,
    useWhenInPlay: true,
    exemptFromAbilityLock: true,
    powerType: PowerType.TRAINER_ABILITY
  },
  {
    name: 'Wing Protection',
    powerType: PowerType.ABILITY,
    text: 'As long as this Pokémon is on your Bench, prevent all damage done to this Pokémon by attacks from your opponent\'s Pokémon.'
  }];

  public set: string = 'SV11W';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '81';
  public name: string = 'Antique Plume Fossil';
  public fullName: string = 'Antique Plume Fossil SV11W';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      const pokeDollCardList = StateUtils.findCardList(state, this);

      if (player.active.cards[0] !== this) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      store.log(state, GameLog.LOG_PLAYER_PUTS_CARD_ON_BOTTOM_OF_DECK, { name: player.name, card: this.name });

      // Move Lillie's Poke Doll to bottom of deck
      state = MOVE_CARDS(store, state, pokeDollCardList, player.deck, {
        cards: [this],
        toBottom: true
      });

      // Move any attached cards to discard
      state = MOVE_CARDS(store, state, pokeDollCardList, player.discard, {
        cards: pokeDollCardList.cards.filter(c => c !== this)
      });
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

    if (effect instanceof KnockOutEffect && effect.target.cards.includes(this)) {
      effect.prizeCount = 0;
      return state;
    }

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    // Prevent effects of attacks
    if (effect instanceof PutDamageEffect && effect.target.getPokemonCard() === this) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      // Target is not Active
      if (effect.target === player.active || effect.target === opponent.active) {
        return state;
      }

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const stub = new PowerEffect(player, {
          name: 'test',
          powerType: PowerType.ABILITY,
          text: ''
        }, this);
        store.reduceEffect(state, stub);
      } catch {
        return state;
      }
      effect.preventDefault = true;
    }
    return state;
  }
}