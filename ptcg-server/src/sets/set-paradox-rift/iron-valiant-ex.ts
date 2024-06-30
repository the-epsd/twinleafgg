import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SpecialCondition } from '../../game/store/card/card-types';
import { StoreLike, State, ChoosePokemonPrompt, PlayerType, SlotType, PowerType, GameError } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { GameMessage } from '../../game/game-message';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class IronValiantex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex, CardTag.FUTURE ];

  public regulationMark = 'G';
  
  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public hp: number = 220;

  public weakness = [{ type: CardType.METAL }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public powers = [
    {
      name: 'Tachyon Bits',
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, when this Pokémon moves from your Bench to the Active Spot, you may put 2 damage counters on 1 of your opponent\'s Pokémon.'
    }
  ];

  public attacks = [
    {
      name: 'Laser Blade',
      cost: [CardType.PSYCHIC, CardType.PSYCHIC, CardType.COLORLESS],
      damage: 200,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'PAR';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '38';

  public name: string = 'Iron Valiant ex';

  public fullName: string = 'Iron Valiant ex PAR';

  public readonly TACHYON_BITS_MARKER = 'TACHYON_BITS_MARKER';
  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  //   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

  //     if (effect instanceof EndTurnEffect) {
  //       this.movedToActiveThisTurn = false;
  //       console.log('movedToActiveThisTurn = false');
  //     }

  //     if (effect instanceof EndTurnEffect && effect.player.abilityMarker.hasMarker(this.TACHYON_BITS_MARKER, this)) {
  //       effect.player.abilityMarker.removeMarker(this.TACHYON_BITS_MARKER, this);
  //       console.log('marker cleared');
  //     }
  //     if (this.movedToActiveThisTurn == true) {
  //       // if (effect instanceof RetreatEffect && effect.player.active.cards[0] == this) {
  //       const player = state.players[state.activePlayer];
  //       const opponent = StateUtils.getOpponent(state, player);

  //       // if (this.movedToActiveThisTurn == false) {
  //       //   throw new GameError(GameMessage.CANNOT_USE_ATTACK);
  //       // }

  //       try {
  //         const powerEffect = new PowerEffect(opponent, this.powers[0], this);
  //         store.reduceEffect(state, powerEffect);
  //       } catch {
  //         return state;
  //       }

  //       if (player.abilityMarker.hasMarker(this.TACHYON_BITS_MARKER, this)) {
  //         console.log('attack blocked');
  //         return state;
  //       }

  //       return store.prompt(state, new ChoosePokemonPrompt(
  //         player.id,
  //         GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
  //         PlayerType.TOP_PLAYER,
  //         [SlotType.BENCH, SlotType.ACTIVE],
  //         { min: 1, max: 1, allowCancel: true },
  //       ), selected => {
  //         const targets = selected || [];
  //         targets.forEach(target => {
  //           target.damage += 20;
  //           this.movedToActiveThisTurn = false;
  //           player.abilityMarker.addMarker(this.TACHYON_BITS_MARKER, this);
  //           console.log('marker added');
  //           return
  //         });
  //       });
  //     }
  //     return state;

  //   }


  // }


  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      this.movedToActiveThisTurn = false;
    }

    if (effect instanceof EndTurnEffect) {
      this.movedToActiveThisTurn = false;
      console.log('movedToActiveThisTurn = false');
    }

    if (effect instanceof EndTurnEffect && effect.player.abilityMarker.hasMarker(this.TACHYON_BITS_MARKER, this)) {
      effect.player.abilityMarker.removeMarker(this.TACHYON_BITS_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.attackMarker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.attackMarker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    const player = state.players[state.activePlayer];

    if (this.movedToActiveThisTurn == true && player.abilityMarker.hasMarker(this.TACHYON_BITS_MARKER, this)) {
      return state;
    }

    if (this.movedToActiveThisTurn == true) {

      if (player.abilityMarker.hasMarker(this.TACHYON_BITS_MARKER, this)) {
        effect.preventDefault = true;
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

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { min: 1, max: 1, allowCancel: true },
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          target.damage += 20;
          player.abilityMarker.addMarker(this.TACHYON_BITS_MARKER, this);

          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
            if (cardList.getPokemonCard() === this) {
              cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
            }
          });

          return state;
        });
        return state;
      });
    }
    return state;
  }


}