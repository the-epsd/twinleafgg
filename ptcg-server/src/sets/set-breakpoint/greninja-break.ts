import { EnergyCard, GameError, GameMessage, PlayerType, PowerType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import {WAS_POWER_USED} from '../../game/store/prefabs/prefabs';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

export class GreninjaBREAK extends PokemonCard {
  public stage: Stage = Stage.BREAK;
  public tags = [ CardTag.BREAK ];
  public evolvesFrom = 'Greninja';
  public cardType: CardType = W;
  public hp: number = 170;

  public powers = [
    {
      name: 'BREAK Evolution Rule',
      powerType: PowerType.BREAK_RULE,
      text: 'Greninja BREAK retains the attacks, Abilities, Weakness, Resistance, and Retreat Cost of its previous Evolution.'
    },
    {
      name: 'Giant Water Shuriken',
      powerType: PowerType.ABILITY,
      useWhenInPlay: true,
      text: 'Once during your turn (before your attack), if this Pokémon is your Active Pokémon, you may discard a [W] Energy card from your hand. If you do, put 6 damage counters on 1 of your opponent\'s Pokémon.'
    }
  ];

  public set: string = 'BKP';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '41';
  public name: string = 'Greninja BREAK';
  public fullName: string = 'Greninja BREAK BKP';

  public readonly GIANT_WATER_SHURIKEN_MARKER = 'GIANT_WATER_SHURIKEN_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Giant Water Shuriken
    if (WAS_POWER_USED(effect, 1, this)){
      const player = effect.player;

      if (player.marker.hasMarker(this.GIANT_WATER_SHURIKEN_MARKER, this)){ throw new GameError(GameMessage.POWER_ALREADY_USED); }
      const watersInHand = player.hand.cards.filter(c => c instanceof EnergyCard && c.provides.includes(CardType.WATER));
      if (watersInHand.length === 0){ throw new GameError(GameMessage.CANNOT_USE_POWER); }
    }
    
    // slapping on the weakness, resistance, and retreat of the previous evolutions
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const cardList = effect.target;
      const previousPokemon = cardList.getPokemonCard();

      if (previousPokemon) {
        this.weakness = [...previousPokemon.weakness];
        this.resistance = [...previousPokemon.resistance];
        this.retreat = [...previousPokemon.retreat];
      }
    }
    
    // Trying to get all of the previous stage's attacks and powers
    if (effect instanceof CheckTableStateEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
          player.showAllStageAbilities = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }
    }

    if (effect instanceof CheckPokemonAttacksEffect) {
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Add attacks from the previous stage to this one
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.attacks.push(...(evolutionCard.attacks || []));
        }
      }
    }

    if (effect instanceof CheckPokemonPowersEffect){
      const player = effect.player;
      const cardList = StateUtils.findCardList(state, this);
      const owner = StateUtils.findOwner(state, cardList);

      if (owner !== player) {
        return state;
      }

      let isThisInPlay = false;
      owner.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card) => {
        if (card === this) {
          isThisInPlay = true;
        }
      });

      if (!isThisInPlay) {
        return state;
      }

      // Adds the powers from the previous stage
      for (const evolutionCard of cardList.cards) {
        if (evolutionCard.superType === SuperType.POKEMON && evolutionCard !== this && evolutionCard.name === this.evolvesFrom) {
          effect.powers.push(...(evolutionCard.powers || []));
        }
      }
    }

    return state;
  }
}