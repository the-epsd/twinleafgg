import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, SuperType, EnergyType, CardTag } from '../../game/store/card/card-types';
import { StoreLike, State, StateUtils, PowerType, GameMessage, GameError, CardList, EnergyCard, AttachEnergyPrompt, PlayerType, SlotType, CardTarget } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import {EndTurnEffect} from '../../game/store/effects/game-phase-effects';


export class ZacianV extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [ CardTag.POKEMON_V ];
  public cardType: CardType = M;
  public hp: number = 220;
  public weakness = [{ type: R }];
  public retreat = [ C, C ];
  public resistance = [{ type: G, value: -30 }];

  public powers = [{
    name: 'Intrepid Sword',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may look at the top 3 cards of your deck and attach any number of [M] Energy cards you find there to this Pokémon. Put the other cards into your hand. If you use this Ability, your turn ends.'
  }];

  public attacks = [{
    name: 'Brave Blade',
    cost: [M, M, M],
    damage: 230,
    text: 'During your next turn, this Pokémon can\'t attack.'
  }];

  public set: string = 'SSH';
  public regulationMark = 'D';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '138';
  public name: string = 'Zacian V';
  public fullName: string = 'Zacian V SSH';

  public readonly BRAVE_BLADE_MARKER = 'BRAVE_BLADE_MARKER';
  public readonly BRAVE_BLADE_MARKER_2 = 'BRAVE_BLADE_MARKER_2';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Intrepid Sword
    if (effect instanceof PowerEffect && effect.power === this.powers[0]){
      const player = effect.player;

      const topdecks = new CardList();
      player.deck.moveTo(topdecks, 3);

      let metals = 0;
      topdecks.cards.forEach(card => {
        if (card instanceof EnergyCard && card.name === 'Metal Energy'){
          metals++;
        }
      });

      if (!metals){
        topdecks.moveTo(player.hand);
      }

      if (metals > 0){
        const blocked: CardTarget[] = [];
        player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
          if (card !== this) {
            blocked.push(target);
          }
        });

        state = store.prompt(state, new AttachEnergyPrompt(
          player.id,
          GameMessage.ATTACH_ENERGY_TO_BENCH,
          topdecks,
          PlayerType.BOTTOM_PLAYER,
          [SlotType.BENCH, SlotType.ACTIVE],
          { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Metal Energy' },
          { allowCancel: false, min: 0, max: metals, blockedTo: blocked }
        ), transfers => {
          transfers = transfers || [];
          // cancelled by user
          if (transfers.length === 0) {
            return;
          }
          for (const transfer of transfers) {
            const target = StateUtils.getTarget(state, player, transfer.to);
            topdecks.moveCardTo(transfer.card, target);
          }

          topdecks.moveTo(player.hand);
        });
      }

      

      // end the turn
      const endTurnEffect = new EndTurnEffect(player);
      return store.reduceEffect(state, endTurnEffect);
    }

    // Brave Blade
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      if (effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER, this)) {
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      player.marker.addMarker(this.BRAVE_BLADE_MARKER, this);
    }
    
    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER_2, this)) {
      effect.player.marker.removeMarker(this.BRAVE_BLADE_MARKER, this);
      effect.player.marker.removeMarker(this.BRAVE_BLADE_MARKER_2, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.BRAVE_BLADE_MARKER, this)) {
      effect.player.marker.addMarker(this.BRAVE_BLADE_MARKER_2, this);
    }

    return state;
  }
}