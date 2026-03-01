import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, PokemonType } from '../../game/store/card/card-types';
import { GameError, GameLog, GameMessage, Power, PowerType, State, StateUtils, StoreLike, TrainerCard } from '../../game';
import { AbstractAttackEffect, ApplyWeaknessEffect, PutDamageEffect, DealDamageEffect } from '../../game/store/effects/attack-effects';
import { PowerEffect, RetreatEffect } from '../../game/store/effects/game-effects';
import { PlayItemEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { MOVE_CARDS, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class AntiqueCoverFossil extends TrainerCard {
  public superType = SuperType.TRAINER;
  public regulationMark = 'H';
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
  public evolvesFromBase: string[] = [];
  public maxTools: number = 1;
  public evolvesTo = [];
  public evolvesToStage = [];

  public powers: Power[] = [{
    name: 'Antique Cover Fossil',
    text: `Play this card as if it were a 60-HP [C] Basic Pokémon. This card can't be affected by any Special Conditions and can't retreat.

At any time during your turn, you may discard this card from play.`,
    useWhenInPlay: true,
    exemptFromAbilityLock: true,
    isFossil: true,
    powerType: PowerType.TRAINER_ABILITY
  },
  {
    name: 'Protective Cover',
    powerType: PowerType.ABILITY,
    isFossil: true,
    text: 'Prevent all effects of attacks used by your opponent\'s Pokémon done to this Pokémon. (Damage is not an effect.)'
  }];

  public set: string = 'SCR';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '129';
  public name: string = 'Antique Cover Fossil';
  public fullName: string = 'Antique Cover Fossil SCR';

  public reduceEffect(store: StoreLike, state: State, effect: any): State {
    if (WAS_POWER_USED(effect, 0, this)) {
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

    if (effect instanceof RetreatEffect && effect.player.active.cards.includes(this)) {
      throw new GameError(GameMessage.CANNOT_RETREAT);
    }

    // Prevent effects of attacks
    if (effect instanceof AbstractAttackEffect && effect.target.cards.includes(this)) {
      const pokemonCard = effect.target.getPokemonCard();
      const sourceCard = effect.source.getPokemonCard();

      if (pokemonCard !== this) {
        return state;
      }

      if (sourceCard) {
        // Try to reduce PowerEffect, to check if something is blocking our ability
        try {
          const player = StateUtils.findOwner(state, effect.target);
          const stub = new PowerEffect(player, {
            name: 'test',
            powerType: PowerType.ABILITY,
            text: ''
          }, this);
          store.reduceEffect(state, stub);
        } catch {
          return state;
        }
        // Allow Weakness & Resistance
        if (effect instanceof ApplyWeaknessEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof PutDamageEffect) {
          return state;
        }
        // Allow damage
        if (effect instanceof DealDamageEffect) {
          return state;
        }

        effect.preventDefault = true;
      }
    }
    return state;
  }
}