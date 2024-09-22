import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State, ConfirmPrompt, GameMessage, SuperType, EnergyType, PlayerType, AttachEnergyPrompt, SlotType, StateUtils } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class Archaludonex extends PokemonCard {
  public tags = [CardTag.POKEMON_ex];
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom = 'Duraludon';
  public cardType: CardType = CardType.METAL;
  public hp: number = 300;
  public weakness = [{ type: CardType.FIRE }];
  public resistance = [{ type: CardType.GRASS, value: -30 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public powers = [{
    name: 'Energy Attachment',
    powerType: PowerType.ABILITY,
    text: 'When you play this Pokémon from your hand to evolve 1 of your Pokemon during your turn, you may attach 2 Basic [M] Energy from your discard pile to your Pokémon in any way you like.'
  }];

  public attacks = [{
    name: 'Metal Defender',
    cost: [CardType.METAL, CardType.METAL, CardType.METAL],
    damage: 220,
    text: 'During your opponent\'s next turn, this Pokemon has no Weakness.'
  }];

  public set: string = 'SET_CODE_HERE';
  public setNumber: string = '37';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Archaludon ex';
  public fullName: string = 'Archaludon ex SET_CODE_HERE';

  public readonly METAL_DEFENDER_MARKER = 'METAL_DEFENDER_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      return store.prompt(state, new ConfirmPrompt(
        player.id,
        GameMessage.WANT_TO_USE_ABILITY
      ), wantToUse => {
        if (wantToUse) {
          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_ACTIVE,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: false, min: 1, max: 2 }
          ), transfers => {
            transfers = transfers || [];

            if (transfers.length === 0) {
              return;
            }

            for (const transfer of transfers) {
              const target = StateUtils.getTarget(state, player, transfer.to);
              player.discard.moveCardTo(transfer.card, target);
            }
          });
        }
      });
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      player.marker.addMarker(this.METAL_DEFENDER_MARKER, this);
      console.log('marker added');
    }

    if (effect instanceof AttackEffect && effect.target.cards.includes(this)) {
      if (effect.target.marker.hasMarker(this.METAL_DEFENDER_MARKER, this)) {
        effect.ignoreWeakness == true;
      }
    }

    if (effect instanceof EndTurnEffect) {
      effect.player.marker.removeMarker(this.METAL_DEFENDER_MARKER, this);
      console.log('marker removed');
    }

    return state;
  }
}
