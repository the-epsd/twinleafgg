import { PokemonCard, Stage, CardType, CardTag, State, StoreLike, GameMessage, StateUtils, AttachEnergyPrompt, CardTarget, ChoosePokemonPrompt, EnergyCard, EnergyType, PlayerType, SlotType, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { MarkerConstants } from '../../game/store/markers/marker-constants';
import { WAS_ATTACK_USED, BLOCK_RETREAT, BLOCK_RETREAT_IF_MARKER, REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN } from '../../game/store/prefabs/prefabs';

export class BlazikenVMAX extends PokemonCard {
  public stage: Stage = Stage.VMAX;
  public tags = [CardTag.POKEMON_VMAX, CardTag.RAPID_STRIKE];
  public evolvesFrom = 'Blaziken V';
  public cardType: CardType = R;
  public hp: number = 320;
  public weakness = [{ type: W }];
  public retreat = [C, C];

  public attacks = [{
    name: 'Clutch',
    cost: [R],
    damage: 60,
    text: 'During your opponent\'s next turn, the Defending Pokémon can\'t retreat.'
  },
  {
    name: 'Max Blaze',
    cost: [C, C],
    damage: 130,
    text: 'Choose up to 2 of your Benched Rapid Strike Pokémon and attach an Energy card from your discard pile to each of them.'
  }];

  public set: string = 'CRE';
  public regulationMark = 'E';
  public cardImage: string = 'assets/cardback.png';
  public setNumber: string = '21';
  public name: string = 'Blaziken VMAX';
  public fullName: string = 'Blaziken VMAX CRE';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (WAS_ATTACK_USED(effect, 0, this)) {
      return BLOCK_RETREAT(store, state, effect, this);
    }

    BLOCK_RETREAT_IF_MARKER(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);
    REMOVE_MARKER_FROM_ACTIVE_AT_END_OF_TURN(effect, MarkerConstants.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER, this);

    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {

      const player = effect.player;

      const hasEnergyInDiscard = player.discard.cards.some(c => {
        return c instanceof EnergyCard
          && c.energyType === EnergyType.BASIC;
      });

      if (!hasEnergyInDiscard) {
        return state;
      }

      let rapidStrikePokemonOnBench = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.RAPID_STRIKE)) {
          rapidStrikePokemonOnBench = true;
        }
      });

      if (!rapidStrikePokemonOnBench) {
        return state;
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.RAPID_STRIKE)) {
          blocked2.push(target);
        }
      });

      return store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { min: 0, max: 2, blocked: blocked2 }
      ), chosen => {

        chosen.forEach(target => {

          state = store.prompt(state, new AttachEnergyPrompt(
            player.id,
            GameMessage.ATTACH_ENERGY_TO_BENCH,
            player.discard,
            PlayerType.BOTTOM_PLAYER,
            [SlotType.BENCH],
            { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
            { allowCancel: true, min: 0, max: 1 }
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
        });
      });
    }
    return state;
  }
}