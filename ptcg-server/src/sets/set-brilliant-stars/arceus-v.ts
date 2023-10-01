import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, 
  PlayerType, SlotType, GameMessage, ShuffleDeckPrompt, AttachEnergyPrompt, GameError, StateUtils } from '../../game';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';


export class ArceusV extends PokemonCard {

  public tags = [ CardTag.POKEMON_V ];

  public regulationMark = 'F';

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 220;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Trinity Charge',
      cost: [ CardType.COLORLESS, CardType.COLORLESS ],
      damage: 0,
      text: 'Search your deck for up to 3 basic Energy cards and ' +
        'attach them to your Pokémon V in any way you like. Then, ' +
        'shuffle your deck.'
    },
    {
      name: 'Power Edge',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 130,
      text: ''
    }
  ];

  public set: string = 'BRS';

  public name: string = 'Arceus V';

  public fullName: string = 'Arceus V BRS';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      state = store.prompt(state, new AttachEnergyPrompt(
        player.id,
        GameMessage.ATTACH_ENERGY_TO_BENCH,
        player.deck,
        PlayerType.BOTTOM_PLAYER,
        
        [ SlotType.BENCH, SlotType.ACTIVE ],
        { superType: SuperType.ENERGY, energyType: EnergyType.BASIC },
        { allowCancel: true, min: 0, max: 3 },
  
      ), transfers => {
        transfers = transfers || [ ];
        // cancelled by user
        if (transfers.length === 0) {
          return state;
        }
        for (const transfer of transfers) {

          const target = StateUtils.getTarget(state, player, transfer.to);
        
          if (!target.cards[0].tags.includes(CardTag.POKEMON_V) && 
          !target.cards[0].tags.includes(CardTag.POKEMON_VSTAR) &&
          !target.cards[0].tags.includes(CardTag.POKEMON_VMAX)) {
            throw new GameError(GameMessage.INVALID_TARGET);
          }

          if (target.cards[0].tags.includes(CardTag.POKEMON_V) || 
              target.cards[0].tags.includes(CardTag.POKEMON_VSTAR) ||
              target.cards[0].tags.includes(CardTag.POKEMON_VMAX)) {
        
            player.deck.moveCardTo(transfer.card, target); 
          }
        
        }
        
        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });
      });
    }

    return state;
  }
}