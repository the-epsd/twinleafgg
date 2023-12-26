import { PokemonCard, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, SlotType, State, StoreLike, GameError } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, KnockOutEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class MedichamV extends PokemonCard {

  public cardType = CardType.FIGHTING;
    
  public hp = 210;
    
  public weakness = [{ type: CardType.PSYCHIC }];
    
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public attacks = [
    {
      name: 'Yoga Loop',
      cost: [CardType.COLORLESS, CardType.COLORLESS],
      damage: 0,
      text: 'Put 2 damage counters on 1 of your opponent\'s Pokémon. If your opponent\'s Pokémon is Knocked Out by this attack, take another turn after this one. (Skip Pokémon Checkup.) If 1 of your Pokémon used Yoga Loop during your last turn, this attack can\'t be used.'
    },
    {
      name: 'Smash Uppercut', 
      cost: [CardType.FIGHTING, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: 'This attack\'s damage isn\'t affected by Resistance.'
    }
  ];
  
  public set: string = 'EVS';

  public cardImage: string = 'assets/cardback.png';
  
  public setNumber: string = '83';
  
  public name: string = 'Medicham V';
  
  public fullName: string = 'Medicham V EVS';

  public readonly YOGA_LOOP_MARKER = 'YOGA_LOOP_MARKER';
  public readonly YOGA_LOOP_MARKER_2 = 'YOGA_LOOP_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
    }
  
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER, this);
      effect.player.marker.removeMarker(this.YOGA_LOOP_MARKER_2, this);
      effect.player.usedTurnSkip = false;
      console.log('marker cleared');
    }
  
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
      effect.player.marker.addMarker(this.YOGA_LOOP_MARKER_2, this);
      effect.player.usedTurnSkip = false;
      console.log('marker added');
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      // Check marker
      if (effect.player.attackMarker.hasMarker(this.YOGA_LOOP_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.ACTIVE, SlotType.BENCH ],
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        const targets = selected || [];
        targets.forEach(target => {
          const damageEffect = new PutDamageEffect(effect, 20);
          damageEffect.target = target;
          store.reduceEffect(state, damageEffect);

          if (effect instanceof KnockOutEffect && effect.target === target) {
            player.marker.addMarker(this.YOGA_LOOP_MARKER, this);
            effect.player.usedTurnSkip = true;
            return state;
          }

        });
        return state; 
      });
    }
    return state;
  }
}
