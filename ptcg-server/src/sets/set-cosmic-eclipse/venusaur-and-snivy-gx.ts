import { CardTag, CardType, ChoosePokemonPrompt, GameMessage, PlayerType, PokemonCard, PowerType, SlotType, Stage, State, StateUtils, StoreLike } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';
import { BLOCK_IF_GX_ATTACK_USED, CONFIRMATION_PROMPT, IS_ABILITY_BLOCKED, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';
import {DealDamageEffect} from '../../game/store/effects/attack-effects';
import {HealEffect} from '../../game/store/effects/game-effects';
import {AttachEnergyEffect} from '../../game/store/effects/play-card-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';

export class VenusaurSnivyGX extends PokemonCard {
  public tags = [CardTag.POKEMON_GX, CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = G;
  public hp: number = 270;
  public weakness = [{ type: R }];
  public retreat = [ C, C, C ];

  public powers = [{
    name: 'Shining Vine',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, if this Pokémon is your Active Pokémon, when you attach a [G] Energy card from your hand to it, you may switch 1 of your opponent\'s Benched Pokémon with their Active Pokémon.'
  }];

  public attacks = [
    {
      name: 'Forest Dump',
      cost: [ G, C, C, C ],
      damage: 160,
      text: ''
    },
    {
      name: 'Solar Plant-GX',
      cost: [ C, C, C ],
      damage: 0,
      gxAttack: true,
      text: 'This attack does 50 damage to each of your opponent\'s Pokémon. If this Pokémon has at least 2 extra Energy attached to it (in addition to this attack\'s cost), heal all damage from all of your Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.) (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public set = 'CEC';
  public setNumber = '1';
  public cardImage = 'assets/cardback.png';
  public name = 'Venusaur & Snivy-GX';
  public fullName = 'Venusaur & Snivy-GX CEC';

  public readonly SHINING_VINE_MARKER = 'SHINING_VINE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Shining Vine
    if (effect instanceof AttachEnergyEffect && effect.target === effect.player.active){
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      let benchHasPokemon = false;

      // checking if it's the active pokemon, it's ability isn't being blocked, and if the card provides grass specifically
      if (player.active.getPokemonCard() !== this){ return state; }
      if (IS_ABILITY_BLOCKED(store, state, player, this)){ return state; }
      if (!effect.energyCard.provides.includes(CardType.GRASS)){ return state; }
      // checking if the opponent has any benched pokemon
      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card !== opponent.active){ benchHasPokemon = true; }
      });
      if (!benchHasPokemon){ return state; }
      // checking if this has already been used this turn
      if (player.active.marker.hasMarker(this.SHINING_VINE_MARKER, this)){ return state; }

      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result){

          return store.prompt(state, new ChoosePokemonPrompt(
            player.id,
            GameMessage.CHOOSE_POKEMON_TO_SWITCH,
            PlayerType.TOP_PLAYER,
            [SlotType.BENCH],
            { allowCancel: false }
          ), result => {
            const cardList = result[0];
            player.active.marker.addMarker(this.SHINING_VINE_MARKER, this);
            player.marker.addMarker(this.SHINING_VINE_MARKER, this);

            opponent.switchPokemon(cardList);
          });

        }
      });
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.SHINING_VINE_MARKER, this)){
      effect.player.marker.removeMarker(this.SHINING_VINE_MARKER, this);

      effect.player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        if (card.marker.hasMarker(this.SHINING_VINE_MARKER, this)){
          card.marker.removeMarker(this.SHINING_VINE_MARKER, this);
        }
      });
    }

    // Solar Plant-GX
    if (WAS_ATTACK_USED(effect, 1, this)) {
      const player = effect.player;
      const opponent = effect.opponent;

      BLOCK_IF_GX_ATTACK_USED(player);
      player.usedGX = true;

      opponent.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
        const damage = new DealDamageEffect(effect, 50);
        damage.target = card;
        store.reduceEffect(state, damage);
      });

      const extraEffectCost: CardType[] = [C, C, C, C, C];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, card => {
          const healing = new HealEffect(player, card, card.damage);
          store.reduceEffect(state, healing);
        });
      }
    }

    return state;
  }
}