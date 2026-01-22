#!/bin/bash
# Fetch card data for a Pokemon TCG set from pokemontcg.io API
# Usage: ./fetch-set-cards.sh <set-id> [output-dir]
#        ./fetch-set-cards.sh all              # Fetch ALL sets
#
# Examples:
#   ./fetch-set-cards.sh bw2                    # Emerging Powers
#   ./fetch-set-cards.sh sv1                    # Scarlet & Violet Base
#   ./fetch-set-cards.sh swsh1 ./my-output      # Custom output directory
#   ./fetch-set-cards.sh all                    # Fetch all known sets
#   ./fetch-set-cards.sh all --skip-existing    # Skip sets that already have card-data.json

set -e

# Configuration
API_BASE="https://api.pokemontcg.io/v2"
DEFAULT_OUTPUT_DIR="ptcg-server/src/sets"

# Load API key from .env file if it exists
if [ -f ".env" ]; then
    export $(grep -v '^#' .env | grep POKEMON_TCG_IO_API | xargs)
fi

API_KEY="${POKEMON_TCG_IO_API:-}"

if [ -z "$API_KEY" ]; then
    echo -e "${RED}Error: POKEMON_TCG_IO_API not set. Add it to .env or export it.${NC}"
    exit 1
fi

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Get folder name from set ID
get_folder_name() {
    local set_id="$1"
    case "$set_id" in
        # Black & White
        bw1) echo "set-black-and-white" ;;
        bw2) echo "set-emerging-powers" ;;
        bw3) echo "set-noble-victories" ;;
        bw4) echo "set-next-destinies" ;;
        bw5) echo "set-dark-explorers" ;;
        bw6) echo "set-dragons-exalted" ;;
        bw7) echo "set-boundaries-crossed" ;;
        bw8) echo "set-plasma-storm" ;;
        bw9) echo "set-plasma-freeze" ;;
        bw10) echo "set-plasma-blast" ;;
        bw11) echo "set-legendary-treasures" ;;
        bwp) echo "set-bw-promos" ;;
        dv1) echo "set-dragon-vault" ;;

        # XY
        xy1) echo "set-xy" ;;
        xy2) echo "set-flashfire" ;;
        xy3) echo "set-furious-fists" ;;
        xy4) echo "set-phantom-forces" ;;
        xy5) echo "set-primal-clash" ;;
        xy6) echo "set-roaring-skies" ;;
        xy7) echo "set-ancient-origins" ;;
        xy8) echo "set-breakthrough" ;;
        xy9) echo "set-breakpoint" ;;
        xy10) echo "set-fates-collide" ;;
        xy11) echo "set-steam-siege" ;;
        xy12) echo "set-evolutions" ;;
        xyp) echo "set-xy-promos" ;;

        # Sun & Moon
        sm1) echo "set-sun-and-moon" ;;
        sm2) echo "set-guardians-rising" ;;
        sm3) echo "set-burning-shadows" ;;
        sm4) echo "set-crimson-invasion" ;;
        sm5) echo "set-ultra-prism" ;;
        sm6) echo "set-forbidden-light" ;;
        sm7) echo "set-celestial-storm" ;;
        sm8) echo "set-lost-thunder" ;;
        sm9) echo "set-team-up" ;;
        sm10) echo "set-unbroken-bonds" ;;
        sm11) echo "set-unified-minds" ;;
        sm12) echo "set-cosmic-eclipse" ;;
        smp) echo "set-sm-promos" ;;

        # Sword & Shield
        swsh1) echo "set-sword-and-shield" ;;
        swsh2) echo "set-rebel-clash" ;;
        swsh3) echo "set-darkness-ablaze" ;;
        swsh4) echo "set-vivid-voltage" ;;
        swsh5) echo "set-battle-styles" ;;
        swsh6) echo "set-chilling-reign" ;;
        swsh7) echo "set-evolving-skies" ;;
        swsh8) echo "set-fusion-strike" ;;
        swsh9) echo "set-brilliant-stars" ;;
        swsh10) echo "set-astral-radiance" ;;
        swsh11) echo "set-lost-origin" ;;
        swsh12) echo "set-silver-tempest" ;;
        swsh12pt5) echo "set-crown-zenith" ;;
        swshp) echo "set-swsh-promos" ;;

        # Scarlet & Violet
        sv1) echo "set-scarlet-and-violet" ;;
        sv2) echo "set-paldea-evolved" ;;
        sv3) echo "set-obsidian-flames" ;;
        sv3pt5) echo "set-151" ;;
        sv4) echo "set-paradox-rift" ;;
        sv4pt5) echo "set-paldean-fates" ;;
        sv5) echo "set-temporal-forces" ;;
        sv6) echo "set-twilight-masquerade" ;;
        sv6pt5) echo "set-shrouded-fable" ;;
        sv7) echo "set-stellar-crown" ;;
        sv8) echo "set-surging-sparks" ;;
        svp) echo "set-sv-promos" ;;

        # HeartGold SoulSilver
        hgss1) echo "set-heartgold-soulsilver" ;;
        hgss2) echo "set-unleashed" ;;
        hgss3) echo "set-undaunted" ;;
        hgss4) echo "set-triumphant" ;;
        col1) echo "set-call-of-legends" ;;
        hgssp) echo "set-hgss-promos" ;;

        # Diamond & Pearl
        dp1) echo "set-diamond-and-pearl" ;;
        dp2) echo "set-mysterious-treasures" ;;
        dp3) echo "set-secret-wonders" ;;
        dp4) echo "set-great-encounters" ;;
        dp5) echo "set-majestic-dawn" ;;
        dp6) echo "set-legends-awakened" ;;
        dp7) echo "set-stormfront" ;;
        dpp) echo "set-dp-promos" ;;

        # Platinum
        pl1) echo "set-platinum" ;;
        pl2) echo "set-rising-rivals" ;;
        pl3) echo "set-supreme-victors" ;;
        pl4) echo "set-arceus" ;;

        # EX Era
        ex1) echo "set-ex-ruby-and-sapphire" ;;
        ex2) echo "set-ex-sandstorm" ;;
        ex3) echo "set-ex-dragon" ;;
        ex4) echo "set-ex-team-magma-vs-team-aqua" ;;
        ex5) echo "set-ex-hidden-legends" ;;
        ex6) echo "set-ex-firered-and-leafgreen" ;;
        ex7) echo "set-ex-team-rocket-returns" ;;
        ex8) echo "set-ex-deoxys" ;;
        ex9) echo "set-ex-emerald" ;;
        ex10) echo "set-ex-unseen-forces" ;;
        ex11) echo "set-ex-delta-species" ;;
        ex12) echo "set-ex-legend-maker" ;;
        ex13) echo "set-ex-holon-phantoms" ;;
        ex14) echo "set-ex-crystal-guardians" ;;
        ex15) echo "set-ex-dragon-frontiers" ;;
        ex16) echo "set-ex-power-keepers" ;;

        # Classic
        base1) echo "set-base-set" ;;
        base2) echo "set-jungle" ;;
        base3) echo "set-fossil" ;;
        base4) echo "set-base-set-2" ;;
        base5) echo "set-team-rocket" ;;
        gym1) echo "set-gym-heroes" ;;
        gym2) echo "set-gym-challenge" ;;
        neo1) echo "set-neo-genesis" ;;
        neo2) echo "set-neo-discovery" ;;
        neo3) echo "set-neo-revelation" ;;
        neo4) echo "set-neo-destiny" ;;
        ecard1) echo "set-expedition" ;;
        ecard2) echo "set-aquapolis" ;;
        ecard3) echo "set-skyridge" ;;
        lc) echo "set-legendary-collection" ;;

        # Unknown - generate from ID
        *) echo "set-$set_id" ;;
    esac
}

# All known set IDs for batch processing
ALL_SET_IDS="
base1 base2 base3 base4 base5
gym1 gym2
neo1 neo2 neo3 neo4
lc
ecard1 ecard2 ecard3
ex1 ex2 ex3 ex4 ex5 ex6 ex7 ex8 ex9 ex10 ex11 ex12 ex13 ex14 ex15 ex16
dp1 dp2 dp3 dp4 dp5 dp6 dp7 dpp
pl1 pl2 pl3 pl4
hgss1 hgss2 hgss3 hgss4 col1 hgssp
bw1 bw2 bw3 bw4 bw5 bw6 bw7 bw8 bw9 bw10 bw11 bwp dv1
xy1 xy2 xy3 xy4 xy5 xy6 xy7 xy8 xy9 xy10 xy11 xy12 xyp
sm1 sm2 sm3 sm4 sm5 sm6 sm7 sm8 sm9 sm10 sm11 sm12 smp
swsh1 swsh2 swsh3 swsh4 swsh5 swsh6 swsh7 swsh8 swsh9 swsh10 swsh11 swsh12 swsh12pt5 swshp
sv1 sv2 sv3 sv3pt5 sv4 sv4pt5 sv5 sv6 sv6pt5 sv7 sv8 svp
"

# Fetch a single set - simple approach matching original docs
fetch_single_set() {
    local set_id="$1"
    local output_base="$2"
    local skip_existing="$3"

    # Get folder name
    local folder_name
    folder_name=$(get_folder_name "$set_id")

    local output_dir="$output_base/$folder_name"
    local output_file="$output_dir/card-data.json"

    # Skip if exists and flag set
    if [ "$skip_existing" = "true" ] && [ -f "$output_file" ]; then
        echo -e "${YELLOW}Skipping $set_id - card-data.json already exists${NC}"
        return 0
    fi

    echo -e "${GREEN}Fetching cards for set: $set_id${NC}"

    # Create output directory if it doesn't exist
    mkdir -p "$output_dir"

    # Simple fetch - let API handle pagination internally
    local url="$API_BASE/cards?q=set.id:$set_id"

    local response
    response=$(curl -s --max-time 120 -H "X-Api-Key: $API_KEY" "$url")

    # Check for curl error
    if [ $? -ne 0 ]; then
        echo -e "${RED}Error: Failed to fetch from API${NC}"
        return 1
    fi

    # Check for error response
    if echo "$response" | grep -q "error code:"; then
        echo -e "${RED}Error: API returned error${NC}"
        return 1
    fi

    # Extract data and sort by card number
    local card_count
    card_count=$(echo "$response" | jq '.data | length')

    if [ "$card_count" = "0" ] || [ "$card_count" = "null" ]; then
        echo -e "${YELLOW}No cards found for set $set_id${NC}"
        return 0
    fi

    # Save sorted data
    echo "$response" | jq '.data | sort_by(.number | tonumber? // .number)' > "$output_file"

    echo -e "${GREEN}Success! Saved $card_count cards to: $output_file${NC}"
}

# Fetch all sets
fetch_all_sets() {
    local output_base="$1"
    local skip_existing="$2"
    local delay="${3:-2}"  # Delay between requests in seconds

    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Fetching ALL Pokemon TCG sets${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo ""

    local total=0
    local success=0
    local skipped=0
    local failed=0

    for set_id in $ALL_SET_IDS; do
        total=$((total + 1))
        echo -e "${YELLOW}[$total] Processing: $set_id${NC}"

        local folder_name
        folder_name=$(get_folder_name "$set_id")
        local output_file="$output_base/$folder_name/card-data.json"

        # Check if skipping
        if [ "$skip_existing" = "true" ] && [ -f "$output_file" ]; then
            echo -e "${YELLOW}Skipping $set_id - already exists${NC}"
            skipped=$((skipped + 1))
        elif fetch_single_set "$set_id" "$output_base" "false"; then
            success=$((success + 1))
        else
            failed=$((failed + 1))
            echo -e "${RED}Failed to fetch $set_id${NC}"
        fi

        # Rate limiting - wait between requests
        sleep "$delay"
    done

    echo ""
    echo -e "${GREEN}========================================${NC}"
    echo -e "${GREEN}Batch fetch complete!${NC}"
    echo -e "${GREEN}========================================${NC}"
    echo "Total sets: $total"
    echo "Successful: $success"
    echo "Skipped: $skipped"
    echo "Failed: $failed"
}

usage() {
    echo "Usage: $0 <set-id> [output-dir]"
    echo "       $0 all [--skip-existing]"
    echo ""
    echo "Fetch card data for a Pokemon TCG set from pokemontcg.io"
    echo ""
    echo "Arguments:"
    echo "  set-id         The set ID (e.g., bw2, sv1, swsh1) or 'all' for all sets"
    echo "  output-dir     Optional output directory (default: $DEFAULT_OUTPUT_DIR)"
    echo "  --skip-existing  Skip sets that already have card-data.json (for 'all' mode)"
    echo ""
    echo "Examples:"
    echo "  $0 bw2                    # Fetch Emerging Powers"
    echo "  $0 sv1                    # Fetch Scarlet & Violet Base"
    echo "  $0 swsh1 ./custom-dir     # Fetch to custom directory"
    echo "  $0 all                    # Fetch ALL sets (~100 sets)"
    echo "  $0 all --skip-existing    # Fetch only sets missing card-data.json"
    echo ""
    echo "Common Set IDs:"
    echo "  Black & White:    bw1, bw2, bw3, bw4, bw5, bw6, bw7, bw8, bw9, bw10, bw11"
    echo "  XY:               xy1, xy2, xy3, xy4, xy5, xy6, xy7, xy8, xy9, xy10, xy11, xy12"
    echo "  Sun & Moon:       sm1, sm2, sm3, sm4, sm5, sm6, sm7, sm8, sm9, sm10, sm11, sm12"
    echo "  Sword & Shield:   swsh1-swsh12, swsh12pt5"
    echo "  Scarlet & Violet: sv1, sv2, sv3, sv3pt5, sv4, sv4pt5, sv5, sv6, sv6pt5, sv7, sv8"
    echo "  HGSS:             hgss1, hgss2, hgss3, hgss4, col1"
    echo "  D&P/Platinum:     dp1-dp7, pl1-pl4"
    echo "  EX Era:           ex1-ex16"
    echo "  Classic:          base1-base5, gym1-gym2, neo1-neo4, ecard1-ecard3"
    exit 1
}

# Check for required tools
check_dependencies() {
    if ! command -v curl &> /dev/null; then
        echo -e "${RED}Error: curl is required but not installed.${NC}"
        exit 1
    fi

    if ! command -v jq &> /dev/null; then
        echo -e "${RED}Error: jq is required but not installed.${NC}"
        exit 1
    fi
}

# Main script
if [ $# -lt 1 ]; then
    usage
fi

SET_ID=""
OUTPUT_BASE="$DEFAULT_OUTPUT_DIR"
SKIP_EXISTING="false"

# Parse arguments
for arg in "$@"; do
    case "$arg" in
        --skip-existing)
            SKIP_EXISTING="true"
            ;;
        --help|-h)
            usage
            ;;
        *)
            if [ -z "$SET_ID" ]; then
                SET_ID="$arg"
            else
                OUTPUT_BASE="$arg"
            fi
            ;;
    esac
done

if [ -z "$SET_ID" ]; then
    usage
fi

check_dependencies

# Handle "all" mode
if [ "$SET_ID" = "all" ]; then
    fetch_all_sets "$OUTPUT_BASE" "$SKIP_EXISTING"
    exit 0
fi

# Single set mode
fetch_single_set "$SET_ID" "$OUTPUT_BASE" "$SKIP_EXISTING"
