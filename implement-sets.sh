#!/usr/bin/env bash
# implement-sets.sh — Loops through Sun & Moon block sets (through Cosmic Eclipse), invoking Claude per set.
# Usage:
#   ./implement-sets.sh              # Run all sets (skips completed)
#   ./implement-sets.sh --resume     # Same as default (skips completed)
#   ./implement-sets.sh --set SET    # Run a single set only
#   ./implement-sets.sh --dry-run    # Preview without running

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROGRESS_DIR="$SCRIPT_DIR/.claude/set-progress"
LOG_DIR="$SCRIPT_DIR/.claude/set-logs"

mkdir -p "$PROGRESS_DIR" "$LOG_DIR"

# Sword & Shield block sets in release order (through Crown Zenith)
SETS=(
  "set-sword-and-shield"
  "set-rebel-clash"
  "set-darkness-ablaze"
  "set-champions-path"
  "set-vivid-voltage"
  "set-shining-fates"
  "set-battle-styles"
  "set-chilling-reign"
  "set-evolving-skies"
  "set-celebrations"
  "set-fusion-strike"
  "set-brilliant-stars"
  "set-astral-radiance"
  "set-pokemon-go"
  "set-lost-origin"
  "set-silver-tempest"
  "set-crown-zenith"
)

MAX_RETRIES=10
COOLDOWN=30
RETRY_WAIT=60

# Parse arguments
DRY_RUN=false
SINGLE_SET=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    --set)
      if [[ $# -lt 2 ]]; then
        echo "Error: --set requires a set name argument"
        exit 1
      fi
      SINGLE_SET="$2"
      shift 2
      ;;
    --resume)
      shift
      ;;
    *)
      echo "Unknown option: $1"
      echo "Usage: $0 [--resume] [--set SET_NAME] [--dry-run]"
      exit 1
      ;;
  esac
done

# Filter to single set if specified
if [[ -n "$SINGLE_SET" ]]; then
  found=false
  for s in "${SETS[@]}"; do
    if [[ "$s" == "$SINGLE_SET" ]]; then
      found=true
      break
    fi
  done
  if ! $found; then
    echo "Error: Set '$SINGLE_SET' not found in Sword & Shield sets."
    echo "Available sets:"
    printf '  %s\n' "${SETS[@]}"
    exit 1
  fi
  SETS=("$SINGLE_SET")
fi

is_set_complete() {
  local set_name="$1"
  local progress_file="$PROGRESS_DIR/$set_name.json"
  [[ -f "$progress_file" ]] && grep -q '"status"[[:space:]]*:[[:space:]]*"complete"' "$progress_file"
}

print_phase() {
  local set_name="$1"
  local phase="$2"
  local timestamp
  timestamp=$(date +%H:%M:%S)
  case "$phase" in
    starting)     echo "  [$timestamp] $set_name — Starting (generating stubs, classifying cards)" ;;
    implementing) echo "  [$timestamp] $set_name — Implementing (3 agents writing card effects)" ;;
    reviewing)    echo "  [$timestamp] $set_name — Reviewing (3 agents checking implementations)" ;;
    committing)   echo "  [$timestamp] $set_name — Committing (tsc check, git commit)" ;;
    complete)     echo "  [$timestamp] $set_name — Complete" ;;
  esac
}

run_set() {
  local set_name="$1"
  local attempt="$2"
  local timestamp
  timestamp=$(date +%Y%m%d-%H%M%S)
  local log_file="$LOG_DIR/${set_name}-${timestamp}.log"
  local phase_file="$PROGRESS_DIR/${set_name}-phase.txt"

  echo "  Attempt $attempt — logging to $log_file"

  if $DRY_RUN; then
    echo "  [DRY RUN] Would run: claude -p \"/implement-set $set_name\" --dangerously-skip-permissions"
    return 0
  fi

  # Clear phase file
  echo "" > "$phase_file"

  # Run claude in background
  claude -p "/implement-set $set_name" --dangerously-skip-permissions > "$log_file" 2>&1 &
  local claude_pid=$!

  # Poll phase file for status updates
  local last_phase=""
  while kill -0 "$claude_pid" 2>/dev/null; do
    if [[ -f "$phase_file" ]]; then
      local current_phase
      current_phase=$(cat "$phase_file" 2>/dev/null | tr -d '[:space:]')
      if [[ -n "$current_phase" && "$current_phase" != "$last_phase" ]]; then
        print_phase "$set_name" "$current_phase"
        last_phase="$current_phase"
      fi
    fi
    sleep 5
  done

  # Collect exit code
  wait "$claude_pid"
  local exit_code=$?

  # Print final phase if we missed it
  if [[ -f "$phase_file" ]]; then
    local final_phase
    final_phase=$(cat "$phase_file" 2>/dev/null | tr -d '[:space:]')
    if [[ -n "$final_phase" && "$final_phase" != "$last_phase" ]]; then
      print_phase "$set_name" "$final_phase"
    fi
  fi

  # Check for rate limit in log output
  if grep -q "hit your limit\|rate limit\|usage limit" "$log_file" 2>/dev/null; then
    echo "  Rate limit hit. Stopping — no point retrying."
    return 2
  fi

  if [[ $exit_code -eq 0 ]]; then
    echo "  Claude session completed successfully."
    return 0
  else
    echo "  Claude session exited with code $exit_code."
    echo "  Waiting ${RETRY_WAIT}s before retry..."
    sleep "$RETRY_WAIT"
    return 1
  fi
}

# Track results in a temp file (bash 3.2 compatible — no associative arrays)
RESULTS_FILE=$(mktemp)
trap 'rm -f "$RESULTS_FILE"' EXIT

set_result() { echo "$1=$2" >> "$RESULTS_FILE"; }
get_result() { grep "^$1=" "$RESULTS_FILE" 2>/dev/null | tail -1 | cut -d= -f2-; }

echo "========================================"
echo "  Sword & Shield Set Implementation Pipeline"
echo "========================================"
echo ""
echo "Sets to process: ${#SETS[@]}"
echo "Dry run: $DRY_RUN"
echo ""

for set_name in "${SETS[@]}"; do
  echo "----------------------------------------"
  echo "Processing: $set_name"
  echo "----------------------------------------"

  # Check if already complete
  if is_set_complete "$set_name"; then
    echo "  Already complete — skipping."
    set_result "$set_name" "complete (skipped)"
    continue
  fi

  # Retry loop
  success=false
  if $DRY_RUN; then
    run_set "$set_name" 1
    set_result "$set_name" "dry-run"
    success=true
  else
    rate_limited=false
    for attempt in $(seq 1 "$MAX_RETRIES"); do
      run_set "$set_name" "$attempt"
      run_rc=$?
      if [[ $run_rc -eq 2 ]]; then
        # Rate limited — stop the entire pipeline
        set_result "$set_name" "rate-limited"
        rate_limited=true
        break
      elif [[ $run_rc -eq 0 ]]; then
        # Check if set is now complete
        if is_set_complete "$set_name"; then
          echo "  Set $set_name: COMPLETE"
          set_result "$set_name" "complete"
          success=true
          break
        else
          echo "  Session ended but set not marked complete. Waiting ${RETRY_WAIT}s before retry..."
          sleep "$RETRY_WAIT"
        fi
      fi
    done

    if $rate_limited; then
      echo ""
      echo "  Usage/rate limit reached. Exiting now."
      echo "  Resume later with: ./implement-sets.sh"
      exit 2
    fi
  fi

  if ! $success; then
    echo "  Set $set_name: FAILED after $MAX_RETRIES attempts"
    set_result "$set_name" "failed"
  fi

  # Cooldown between sets
  if ! $DRY_RUN && [[ "$set_name" != "${SETS[${#SETS[@]}-1]}" ]]; then
    echo "  Cooling down for ${COOLDOWN}s..."
    sleep "$COOLDOWN"
  fi

  echo ""
done

# Final summary
echo "========================================"
echo "  Final Status Summary"
echo "========================================"
echo ""

for set_name in "${SETS[@]}"; do
  status=$(get_result "$set_name")
  status="${status:-unknown}"
  case "$status" in
    complete*)
      echo "  [DONE] $set_name — $status"
      ;;
    failed)
      echo "  [FAIL] $set_name — failed after $MAX_RETRIES attempts"
      ;;
    *)
      echo "  [????] $set_name — $status"
      ;;
  esac
done

echo ""
echo "Logs saved to: $LOG_DIR/"
echo "Progress files: $PROGRESS_DIR/"
echo "========================================"
