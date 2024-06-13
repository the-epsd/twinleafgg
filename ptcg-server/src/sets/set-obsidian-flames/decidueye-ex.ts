import { PokemonCard, CardType, Stage, PowerType, ChoosePokemonPrompt, GameError, GameMessage, PlayerType, PokemonCardList, SlotType, SpecialCondition, State, StoreLike, StateUtils } from '../../game';
import { PutDamageEffect } from '../../game/store/effects/attack-effects';
import { Effect } from '../../game/store/effects/effect';
import { AttackEffect, PowerEffect } from '../../game/store/effects/game-effects';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';
import { PlayPokemonEffect } from '../../game/store/effects/play-card-effects';

function* useTotalFreedom(next: Function, store: StoreLike, state: State,
  effect: PowerEffect): IterableIterator<State> {
  const player = effect.player;
  const hasBench = player.bench.some(b => b.cards.length > 0);
  
  if (hasBench === false) {
    throw new GameError(GameMessage.CANNOT_PLAY_THIS_CARD);
  }
  
  let targets: PokemonCardList[] = [];
  yield store.prompt(state, new ChoosePokemonPrompt(
    player.id,
    GameMessage.CHOOSE_POKEMON_TO_SWITCH,
    PlayerType.BOTTOM_PLAYER,
    [ SlotType.BENCH ],
    { allowCancel: false }
  ), results => {
    targets = results || [];
    next();
  });
  
  if (targets.length > 0) {
    player.active.clearEffects();
    player.switchPokemon(targets[0]);
    
  }
}

export class Decidueyeex extends PokemonCard {

  public cardType: CardType = CardType.GRASS;

  public stage: Stage = Stage.STAGE_2;

  public evolvesFrom = 'Dartrix';

  public hp: number = 320;

  public weakness = [{ type: CardType.FIRE }];
    
  public retreat = [CardType.COLORLESS, CardType.COLORLESS];
  
  public powers = [
    {
      name: 'Total Freedom',
      useWhenInPlay: true,
      powerType: PowerType.ABILITY,
      text: 'Once during your turn, you may use this Ability. If this Pokémon is on the Bench, switch it with your Active Pokémon. Or, if this Pokémon is in the Active Spot, switch it with 1 of your Benched Pokémon.'
    }
  ];
  
  public attacks = [
    {
      name: 'Hunting Arrow',
      cost: [CardType.GRASS, CardType.COLORLESS],
      damage: 130,
      text: 'This attack also does 30 damage to 1 of your opponent\'s Benched Pokémon. (Don\'t apply Weakness and Resistance for Benched Pokémon.)'
    }
  ];
  
  public set: string = 'SET';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '16';

  public name: string = 'Decidueye rc';

  public fullName: string = 'Decidueye ex OBF';

  public readonly TOTAL_FREEDOM_MARKER = 'TOTAL_FREEDOM_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      player.marker.removeMarker(this.TOTAL_FREEDOM_MARKER, this);
    }

    if (effect instanceof EndTurnEffect) {
      const player = effect.player;
      player.marker.removeMarker(this.TOTAL_FREEDOM_MARKER, this);
    }

    if (effect instanceof PowerEffect && effect.power === this.powers[0]) {
      const generator = useTotalFreedom(() => generator.next(), store, state, effect);
      const player = effect.player;
      if (player.marker.hasMarker(this.TOTAL_FREEDOM_MARKER, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      effect.player.marker.addMarker(this.TOTAL_FREEDOM_MARKER, this);

      player.forEachPokemon(PlayerType.BOTTOM_PLAYER, cardList => {
        if (cardList.getPokemonCard() === this) {
          cardList.addSpecialCondition(SpecialCondition.ABILITY_USED);
        }
      });

      return generator.next().value;
    }

    if (effect instanceof AttackEffect && effect.attack === this.attacks[0]) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
        
      const hasBenched = opponent.bench.some(b => b.cards.length > 0);
      if (!hasBenched) {
        return state;
      }
        
      state = store.prompt(state, new ChoosePokemonPrompt(
        player.id,
        GameMessage.CHOOSE_POKEMON_TO_DAMAGE,
        PlayerType.TOP_PLAYER,
        [ SlotType.BENCH ],
        { min: 1, max: 1, allowCancel: false }
      ), targets => {
        if (!targets || targets.length === 0) {
          return;
        }
        const damageEffect = new PutDamageEffect(effect, 30);
        damageEffect.target = targets[0];
        store.reduceEffect(state, damageEffect);
      });
    }
    return state;
  }
}