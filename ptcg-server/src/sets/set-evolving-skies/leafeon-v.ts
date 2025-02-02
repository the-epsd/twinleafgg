import { PokemonCard, Stage, CardType, CardTag, PowerType, StoreLike, State, GameMessage, PlayerType, SlotType, ShuffleDeckPrompt, EnergyType, SuperType, AttachEnergyPrompt, StateUtils, CoinFlipPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';


export class LeafeonV extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.GRASS;

  public hp: number = 200;

  public weakness = [{ type: CardType.FIRE }];

  public retreat = [ CardType.COLORLESS ];

  public tags = [CardTag.POKEMON_V];

  public powers = [{
    name: 'Greening Cells',
    useWhenInPlay: true,
    powerType: PowerType.ABILITY,
    text: 'Once during your turn, you may search your deck for a [G] Energy card and attach it to 1 of your Pokémon. Then, shuffle your deck. If you use this Ability, your turn ends.'
  }];

  public attacks = [{
    name: 'Leaf Blade',
    cost: [CardType.GRASS, CardType.COLORLESS, CardType.COLORLESS],
    damage: 90,
    text: 'Flip a coin. If heads, this attack does 60 more damage.'
  }];

  public set: string = 'EVS';

  public regulationMark = 'E';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '7';

  public name: string = 'Leafeon V';

  public fullName: string = 'Leafeon V EVS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
  
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC, name: 'Grass Energy' },
        { allowCancel: true, min: 0, max: 1 },
      ), transfers => {
        transfers = transfers || [];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {
          const target = StateUtils.getTarget(state, player, transfer.to);
          player.deck.moveCardTo(transfer.card, target);
        }
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
        
      const endTurnEffect = new EndTurnEffect(player);
      store.reduceEffect(state, endTurnEffect);
      return state;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
  
      return store.prompt(state, [
        new CoinFlipPrompt(player.id, GameMessage.COIN_FLIP)
      ], result => {
        if (result === true) {
          effect.damage += 60;
        }
      });
    }
  
    return state;
  }
  
}
  