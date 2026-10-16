import { PokemonCard } from '../../../game/store/card/pokemon-card';
import { CardType, EnergyType, Stage, SuperType } from '../../../game/store/card/card-types';
import { AttachEnergyPrompt, EnergyCard, GameMessage, PlayerType, PowerType, SlotType, State, StateUtils, StoreLike } from '../../../game';
import { Effect } from '../../../game/store/effects/effect';
import { AfterDamageEffect } from '../../../game/store/effects/attack-effects';
import { ADD_CONFUSION_TO_PLAYER_ACTIVE, COIN_FLIP_PROMPT, IS_POKEBODY_BLOCKED, MOVE_CARDS, WAS_ATTACK_USED } from '../../../game/store/prefabs/prefabs';

export class Delcatty extends PokemonCard {
  public stage: Stage = Stage.STAGE_1;
  public evolvesFrom: string = 'Skitty';
  public hp: number = 80;
  public cardType: CardType[] = [C];
  public weakness = [{ type: F, value: +20 }];
  public retreat = [C];

  public powers = [{
    name: 'Attracting Body',
    powerType: PowerType.POKEBODY,
    text: 'If Delcatty is your Active Pokémon and is damaged by an opponent\'s attack (even if Delcatty is Knocked Out), flip a coin. If heads, the Attacking Pokémon is now Confused.'
  }];

  public attacks = [{
    name: 'Energy Assist',
    cost: [C],
    damage: 30,
    text: 'Search your discard pile for a basic Energy card and attach it to 1 of your Benched Pokémon.'
  }];

  public set: string = 'LA';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '23';
  public name: string = 'Delcatty';
  public fullName: string = 'Delcatty LA';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Attracting Body
    if (effect instanceof AfterDamageEffect && effect.target.getPokemonCard() === this
      && effect.damage > 0) {
      const owner = StateUtils.findOwner(state, effect.target);
      if (owner.active !== effect.target || effect.player === owner) {
        return state;
      }
      if (IS_POKEBODY_BLOCKED(store, state, owner, this)) {
        return state;
      }
      COIN_FLIP_PROMPT(store, state, owner, result => {
        if (result) {
          ADD_CONFUSION_TO_PLAYER_ACTIVE(store, state, effect.player, this);
        }
      });
    }

    // Energy Assist
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      const hasEnergy = player.discard.cards.some(
        c => c instanceof EnergyCard && c.energyType === EnergyType.BASIC,
      );
      if (!hasBench || !hasEnergy) {
        return state;
      }
      return store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.discard,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          MOVE_CARDS(store, state, player.discard, target, {
            cards: [transfer.card],
            sourceCard: this,
            sourceEffect: this.attacks[0],
          });
        }
      });
    }

    return state;
  }
}
