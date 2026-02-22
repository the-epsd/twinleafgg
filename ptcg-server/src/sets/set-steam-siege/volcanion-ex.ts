import { PokemonCard, Stage, PowerType, CardType, ChooseCardsPrompt, EnergyCard, EnergyType, GameError, GameMessage, State, StoreLike, SuperType, CardTag } from '../../game';
import { DealDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';

import { WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';

export class VolcanionEX extends PokemonCard {
  public cardType = R;
  public additionalCardTypes = [W];
  public tags = [CardTag.POKEMON_EX];
  public stage = Stage.BASIC;
  public hp = 180;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public powers = [{
    name: 'Steam Up',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
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
  public name: string = 'Volcanion-EX';
  public fullName = 'Volcanion EX STS';

  public readonly STEAM_UP_MARKER = 'STEAM_UP_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Volcanic Heat
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      player.active.cannotAttackNextTurnPending = true;
    }

    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;

      if (player.hand.cards.filter(c => c.superType === SuperType.ENERGY && c.energyType === EnergyType.BASIC && c.name === 'Fire Energy').length === 0) {
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