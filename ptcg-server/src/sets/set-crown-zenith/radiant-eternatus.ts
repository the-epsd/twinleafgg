import { PokemonCard, CardTag, Stage, CardType, PowerType, StoreLike, State, GameError, GameMessage, Card, ChooseCardsPrompt, SuperType, PokemonCardList, ShuffleDeckPrompt } from '../../game';
import { Effect } from '../../game/store/effects/effect';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

export class RadiantEternatus extends PokemonCard {

  public tags = [CardTag.RADIANT];
  
  public stage = Stage.BASIC;  
  
  public cardType = CardType.DRAGON;
  
  public hp = 170;
  
  public weakness = [];
  
  public resistance = [];
  
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public powers = [{
    name: 'Climactic Gate',
    powerType: PowerType.ABILITY, 
    text: 'When you play this Pokémon from your hand onto your Bench during your turn, you may search your deck for up to 2 Pokémon VMAX and put them onto your Bench. Then, shuffle your deck. If you use this Ability, your turn ends.'
  }];
  
  public attacks = [{
    name: 'Power Beam',
    cost: [CardType.FIRE, CardType.DARK, CardType.COLORLESS],
    damage: 200,
    text: '',
  }];
  
  public set: string = 'CRZ';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '105';

  public name: string = 'Radiant Eternatus';

  public fullName: string = 'Radiant Eternatus CRZ';
  
  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {

      const player = effect.player;
      const slots: PokemonCardList[] = player.bench.filter(b => b.cards.length === 0);

      if (player.deck.cards.length === 0) {
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }
      // Check if bench has open slots
      const openSlots = player.bench.filter(b => b.cards.length === 0);
          
      if (openSlots.length === 0) {
        // No open slots, throw error
        throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
      }

      let cards: Card[] = [];
      const blocked: number[] = [];

      player.deck.cards.forEach((c, index) => {
        if (c instanceof PokemonCard && c.tags.includes(CardTag.POKEMON_VMAX)) {
          blocked.push(index);
        }
      });


      return store.prompt(state, new ChooseCardsPrompt(
        player.id,
        GameMessage.CHOOSE_CARD_TO_PUT_ONTO_BENCH, 
        player.deck,
        { superType: SuperType.POKEMON },
        { min: 0, max: 2, allowCancel: true, blocked }
      ), selected => {

        cards = selected || [];

        cards.forEach((card, index) => {
          player.deck.moveCardTo(card, slots[index]);
          slots[index].pokemonPlayedTurn = state.turn;
        });
    
        return store.prompt(state, new ShuffleDeckPrompt(player.id), order => {
          player.deck.applyOrder(order);

          const endTurnEffect = new EndTurnEffect(player);
          store.reduceEffect(state, endTurnEffect);
          return state;
        });
      });
    }
    return state;
  }
}
