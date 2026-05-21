# Pokemon TCG API - Card Data Fetching

This document explains how to fetch card data from the Pokemon TCG API for bulk card generation.

---

## Overview

The `fetch-set-cards.sh` script fetches card data from [pokemontcg.io](https://pokemontcg.io/) API and saves it as `card-data.json` in the appropriate set directory.

---

## Setup

### 1. Get an API Key
1. Go to [pokemontcg.io](https://pokemontcg.io/)
2. Sign up for a free account
3. Get your API key from your account dashboard

### 2. Configure the API Key
Add your API key to the `.env` file in the project root:
```bash
POKEMON_TCG_IO_API=your-api-key-here
```

---

## Usage

### Fetch a Single Set
```bash
./fetch-set-cards.sh <set-id>
```

Examples:
```bash
./fetch-set-cards.sh bw2     # Emerging Powers
./fetch-set-cards.sh sv1     # Scarlet & Violet Base
./fetch-set-cards.sh swsh1   # Sword & Shield
./fetch-set-cards.sh base1   # Base Set
```

### Fetch All Sets
```bash
./fetch-set-cards.sh all                # Fetch all ~100 sets
./fetch-set-cards.sh all --skip-existing  # Skip sets that already have card-data.json
```

---

## Set ID Reference

### Black & White Era
| ID | Set Name |
|----|----------|
| bw1 | Black & White |
| bw2 | Emerging Powers |
| bw3 | Noble Victories |
| bw4 | Next Destinies |
| bw5 | Dark Explorers |
| bw6 | Dragons Exalted |
| bw7 | Boundaries Crossed |
| bw8 | Plasma Storm |
| bw9 | Plasma Freeze |
| bw10 | Plasma Blast |
| bw11 | Legendary Treasures |

### XY Era
| ID | Set Name |
|----|----------|
| xy1 | XY Base |
| xy2 | Flashfire |
| xy3 | Furious Fists |
| xy4 | Phantom Forces |
| xy5 | Primal Clash |
| xy6 | Roaring Skies |
| xy7 | Ancient Origins |
| xy8 | BREAKthrough |
| xy9 | BREAKpoint |
| xy10 | Fates Collide |
| xy11 | Steam Siege |
| xy12 | Evolutions |

### Sun & Moon Era
| ID | Set Name |
|----|----------|
| sm1 | Sun & Moon |
| sm2 | Guardians Rising |
| sm3 | Burning Shadows |
| sm4 | Crimson Invasion |
| sm5 | Ultra Prism |
| sm6 | Forbidden Light |
| sm7 | Celestial Storm |
| sm8 | Lost Thunder |
| sm9 | Team Up |
| sm10 | Unbroken Bonds |
| sm11 | Unified Minds |
| sm12 | Cosmic Eclipse |

### Sword & Shield Era
| ID | Set Name |
|----|----------|
| swsh1 | Sword & Shield |
| swsh2 | Rebel Clash |
| swsh3 | Darkness Ablaze |
| swsh4 | Vivid Voltage |
| swsh5 | Battle Styles |
| swsh6 | Chilling Reign |
| swsh7 | Evolving Skies |
| swsh8 | Fusion Strike |
| swsh9 | Brilliant Stars |
| swsh10 | Astral Radiance |
| swsh11 | Lost Origin |
| swsh12 | Silver Tempest |
| swsh12pt5 | Crown Zenith |

### Scarlet & Violet Era
| ID | Set Name |
|----|----------|
| sv1 | Scarlet & Violet |
| sv2 | Paldea Evolved |
| sv3 | Obsidian Flames |
| sv3pt5 | 151 |
| sv4 | Paradox Rift |
| sv4pt5 | Paldean Fates |
| sv5 | Temporal Forces |
| sv6 | Twilight Masquerade |
| sv6pt5 | Shrouded Fable |
| sv7 | Stellar Crown |
| sv8 | Surging Sparks |

### Classic Sets
| ID | Set Name |
|----|----------|
| base1 | Base Set |
| base2 | Jungle |
| base3 | Fossil |
| base4 | Base Set 2 |
| base5 | Team Rocket |
| gym1 | Gym Heroes |
| gym2 | Gym Challenge |
| neo1 | Neo Genesis |
| neo2 | Neo Discovery |
| neo3 | Neo Revelation |
| neo4 | Neo Destiny |

---

## Output Format

The script saves `card-data.json` in:
```
ptcg-server/src/sets/set-{set-name}/card-data.json
```

### JSON Structure
Each card in the array has:
```json
{
  "id": "bw2-1",
  "name": "Pansage",
  "number": "1",
  "supertype": "Pokémon",
  "subtypes": ["Basic"],
  "hp": "70",
  "types": ["Grass"],
  "evolvesFrom": "PreviousStage",  // if evolution
  "attacks": [
    {
      "name": "Attack Name",
      "cost": ["Grass", "Colorless"],
      "convertedEnergyCost": 2,
      "damage": "30",
      "text": "Effect description."
    }
  ],
  "abilities": [  // if has ability
    {
      "name": "Ability Name",
      "text": "Ability effect.",
      "type": "Ability"
    }
  ],
  "weaknesses": [
    { "type": "Fire", "value": "×2" }
  ],
  "resistances": [
    { "type": "Water", "value": "-20" }
  ],
  "retreatCost": ["Colorless"],
  "rarity": "Common"
}
```

---

## Using Card Data for Bulk Generation

### Workflow
1. Fetch the set data:
   ```bash
   ./fetch-set-cards.sh bw2
   ```

2. The JSON is saved to `set-emerging-powers/card-data.json`

3. Use Claude to read the JSON and generate card implementations:
   ```
   Read the card-data.json for EPO set and implement all the Pokemon cards.
   ```

### Mapping API Data to Card Properties

| API Field | Card Property |
|-----------|---------------|
| `name` | `name` |
| `hp` | `hp` (parse as number) |
| `types[0]` | `cardType` (map to shorthand: Grass→G, Fire→R, etc.) |
| `subtypes` | `stage` (Basic, Stage 1, Stage 2) |
| `evolvesFrom` | `evolvesFrom` |
| `attacks` | `attacks` array |
| `attacks[].cost` | Map to shorthand array |
| `attacks[].damage` | `damage` (parse as number, handle "+" suffix) |
| `attacks[].text` | `text` |
| `abilities` | `powers` array |
| `weaknesses` | `weakness` array |
| `resistances` | `resistance` array |
| `retreatCost.length` | `retreat` array (all Colorless) |
| `number` | `setNumber` |

### Type Mapping
```
Grass → G       Fire → R        Water → W
Lightning → L   Psychic → P     Fighting → F
Dark → D        Metal → M       Colorless → C
Fairy → Y       Dragon → N
```

---

## Rate Limiting

- The API has rate limits
- The script waits 2 seconds between requests when fetching all sets
- Single set fetches don't need rate limiting

---

## Troubleshooting

### "API key not set"
Add `POKEMON_TCG_IO_API=your-key` to `.env` file

### "No cards found"
- Check the set ID is correct
- Some special sets may have different IDs

### Timeout errors
- The script has a 120-second timeout
- Large sets may need multiple attempts
