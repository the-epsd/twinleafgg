import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, PowerType, PlayerType, StateUtils, GameError, GameMessage } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { IS_ABILITY_BLOCKED } from '../../game/store/prefabs/prefabs';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class FalinksV extends PokemonCard {

  public tags = [CardTag.POKEMON_V];
  public regulationMark = 'D';
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FIGHTING;
  public hp: number = 160;
  public weakness = [{ type: CardType.PSYCHIC }];
  public resistance = [];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
 
    public powers = [{   
    name: 'Iron Defense Formation',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'All of your Pokémon that have "Falinks" in their name take 20 less damage from your opponent\'s attacks (after applying Weakness and Resistance).'
    }];
      
    public attacks = [{
    name: 'Giga Impact',
    cost: [CardType.FIGHTING, CardType.FIGHTING, CardType.COLORLESS],
    damage: 210,
    text: 'During your next turn, this Pokemon can\'t attack.'
  }];
 
  public set: string = 'RCL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '110';

  public name: string = 'Falinks V';

  public fullName: string = 'Falinks V RCL';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
 
   public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

     if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
          effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
          effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
        }
    
        if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
          effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
        }
   
    if (effect instanceof PutDamageEffect) {
      const cardList = StateUtils.findCardList(state, this);
      const player = StateUtils.findOwner(state, cardList);
      let falinksVCount = 0;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (_cardList, card) => {
        if (card.name && card.name.indexOf('Falinks V') !== -1) {
          falinksVCount++;
        }
      });

      if (falinksVCount === 0) {
        return state;
      }

      if (IS_ABILITY_BLOCKED(store, state, player, this)) {
        return state;
      }

      const targetPokemon = effect.target.getPokemonCard();
      if (targetPokemon && StateUtils.findOwner(state, effect.target) === player && targetPokemon.name && targetPokemon.name.indexOf('Falinks') !== -1) {
        effect.reduceDamage(20 * falinksVCount, this.powers[0].name);
      }
    }

    
        if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
    
          // Check marker
          if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
            throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
          }
          effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
        }
        return state;
      }
    }
          