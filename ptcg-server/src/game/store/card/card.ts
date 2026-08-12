import { CardTag, CardType, EnergyType, Format, SuperType } from './card-types';
import { Effect } from '../effects/effect';
import { State } from '../state/state';
import { StoreLike } from '../store-like';
import { CardList } from '../state/card-list';
import { Marker } from '../state/card-marker';
import { Attack, Power } from './pokemon-types';
import { Player } from '../state/player';

export abstract class Card {
  public abstract set: string;

  public abstract superType: SuperType;

  public abstract format: Format;

  public abstract fullName: string;

  public abstract name: string;

  public energyType: EnergyType | undefined;

  public id: number = -1;

  public regulationMark: string = '';

  /**
   * Common properties applied to a card (Rule Box mechanics, labels, owners, etc.)
   * The engine may check these automatically to apply certain effects, for example, deck validation or taking extra Prize cards on KO.
   * Labels with associated rules text/Rule Boxes will have that text dynamically added at runtime. Do not add it manually.
   */
  protected _tags: CardTag[] = [];

  /**
   * Card tags that have been applied to this card during gameplay, e.g. Team Plasma Badge.
   */
  private _runtimeTags: CardTag[] = [];

  /**
   * Getter/setter access method for card tags.
   * This function may be overridden if a specific card needs to check game state (e.g. game format) and return different properties in those scenarios.
   * If you need to check if a card has a tag during gameplay, use hasTag() instead.
   */
  public get tags(): CardTag[] {
    return this._tags;
  }

  public set tags(value: CardTag[]) {
    this._tags = value;
  }

  /**
   * Checks if this card has the specified tag, either naturally or added by some other game effect.
   * @param tag The tag to check
   * @returns `true` if this card has that tag, `false` otherwise
   */
  public hasTag(tag: CardTag): boolean {
    return this.tags.includes(tag) || this._runtimeTags.includes(tag);
  }

  /**
   * Adds a tag to this card during gameplay.
   * @param tag The tag to add
   */
  public addRuntimeTag(tag: CardTag): void {
    this._runtimeTags.push(tag);
  }

  /**
   * Removes a tag to this card during gameplay.
   * @param tag The tag to remove
   */
  public removeRuntimeTag(tag: CardTag): void {
    this._runtimeTags = this._runtimeTags.filter((t, _) => t != tag);
  }

  /**
   * Removes all temporary during-gameplay tags.
   */
  public clearRuntimeTags(): void {
    this._runtimeTags = [];
  }

  public setNumber: string = '';

  public cardImage: string = '';

  public retreat: CardType[] = [];

  public attacks: Attack[] = [];

  public powers: Power[] = [];

  static tags: any;

  public cards: CardList = new CardList();

  public marker = new Marker();

  /**
   * Optional method to check if card can be played without executing effects
   * @returns true if playable, false if not, undefined if check is too complex
   * (in which case we fall back to effect execution)
   */
  public canPlay?(store: StoreLike, state: State, player: Player): boolean | undefined;

  /**
   * Optional check for useFromHandToBench abilities (Excitedive, Swelling Flash, etc.).
   * Assumes bench space and ability-lock are checked by the caller.
   */
  public canUseFromHandToBench?(
    store: StoreLike,
    state: State,
    player: Player,
  ): boolean | undefined;

  public reduceEffect(store: StoreLike, state: State, effect: Effect): State {
    return state;
  }

  public hasRuleBox() {
    return (
      (this.tags.includes(CardTag.POKEMON_ex) && this.regulationMark) || // Gen 3-era ex do not have a Rule box. Separate Mega ex check not necessary
      this.tags.includes(CardTag.POKEMON_V) ||
      this.tags.includes(CardTag.POKEMON_VMAX) ||
      this.tags.includes(CardTag.POKEMON_VSTAR) ||
      this.tags.includes(CardTag.POKEMON_VUNION) ||
      this.tags.includes(CardTag.POKEMON_GX) || // All rule box TAG TEAM mons are Pokémon-GX so an extra check is not necessary
      this.tags.includes(CardTag.POKEMON_EX) || // Same with M EX/Primals/etc.
      this.tags.includes(CardTag.BREAK) ||
      this.tags.includes(CardTag.PRISM_STAR) ||
      this.tags.includes(CardTag.RADIANT)
    );
  }
}
