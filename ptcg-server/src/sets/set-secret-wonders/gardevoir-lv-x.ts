import { CardTarget, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, PowerType, SlotType, State, StateUtils, StoreLike } from '../../game';
import { CardTag, CardType, Stage, SuperType } from '../../game/store/card/card-types';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import {CheckHpEffect, CheckPokemonAttacksEffect, CheckPokemonPowersEffect, CheckTableStateEffect} from '../../game/store/effects/check-effects';
import { Effect } from '../../game/store/effects/effect';
import {ABILITY_USED, SWITCH_ACTIVE_WITH_BENCHED, WAS_ATTACK_USED, WAS_POWER_USED} from '../../game/store/prefabs/prefabs';
import {KnockOutEffect} from '../../game/store/effects/game-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';
import {PlayPokemonEffect} from '../../game/store/effects/play-card-effects';

export class GardevoirLVX extends PokemonCard {
  public stage: Stage = Stage.LV_X;
  public evolvesFrom = 'Gardevoir';
  public cardType: CardType = P;
  public tags = [ CardTag.POKEMON_LV_X ];
  public hp: number = 130;
  public weakness = [{ type: D }];
  public retreat = [C, C];

  public powers = [
    {
      name: 'LV.X Rule',
      powerType: PowerType.LV_X_RULE,
      text: 'Put this card onto your Active Gardevoir. Gardevoir LV.X can use any attack, Poké-Power, or Poké-Body from its previous Level.'
    },
    {
      name: 'Teleportation',
      powerType: PowerType.POKEBODY,
      useWhenInPlay: true,
      text: 'Once during your turn (before your attack), choose 1 of your Active Pokémon or 1 or your Benched Pokémon and switch Gardevoir with that Pokémon. This power can\'t be used if Gardevoir is affected by a Special Condition.'
    }
  ];

  public attacks = [{
    name: 'Bring Down',
    cost: [P, P],
    damage: 0,
    text: 'Choose 1 Pokémon (yours or your opponent\'s) with the fewest remaining HP (excluding Gardevoir) and that Pokémon is now Knocked Out.'
  }];

  public set: string = 'SW';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '131';
  public name: string = 'Gardevoir';
  public fullName: string = 'Gardevoir LV.X SW';
  
  public readonly TELEPORTATION_MARKER = 'TELEPORTATION_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Teleportation
    if (WAS_POWER_USED(effect, 1, this)){
      const player = effect.player;

      if (player.marker.hasMarker(this.TELEPORTATION_MARKER, this)){
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }
      
      if (player.active.getPokemonCard() === this){
        player.marker.addMarker(this.TELEPORTATION_MARKER, this);
        ABILITY_USED(player, this);
        SWITCH_ACTIVE_WITH_BENCHED(store, state, player);
      } else {

        let bench = new PokemonCardList;
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, card, target) => {
          if (card === this && target.slot === SlotType.BENCH) {
            bench = cardList;
          }
        });

        player.marker.addMarker(this.TELEPORTATION_MARKER, this);
        ABILITY_USED(player, this);
        player.switchPokemon(bench);
      }
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.TELEPORTATION_MARKER, this)){
      effect.player.marker.removeMarker(this.TELEPORTATION_MARKER, this);
    }

    // Bring Down
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;
      const opponent = effect.opponent;
      let leastHP = 9999999999999999;

      // figuring out which pokemon actually has the least hp
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card !== player.active){
          const hpCheck = new CheckHpEffect(player, card);
          if (hpCheck.hp < leastHP){ leastHP = hpCheck.hp; }
        }
      });
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        const hpCheck = new CheckHpEffect(opponent, card);
        if (hpCheck.hp < leastHP){ leastHP = hpCheck.hp; }
      });

      // making sure it gets put on the active pokemon
      if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this){
        if (effect.target !== effect.player.active){ throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD); }
      }

      // eliminating the pokemon that don't have the least hp from being chosen
      const blockedTo: CardTarget[] = [];
      player.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        const hpCheck = new CheckHpEffect(player, list);
        if (list === player.active){ blockedTo.push(target); }
        else if (hpCheck.hp !== leastHP) {
          blockedTo.push(target);
        }
      });
      opponent.forEachPokemon(PlayerType.TOP_PLAYER, (list, card, target) => {
        const hpCheck = new CheckHpEffect(opponent, list);
        if (hpCheck.hp !== leastHP) {
          blockedTo.push(target);
        }
      });

      store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON,
        PlayerType.ANY,
        [SlotType.ACTIVE, SlotType.BENCH],
        { min: 1, max: 1, blocked: blockedTo }
      ), target => {
        const damageEffect = new KnockOutEffect(player, target[0]);
        store.reduceEffect(state, damageEffect);
      })
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