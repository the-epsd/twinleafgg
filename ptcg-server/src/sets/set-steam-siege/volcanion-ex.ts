import { PokemonCard, Stage, PowerType, CardType, ChooseCardsPrompt, EnergyCard, EnergyType, GameError, GameMessage, State, StoreLike, SuperType } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class VolcanionEX extends PokemonCard {
  public cardType = R;
  public additionalCardTypes = [W];
  public stage = Stage.BASIC;
  public hp = 180;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Steam Up',
    powerType: PowerType.ABILITY,
    text: 'Once during your turn (before your attack), you may discard a [R] Energy card from your hand. If you do, during this turn, your Basic [R] Pokémon\'s attacks do 30 more damage to your opponent\'s Active Pokémon (before applying Weakness and Resistance).'
  }];

  public attacks = [{
    name: 'Volcanic Heat',
    cost: [R, R, C],
    damage: 130,
    text: 'This Pokémon can\'t attack during your next turn.'
  }];

  public set = 'STS';
  public setNumber = '26';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Volcanion EX';
  public fullName = 'Volcanion EX STS';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';

  public readonly STEAM_UP_MARKER = 'STEAM_UP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_2_MARKER, this)) {
      effect.player.marker.removeMarker(this.ATTACK_USED_MARKER, this);
      effect.player.marker.removeMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('marker cleared');
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
      effect.player.marker.addMarker(this.ATTACK_USED_2_MARKER, this);
      console.log('second marker added');
    }
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {

      // Check marker
      if (effect.player.marker.hasMarker(this.ATTACK_USED_MARKER, this)) {
        console.log('attack blocked');
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }
      effect.player.marker.addMarker(this.ATTACK_USED_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;

      if (player.hand.cards.filter(c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC && c.name === 'Fire Energy').length === 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      return store.prompt(state, new ChooseCardsPrompt(
        player,
        GameMessage.CHOOSE_CARD_TO_DISCARD,
        player.hand,
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fire Energy' },
        { min: 1, max: 1, allowCancel: false }
      ), selected => {
        if (selected && selected.length > 0) {
          const energy = selected[0] as EnergyCard;
          player.hand.moveCardTo(energy, player.discard);
          player.marker.addMarker(this.STEAM_UP_MARKER, this);
        }
      });
    }

    if (effect instanceof DealDamageEffect && effect.player.marker.hasMarker(this.STEAM_UP_MARKER)) {
      const source = effect.source.getPokemonCard();
      if (source && source.stage === Stage.BASIC && source.cardType === CardType.FIRE) {
        effect.damage += 30;
      }
    }

    return state;
  }
}