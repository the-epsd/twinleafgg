import { Effect } from '../../game/store/effects/effect';
import { PokemonCard } from '../../game/store/card/pokemon-card';
import { PowerType, StoreLike, State, StateUtils, GameError } from '../../game';
import { Stage, CardType, CardTag } from '../../game/store/card/card-types';
import { CoinFlipEffect, PlayPokemonEffect } from '../../game/store/effects/play-card-effects';
import { GameLog, GameMessage } from '../../game/game-message';
import { AttackEffect } from '../../game/store/effects/game-effects';
import { ABILITY_USED, ADD_MARKER, ADD_POISON_TO_PLAYER_ACTIVE, HAS_MARKER, REMOVE_MARKER, SIMULATE_COIN_FLIP, WAS_ATTACK_USED, WAS_POWER_USED } from '../../game/store/prefabs/prefabs';
import { EndTurnEffect } from '../../game/store/effects/game-phase-effects';

export class SkuntankG extends PokemonCard {

  public stage: Stage = Stage.BASIC;

  public cardType: CardType = CardType.PSYCHIC;

  public tags = [CardTag.POKEMON_SP];

  public hp: number = 80;

  public weakness = [{ type: CardType.FIGHTING }];

  public retreat = [C, C];

  public powers = [{
    name: 'Poison Structure',
    powerType: PowerType.POKEPOWER,
    useWhenInPlay: true,
    text: 'Once during your turn (before your attack), if you have a Stadium card in play, you may use this power. Each Active Pokémon (both yours and your opponent\'s) (excluding Pokémon SP) is now Poisoned. This power can\'t be used if Skuntank is affected by a Special Condition.'
  }];

  public attacks = [{
    name: 'Smokescreen',
    cost: [CardType.COLORLESS, CardType.COLORLESS],
    damage: 20,
    text: 'If the Defending Pokémon tries to attack during your opponent\'s next turn, your opponent flips a coin. If tails, that attack does nothing.'
  }];

  public set: string = 'PL';

  public name: string = 'Skuntank G';

  public fullName: string = 'Skuntank G PL';

  public cardImage: string = 'assets/cardback.png';

  public setNumber: string = '94';

  public readonly POISON_STRUCTURE_MARKER = 'POISON_STRUCTURE_MARKER';

  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    //Poke-Power
    if (WAS_POWER_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      const stadiumCard = StateUtils.getStadiumCard(state);

      if (stadiumCard === undefined) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      const cardList = StateUtils.findCardList(state, stadiumCard);
      const stadiumOwner = StateUtils.findOwner(state, cardList);

      if (stadiumOwner !== player) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (HAS_MARKER(this.POISON_STRUCTURE_MARKER, player, this)) {
        throw new GameError(GameMessage.POWER_ALREADY_USED);
      }

      if (player.active.cards[0] === this && player.active.specialConditions.length > 0) {
        throw new GameError(GameMessage.CANNOT_USE_POWER);
      }

      if (!player.active?.getPokemonCard()?.tags.includes(CardTag.POKEMON_SP)) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, player, this);
      }

      if (!opponent.active?.getPokemonCard()?.tags.includes(CardTag.POKEMON_SP)) {
        ADD_POISON_TO_PLAYER_ACTIVE(store, state, opponent, this);
      }

      ADD_MARKER(this.POISON_STRUCTURE_MARKER, player, this);
      ABILITY_USED(player, this);
    }

    if (effect instanceof PlayPokemonEffect && effect.pokemonCard === this) {
      const player = effect.player;
      REMOVE_MARKER(this.POISON_STRUCTURE_MARKER, player, this);
    }

    //Attack
    if (WAS_ATTACK_USED(effect, 0, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);
      ADD_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, opponent.active, this);
    }

    if (effect instanceof AttackEffect && HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
      const player = effect.player;
      const opponent = StateUtils.getOpponent(state, player);

      try {
        const coinFlip = new CoinFlipEffect(player);
        store.reduceEffect(state, coinFlip);
      } catch {
        return state;
      }

      const coinFlipResult = SIMULATE_COIN_FLIP(store, state, player);

      if (!coinFlipResult) {
        effect.damage = 0;
        store.log(state, GameLog.LOG_ABILITY_BLOCKS_DAMAGE, { name: opponent.name, pokemon: this.name });
      }
    }

    //Marker remover
    if (effect instanceof EndTurnEffect) {
      if (HAS_MARKER(this.POISON_STRUCTURE_MARKER, effect.player, this)) {
        REMOVE_MARKER(this.POISON_STRUCTURE_MARKER, effect.player, this);
      }
      if (HAS_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this)) {
        REMOVE_MARKER(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER, effect.player.active, this);
      }
    }

    return state;
  }

}