import { AttachEnergyPrompt, CardTag, CardType, GameError, GameMessage, MoveEnergyPrompt, PlayerType, PokemonCard, ShuffleDeckPrompt, SlotType, Stage, State, StateUtils, StoreLike, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { CheckProvidedEnergyEffect } from '../../game/store/effects/check-effects';


export class GardevoirSylveonGX extends PokemonCard {
  public tags = [CardTag.TAG_TEAM];
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.FAIRY;
  public hp: number = 260;
  public weakness = [{ type: CardType.METAL }];
  public resistance = [{ type: CardType.DARK, value: -20 }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  public set = 'UNB';
  public setNumber = '130';
  public cardImage = 'assets/cardback.png';
  public name = 'Gardevoir & Sylveon-GX';
  public fullName = 'Gardevoir & Sylveon-GX UNB';
  public attacks = [
    {
      name: 'Fairy Song',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 2 [Y] Energy cards and attach them to your Benched Pokemon in any ' +
        'way you like. Then, shuffle your deck.'
    },
    {
      name: 'Kaleidostorm',
      cost: [CardType.FAIRY, CardType.FAIRY, CardType.COLORLESS],
      damage: 150,
      text: 'Move any number of Energy from your Pokemon to your other Pokemon in any way you like.'
    },
    {
      name: 'Magical Miracle-GX',
      cost: [CardType.FAIRY, CardType.FAIRY, CardType.FAIRY],
      damage: 200,
      text: 'If this Pokemon has at least 3 extra [Y] Energy attached to it (in addition to this attack\'s cost), ' +
        'your opponent shuffles their hand into their deck. (You can\'t use more than 1 GX attack in a game.)'
    },
  ];

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    // Fairy Song
    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const hasBench = player.bench.some(b => b.cards.length > 0);
      if (hasBench === false) { return state; }

      store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_CARDS,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH],
        { superType: SuperType.ENERGY, name: 'Fairy Energy' },
        { allowCancel: false, min: 0, max: 2 }
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
      });
    }

    // Kaleidostorm
    if (effect instanceof AttackEffect && effect.attack === this.attacks[1]) {
      const player = effect.player;
      return store.prompt(state, new MoveEnergyPrompt(
        player.id,
        GameMessage.MOVE_ENERGY_CARDS,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.ACTIVE, SlotType.BENCH],
        { superType: SuperType.ENERGY },
        { allowCancel: true }
      ), transfers => {
        if (transfers === null) { return; }
        for (const transfer of transfers) {
          const source = StateUtils.getTarget(state, player, transfer.from);
          const target = StateUtils.getTarget(state, player, transfer.to);
          source.moveCardTo(transfer.card, target);
        }
      });
    }

    // Magical Miracle-GX
    if (effect instanceof AttackEffect && effect.attack === this.attacks[2]) {
      const player = effect.player;
      const opponent = effect.opponent;

      if (player.usedGX == true) {
        throw new GameError(GameMessage.LABEL_GX_USED);
      }
      player.usedGX = true;

      const extraEffectCost: CardType[] = [CardType.FAIRY, CardType.FAIRY, CardType.FAIRY, CardType.FAIRY, CardType.FAIRY, CardType.FAIRY];
      const checkProvidedEnergy = new CheckProvidedEnergyEffect(player);
      store.reduceEffect(state, checkProvidedEnergy);
      const meetsExtraEffectCost = StateUtils.checkEnoughEnergy(checkProvidedEnergy.energyMap, extraEffectCost);

      if (meetsExtraEffectCost) {
        opponent.hand.moveTo(opponent.deck);
        return store.prompt(state, new ShuffleDeckPrompt(opponent.id), order => {
          opponent.deck.applyOrder(order);
        });
      }

    }

    return state;
  }
}