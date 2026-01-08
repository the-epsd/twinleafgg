import { AttachEnergyPrompt, CardTag, CardType, GameMessage, PlayerType, PokemonCard, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { DISCARD_X_ENERGY_FROM_THIS_POKEMON } from '../../game/store/prefabs/costs';
import { CONFIRMATION_PROMPT, DISCARD_ALL_ENERGY_FROM_POKEMON, MOVE_CARDS, WAS_ATTACK_USED } from '../../game/store/prefabs/prefabs';

export class CharizardStar extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public tags = [CardTag.STAR, CardTag.DELTA_SPECIES];
  public cardType: CardType = D;
  public hp: number = 90;
  public weakness = [{ type: W }];
  public retreat = [C, C, C];

  public attacks = [{
    name: 'Rotating Claws',
    cost: [D, C],
    damage: 20,
    text: 'You may discard an Energy card attached to Charizard Star. If you do, search your discard pile for an Energy card (excluding the one you discarded) and attach it to Charizard Star.'
  },
  {
    name: 'Dark Swirl',
    cost: [D, D, D, D, C],
    damage: 150,
    text: 'Discard all Energy cards attached to Charizard Star and discard the top 3 cards from your opponent\'s deck.'
  }];

  public set: string = 'DF';
  public setNumber: string = '100';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Charizard Star';
  public fullName: string = 'Charizard Star DF';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    // Rotating Claws
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      CONFIRMATION_PROMPT(store, state, player, result => {
        if (result) {
          DISCARD_X_ENERGY_FROM_THIS_POKEMON(store, state, effect, 1);

          if (player.discard.cards.some(card => card.superType === SuperType.ENERGY)) {
            state = store.prompt(state, new AttachEnergyPrompt(
              player.id,
              GameMessage.ATTACH_ENERGY_TO_ACTIVE,
              player.discard,
              PlayerType.BOTTOM_PLAYER,
              [SlotType.ACTIVE],
              { superType: SuperType.ENERGY },
              { allowCancel: false, min: 1, max: 1 }
            ), transfers => {
              transfers = transfers || [];
              // cancelled by user
              if (transfers.length === 0) {
                return;
              }

              for (const transfer of transfers) {
                const target = StateUtils.getTarget(state, player, transfer.to);
                MOVE_CARDS(store, state, player.discard, target, { cards: [transfer.card], sourceCard: this, sourceEffect: this.attacks[0] });
              }
            });
          }
        }
      }, GameMessage.WANT_TO_USE_EFFECT_OF_ATTACK);
    }

    if (WAS_ATTACK_USED(effect, 1, this)) {
      const opponent = effect.opponent;
      DISCARD_ALL_ENERGY_FROM_POKEMON(store, state, effect, this);
      MOVE_CARDS(store, state, opponent.deck, opponent.discard, { count: 3, sourceCard: this, sourceEffect: this.attacks[1] });
    }

    return state;
  }
}