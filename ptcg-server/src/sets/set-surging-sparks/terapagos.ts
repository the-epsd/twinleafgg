import { PokemonCard, Stage, CardType, StoreLike, State, GameMessage, GameError, StateUtils, AttachEnergyPrompt, CardTag, CardTarget, EnergyType, PlayerType, SlotType, SuperType } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect } from '../../game/store/effects/game-effects';

export class Terapagos extends PokemonCard {
  public stage: Stage = Stage.BASIC;
  public cardType: CardType = CardType.COLORLESS;
  public hp: number = 120;
  public weakness = [{ type: CardType.FIGHTING }];
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];

  public attacks = [
    {
      name: 'Prism Charge',
      cost: [CardType.COLORLESS],
      damage: 0,
      text: 'Search your deck for up to 3 Basic Energy all of different types, and attach them to your Tera Pokémon in any way you like. Then shuffle your deck.'
    },
    {
      name: 'Hard Tackle',
      cost: [CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS],
      damage: 100,
      text: ''
    }];

  public regulationMark = 'H';
  public set: string = 'SSP';
  public setNumber: string = '161';
  public cardImage: string = 'assets/cardback.png';
  public name: string = 'Terapagos';
  public fullName: string = 'Terapagos SV8';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;

      let teraPokemonInPlay = false;

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card) => {
        if (card.tags.includes(CardTag.POKEMON_TERA)) {
          teraPokemonInPlay = true;
        }
      });

      if (!teraPokemonInPlay) {
        throw new GameError(GameMessage.CANNOT_USE_ATTACK);
      }

      const blocked2: CardTarget[] = [];
      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, (list, card, target) => {
        if (!card.tags.includes(CardTag.POKEMON_TERA)) {
          blocked2.push(target);
        }
      });

      // return store.prompt(state, new ChoosePokemonPrompt(
      //   player.id,
      //   GameMessage.ATTACH_ENERGY_TO_BENCH,
      //   PlayerType.BOTTOM_PLAYER,
      //   [SlotType.BENCH, SlotType.ACTIVE],
      //   { min: 0, max: 2, blocked: blocked2 }
      // ), chosen => {

      //   chosen.forEach(target => {

      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_ACTIVE,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [SlotType.BENCH, SlotType.ACTIVE],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: false, min: 0, max: 3, blockedTo: blocked2 }
      ), transfers => {
        transfers = transfers || [];

        if (transfers.length === 0) {
          return;
        }

        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
        return state;
      });
    }
    return state;
  }
}