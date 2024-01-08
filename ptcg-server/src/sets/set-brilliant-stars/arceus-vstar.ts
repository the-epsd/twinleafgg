import { PokemonCard } from '../../game/store/card/pokemon-card';
import { Stage, CardType, CardTag, SuperType, EnergyType } from '../../game/store/card/card-types';
import { StoreLike, State, 
  PlayerType, SlotType, GameMessage, ShuffleDeckPrompt, PowerType, AttachEnergyPrompt, StateUtils, ChooseCardsPrompt, GameError } from '../../game';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { Effect } from '../../game/store/effects/effect';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';


export class ArceusVSTAR extends PokemonCard {

  public tags = [ CardTag.POKEMON_VSTAR ];

  public regulationMark = 'F';

  public stage: Stage = Stage.VSTAR;

  public evolvesFrom = 'Arceus V';

  public cardType: CardType = CardType.COLORLESS;

  public hp: number = 280;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [ CardType.COLORLESS, CardType.COLORLESS ];

  public attacks = [
    {
      name: 'Trinity Nova',
      cost: [ CardType.COLORLESS, CardType.COLORLESS, CardType.COLORLESS ],
      damage: 200,
      text: 'Search your deck for up to 3 basic energies and attach ' +
        'them to your Pokémon V in any way you like. Then, shuffle ' +
        'your deck.'
    }
  ];

  public powers = [{
    name: 'Starbirth',
    powerType: PowerType.ABILITY,
    useWhenInPlay: true,
    text: 'During your turn, you may search your deck for up to ' +
      '2 cards and put them into your hand. Then, shuffle your ' +
      'deck. (You can\'t use more than 1 VSTAR Power in a game.)'

  }];

  public set: string = 'BRS';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '123';

  public name: string = 'Arceus VSTAR';

  public fullName: string = 'Arceus VSTAR BRS';

  public readonly VSTAR_MARKER = 'VSTAR_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.VSTAR_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const player = effect.player;
      if (player.marker.hasMarker(this.VSTAR_MARKER)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      player.marker.addMarker(this.VSTAR_MARKER, this);
      state = store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_HAND,
        player.deck,
        {},
        { min: 0, max: 2, allowCancel: false }
      ), cards => {
        player.deck.moveCardsTo(cards, player.hand);

        state = store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);
        });

        return state;
      });
    }

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