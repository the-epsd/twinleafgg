import { CardTarget, PlayerType, SlotType } from '../actions/play-card-action';
import { CardTag } from '../card/card-types';
import { PokemonCard } from '../card/pokemon-card';
import { CardList } from './card-list';
import { Marker } from './card-marker';
import { PokemonCardList } from './pokemon-card-list';
export class Player {

  id: number = 0;

  name: string = '';

  deck: CardList = new CardList();

  hand: CardList = new CardList();

  discard: CardList = new CardList();

  lostzone: CardList = new CardList();

  stadium: CardList = new CardList();

  supporter: CardList = new CardList();

  active: PokemonCardList = new PokemonCardList();

  bench: PokemonCardList[] = [];

  prizes: CardList[] = [];

  supporterTurn: number = 0;

  ancientSupporter: boolean = false;

  retreatedTurn: number = 0;

  energyPlayedTurn: number = 0;

  stadiumPlayedTurn: number = 0;

  stadiumUsedTurn: number = 0;

  marker = new Marker();

  attackMarker = new Marker();

  abilityMarker = new Marker();

  avatarName: string = '';

  usedVSTAR: boolean = false;

  usedGX: boolean = false;

  public readonly DAMAGE_DEALT_MARKER = 'DAMAGE_DEALT_MARKER';

  public readonly ATTACK_USED_MARKER = 'ATTACK_USED_MARKER';
  public readonly ATTACK_USED_2_MARKER = 'ATTACK_USED_2_MARKER';
  public readonly CLEAR_KNOCKOUT_MARKER = 'CLEAR_KNOCKOUT_MARKER';
  public readonly KNOCKOUT_MARKER = 'KNOCKOUT_MARKER';
  public readonly OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER = 'OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER';
  public readonly DEFENDING_POKEMON_CANNOT_RETREAT_MARKER = 'DEFENDING_POKEMON_CANNOT_RETREAT_MARKER';
  public readonly PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER = 'PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER';
  public readonly DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER';
  public readonly DEFENDING_POKEMON_CANNOT_ATTACK_MARKER = 'DEFENDING_POKEMON_CANNOT_ATTACK_MARKER';
  public readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER';
  public readonly DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
  public readonly CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER = 'CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER';
  public readonly PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER: string = 'CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER';
  public readonly PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES = 'PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES';
  public readonly PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';
  public readonly CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER = 'CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER';

  usedRapidStrikeSearchThisTurn: any;
  usedExcitingStageThisTurn: any;
  usedSquawkAndSeizeThisTurn: any;
  usedTurnSkip: any;
  usedTableTurner: any;
  chainsOfControlUsed: any;
  usedDragonsWish = false;
  pecharuntexIsInPlay = false;
  usedFanCall = false;
  canEvolve = false;
  canAttackFirstTurn = false;


  //GX-Attack Dedicated Section
  public usedAlteredCreation: boolean = false;
  public alteredCreationDamage: boolean = false;

  getPrizeLeft(): number {
    return this.prizes.reduce((left, p) => left + p.cards.length, 0);
  }

  forEachPokemon(
    player: PlayerType,
    handler: (cardList: PokemonCardList, pokemonCard: PokemonCard, target: CardTarget) => void
  ): void {
    let pokemonCard = this.active.getPokemonCard();
    let target: CardTarget;

    if (pokemonCard !== undefined) {
      target = { player, slot: SlotType.ACTIVE, index: 0 };
      handler(this.active, pokemonCard, target);
    }

    for (let i = 0; i < this.bench.length; i++) {
      pokemonCard = this.bench[i].getPokemonCard();
      if (pokemonCard !== undefined) {
        target = { player, slot: SlotType.BENCH, index: i };
        handler(this.bench[i], pokemonCard, target);
      }
    }
  }

  removePokemonEffects(target: PokemonCardList) {

    //breakdown of markers to be removed
    this.attackMarker.removeMarker(this.ATTACK_USED_MARKER);
    this.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER);
    this.attackMarker.removeMarker(this.KNOCKOUT_MARKER);
    this.attackMarker.removeMarker(this.CLEAR_KNOCKOUT_MARKER);
    this.attackMarker.removeMarker(this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
    this.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
    this.attackMarker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
    this.attackMarker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
    this.attackMarker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
    this.attackMarker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.attackMarker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
    this.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
    this.attackMarker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.attackMarker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
    this.attackMarker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.attackMarker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
    this.attackMarker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES);
    this.attackMarker.removeMarker(this.PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);
    this.attackMarker.removeMarker(this.CLEAR_PREVENT_ALL_DAMAGE_DONE_BY_OPPONENTS_BASIC_POKEMON_MARKER);

    target.clearEffects();
  }

  vPokemon(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.vPokemon()) {
        result = true;
      }
    });
    return result;
  }

  singleStrike(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.SINGLE_STRIKE))) {
        result = true;
      }
    });
    return result;
  }

  fusionStrike(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.FUSION_STRIKE))) {
        result = true;
      }
    });
    return result;
  }

  rapidStrike(): boolean {
    let result = false;
    this.forEachPokemon(PlayerType.BOTTOM_PLAYER, (cardList, pokemonCard, target) => {
      if (cardList.getPokemons().some(pokemon => pokemon.tags.includes(CardTag.RAPID_STRIKE))) {
        result = true;
      }
    });
    return result;
  }

  switchPokemon(target: PokemonCardList) {
    const benchIndex = this.bench.indexOf(target);
    if (benchIndex !== -1) {
      const temp = this.active;

      //breakdown of markers to be removed on switchPokemon()
      this.attackMarker.removeMarker(this.ATTACK_USED_MARKER);
      this.attackMarker.removeMarker(this.ATTACK_USED_2_MARKER);
      this.attackMarker.removeMarker(this.KNOCKOUT_MARKER);
      this.attackMarker.removeMarker(this.CLEAR_KNOCKOUT_MARKER);
      this.attackMarker.removeMarker(this.OPPONENTS_POKEMON_CANNOT_USE_THAT_ATTACK_MARKER);
      this.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_RETREAT_MARKER);
      this.attackMarker.removeMarker(this.PREVENT_DAMAGE_DURING_OPPONENTS_NEXT_TURN_MARKER);
      this.attackMarker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
      this.attackMarker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_DEALS_LESS_DAMAGE_MARKER);
      this.attackMarker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
      this.attackMarker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_TAKE_LESS_DAMAGE_MARKER);
      this.attackMarker.removeMarker(this.DEFENDING_POKEMON_CANNOT_ATTACK_MARKER);
      this.attackMarker.removeMarker(this.DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
      this.attackMarker.removeMarker(this.CLEAR_DURING_OPPONENTS_NEXT_TURN_DEFENDING_POKEMON_TAKES_MORE_DAMAGE_MARKER);
      this.attackMarker.removeMarker(this.PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
      this.attackMarker.removeMarker(this.CLEAR_PREVENT_DAMAGE_FROM_BASIC_POKEMON_MARKER);
      this.attackMarker.removeMarker(this.PREVENT_ALL_DAMAGE_BY_POKEMON_WITH_ABILITIES);

      this.active.clearEffects();
      this.active = this.bench[benchIndex];
      this.bench[benchIndex] = temp;

      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.active.getPokemonCard()!.movedToActiveThisTurn = true;
    }
  }
}