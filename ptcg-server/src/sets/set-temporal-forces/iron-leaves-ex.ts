import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType } from '../../game/store/card/card-types';
import { StoreLike, State, GameMessage, Card, CardTarget, ConfirmPrompt, MoveEnergyPrompt, PlayerType, SlotType, StateUtils, GameError, PowerType } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class IronLeavesex extends PokemonCard {

  public tags = [ CardTag.POKEMON_ex, CardTag.FUTURE ];

  public regulationMark = 'G';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public powers = [{
    name: 'Rapid Vernier',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, when you play this Pokémon from your hand onto your Bench, you may switch this Pokémon with your Active Pokémon. If you do, you may move any number of Energy from your Benched Pokémon to this Pokémon.'
  }];

  public attacks = [
    {
      name: 'Prismatic Edge',
      cost: [ CardType.GRASS, CardType.GRASS, CardType.COLORLESS ],
      damage: 180,
      text: 'During your next turn, this Pokémon can\'t attack.'
    }
  ];

  public set: string = 'SV5M';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '016';

  public name: string = 'Iron Leaves ex';

  public fullName: string = 'Iron Leaves ex';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

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

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard == this) {

      const player = effect.player;

      // Try to reduce PowerEffect, to check if something is blocking our ability
      try {
        const powerEffect = new PowerEffect(player, this.powers[0], this);
        store.reduceEffect(state, powerEffect);
      } catch {
        return state;
      }
      state = store.prompt(state, new ConfirmPrompt(
        effect.player.id,
        GameMessage.WANT_TO_USE_ABILITY,
      ), wantToUse => {
        if (wantToUse) {

          const player = effect.player;
          const target = effect.target;
    
          player.switchPokemon(target);
    

          const blockedMap: { source: CardTarget, blocked: number[] }[] = [];
          player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
            const checkProvidedEnergy = new CheckProvidedEnergyEffect(player, cardList);
            store.reduceEffect(state, checkProvidedEnergy);
            const blockedCards: Card[] = [];

            checkProvidedEnergy.energyMap.forEach(em => {
              if (!em.provides.includes(CardType.ANY)) {
                blockedCards.push(em.card);
              }
            });

            const blocked: number[] = [];
            blockedCards.forEach(bc => {
              const index = cardList.cards.indexOf(bc);
              if (index !== -1 && !blocked.includes(index)) {
                blocked.push(index);
              }
            });

            if (blocked.length !== 0) {
              blockedMap.push({ source: target, blocked });
            }
          });

          return store.prompt(state, new MoveEnergyPrompt(
            player.id, 
            GameMessage.MOVE_ENERGY_CARDS,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH], // Only allow moving to active
            { superType: SuperType.ENERGY }, 
            { allowCancel: true, blockedMap }
          ), transfers => {

            if (!transfers) {
              return;
            }

            for (const transfer of transfers) {
    
              // Can only move energy to the active Pokemon
              const target = player.active;  
              const source = StateUtils.getTarget(state, player, transfer.from);

              source.moveCardTo(transfer.card, target);
              return state;
            }
            return state;
          });
        }
        return state;
      });
      return state;
    }
    return state;
  }
}