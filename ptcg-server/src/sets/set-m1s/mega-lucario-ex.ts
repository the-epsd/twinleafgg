import { AttachEnergyPrompt, CardTag, CardType, EnergyType, GameError, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from "../../game";
import { Effect } from "../../game/store/effects/effect";
import { EndTurnEffect } from "../../game/store/effects/game-phase-effects";
import { ADD_MARKER, HAS_MARKER, WAS_ATTACK_USED } from "../../game/store/prefabs/prefabs";

export class MegaLucarioex extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Riolu';
  public tags = [CardTag.POKEMON_SV_MEGA, CardTag.POKEMON_ex];
  public cardType: CardType = F;
  public hp: number = 340;
  public weakness = [{ type: P }];
  public retreat = [C, C];

  public attacks = [
    {
      name: 'Aura Jab',
      cost: [ F ],
      damage: 130,
      text: 'Attach up to 3 Basic [F] Energy cards from your discard pile to your Benched Pokemon in any way you like.',
    },
    {
      name: 'Mega Brave',
      cost: [ F, F],
      damage: 270,
      text: 'During your next turn, this Pokemon can\'t use Mega Brave.',
    }
  ];

  public regulationMark: string = 'I';
  public set: string = 'M1S';
  public setNumber: string = '29';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Mega Lucario ex';
  public fullName: string = 'Mega Lucario ex M1S';

  public readonly MEGA_BRAVE_MARKER = 'MEGA_BRAVE_MARKER';
  public readonly CLEAR_MEGA_BRAVE_MARKER = 'CLEAR_MEGA_BRAVE_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Aura Jab
    if (WAS_ATTACK_USED(effect, 0, this)){
      const player = effect.player;

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Fighting Energy' },
        { allowCancel: false, min: 0, max: 3 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.discard.moveCardTo(transfer.card, target);
        }
      });
    }  

    // Mega Brave
    if (WAS_ATTACK_USED(effect, 1, this)){

      if (HAS_MARKER(this.MEGA_BRAVE_MARKER, effect.player, this)){
        throw new GameError(GameMessage.BLOCKED_BY_EFFECT);
      }

      ADD_MARKER(this.MEGA_BRAVE_MARKER, effect.player, this);
      effect.player.marker.addMarker(this.MEGA_BRAVE_MARKER, this);
    }

    if (effect instanceof EndTurnEffect && effect.player.marker.hasMarker(this.MEGA_BRAVE_MARKER, this)){
      if (!effect.player.marker.hasMarker(this.CLEAR_MEGA_BRAVE_MARKER, this)){
        effect.player.marker.addMarker(this.CLEAR_MEGA_BRAVE_MARKER, this);
      } else if (effect.player.marker.hasMarker(this.CLEAR_MEGA_BRAVE_MARKER, this)){
        effect.player.marker.removeMarker(this.MEGA_BRAVE_MARKER, this);
        effect.player.marker.removeMarker(this.CLEAR_MEGA_BRAVE_MARKER, this);
      }
    }

    return state;
  }
}