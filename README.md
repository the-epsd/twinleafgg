# twinleaf.gg
The project is created to allow players of the Pokemon Trading Card Game to experience current and past formats that are not otherwise accesible in an online, web-based client.

The repo has three pieces:

* **ptcg-server** — Node/TypeScript game server. Owns game state and talks to clients over websockets.
* **ptcg-play-react** — current web client (React + Vite). This is what you want for day-to-day work.
* **ptcg-play** — older Angular client. Still around, but not the main frontend anymore.

## Requirements

* Node.js — see versions below
* npm 7+
* sqlite3 (default) or mysql

Node versions differ a bit by package:

| Package | Node |
|---|---|
| ptcg-server | 18.19+ (below 25) |
| ptcg-play (Angular) | 18.19+ (below 25) |
| ptcg-play-react | **20.19.x only** (Vite 8) |

Easiest path: use Node **20.19.0**. That's what `.nvmrc` pins, and it works for the server and both clients.

```
nvm use
```

Or with `n`:

```
n 20.19.0
```

If you're on something like Node 22/25 and installs start failing, switch down first.

## Server

Express + websockets + TypeORM. Defaults and options live in `ptcg-server/src/config.ts` (override via `config.js` / env as needed).

```
cd ptcg-server
npm install
```

Create `ptcg-server/.env`:

```
STORAGE_TYPE='sqlite'
STORAGE_DATABASE='database.sq3'
SERVER_PASSWORD=''
SERVER_SECRET='!secret!'
```

Start it:

```
npm run start
```

Should be on http://localhost:8080.

If SQLite blows up with a foreign key error on boot, delete `ptcg-server/database.sq3` and start again — it'll recreate the DB.

## React client (ptcg-play-react)

This is the upcoming frontend. Server needs to be running first. Needs Node 20.19.x.

```
cd ptcg-play-react
npm install
```

Optional: copy `.env.example` to `.env.development` if you don't already have one. Default API target is `http://localhost:8080`.

```
npm run dev
```

Vite usually serves at http://localhost:5173. Dev proxy forwards `/v1` and `/socket.io` to the local server.

Production build:

```
npm run build
```

## Angular client (ptcg-play)

Legacy UI, current on live site. Same idea — server running first, then:

```
cd ptcg-play
npm install
npm run start:local
```

That hits http://localhost:4200 and uses the local environment (`apiUrl: http://localhost:8080`).

`npm run build` / `npm run build:prod` if you need a static build.

Note: Angular depends on the local `ptcg-server` package via `file:../ptcg-server`, so install server deps before installing here.

## Credits

Foundation: Keeshii + TheEPSD  
Based on: https://github.com/keeshii/ryuu-play

## License

MIT

-------

# PR Rules for Contributing to twinleaf.gg

## No LLM-generated code

This is non-negotiable.

* Do **not** submit commits, PRs, or card files written by ChatGPT, Claude, Copilot, Cursor agents, or any other LLM.
* You must write and understand the code yourself. If you can't explain every line you submitted, don't submit it.
* LLM-generated stubs, bulk-generated card files, and "AI assisted then lightly edited" PRs will be rejected on sight.
* Screenshots of testing are still required — they do not excuse AI-written implementations.

Setup instructions are above.

**Current formats we're looking to expand (in order of importance):**
1. Standard
2. Expanded
3. RSPK
4. Retro
5. GLC

When submitting PRs for **twinleaf**, cards *must* be tested by you before submitting. To ensure that we know they were tested, submit a screenshot.

Please stick to meta-relevant cards for the format you are submitting the card for. If you are submitting a card for RSPK for example, submitting a PR for a random evolution line that never saw play is not particularly useful as they won't be used.

If you are submitting an evolution line, submit the entire evolution line in one PR.

Submit 1 commit per-PR. The PR should include all new card files, as well as the updated index.

Where possible, use prefabs first. If you do not know what this means or where to find it, go through the codebase more before submitting anything - as it means you may not be ready to contribute.

*All* PRs will be reviewed by me in a dev environment before being pushed to production. Any changes required will be done by the dev who originally submitted the PR.

When submitting a Pokémon, it must be formatted as followed:
```
stage
evolvesFrom [if applicable]
cardTag [if applicable]
cardType
hp
weakness
resistance [if applicable]
retreat

powers

attacks

*the order from this point on is optional but should include*
regulationMark [if applicable]
set
setNumber
cardImage (must always be set as `assets/cardback.png`)
name
fullName
```

*Always* use an energy type's short form, but *only* in the cards info section.
ex.
```public cardType: CardType = L;```
Use CardType.LIGHTNING in the reduceEffect.

When making an attack or ability where it states an energy type, it should be placed in square brackets.
ex.
```text: 'Attach up to 2 [P] Energy cards from your discard pile to 1 of your Pokemon.'```


When submiting a Trainer card, it must be formatted as followed:
```
trainerType
cardTag [if applicable]
regulationMark
set
setNumber
cardImage (must always be set as `assets/cardback.png`)
name
fullName
text
```

When making a Trainer card where it states an energy type, it should be placed in square brackets.
ex.
```'Attach a basic [D] Energy card from your discard pile to 1 of your Benched [D] Pokemon.';```

*Always* copy any text directly from a source that is formatted the same as the actual card.

*Do **NOT*** submit reprints of cards as their own isolated card file. Please see `other-prints` or `full-arts` for that.

**NEVER** change the fullName property of an existing card. This property is stored throughout the database.
