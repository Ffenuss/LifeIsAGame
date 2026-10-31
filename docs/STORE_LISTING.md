# Play Store listing kit

Everything below is written for the Play Console fields. Replace the highlighted
placeholders before submitting.

## App identity

| Field | Value |
| --- | --- |
| App name | **Life Estate** |
| Package name | `com.lifeestate.game` |
| Default language | English (United States) |
| App or game | Game |
| Category | Board |
| Tags | Board game, Strategy, Single player, Offline, Simulation |
| Pricing | Free |
| Ads | No |
| In-app purchases | No |
| Contains ads | No |
| Made for kids | No (target audience 13+) |

## Short description (80 characters max)

> Grow living colonies, buy the board, and out-earn three rivals.

## Full description (4000 characters max)

> **Your property is alive.**
>
> Life Estate is a 3D board game set on a floating island where every district is a
> living colony. Roll the dice, circle the board, and buy land that grows, breathes,
> and changes every turn.
>
> Each of the 16 properties runs its own cellular life simulation. Healthy colonies
> attract rent. Crowded colonies risk collapse. Upgrade a seedling into a grove and
> its grid expands from 4×4 to 6×6, giving your residents more room to thrive.
>
> **BUY. GROW. COLLECT.**
>
> • 28 handcrafted tiles around a floating garden island
> • 16 living colonies with their own populations and histories
> • Buy properties, seed new cells, harvest income, and upgrade three times
> • 22 mutation and ecosystem cards that reshape the board
> • Three AI rivals with cozy, sharp, and ruthless personalities
> • First estate to $5,000 net worth wins — go broke and you are out
> • A full match takes roughly 20–30 minutes
>
> **BUILT FOR YOUR PHONE**
>
> One-handed portrait play, pinch to zoom, rotate the board, and tap any tile for a
> closer look. Saves automatically so you can stop mid-match and continue later.
>
> **QUIET BY DESIGN**
>
> No ads. No in-app purchases. No accounts. No tracking. No internet permission.
> The whole game runs offline on your device.
>
> Life Estate is an original game. It is not affiliated with, endorsed by, or
> sponsored by any other board game publisher.

## What's new (first release)

> First release: a 28-tile floating board, 16 living colonies, three AI rivals,
> 22 cards, colony upgrades, offline saves, and haptic feedback.

## Graphics checklist

| Asset | Requirement | File |
| --- | --- | --- |
| App icon | 512 × 512 PNG, 32-bit, no alpha | `store/output/icon-512.png` |
| Feature graphic | 1024 × 500 PNG | `store/output/feature-1024x500.png` |
| Phone screenshots | 2–8, 1080 × 1920 | `store/output/phone/01-title.png` … `06-victory.png` |
| 7"/10" tablet screenshots | Optional | `store/output/tablet/01-board.png`, `02-manage.png` |

Screenshots are generated from the real game with `npm run store:capture`.

## Content rating questionnaire

Answer these as follows:

| Question | Answer |
| --- | --- |
| Violence, blood, or gore | No |
| Sexuality or nudity | No |
| Profanity | No |
| Controlled substances | No |
| Gambling with real money or simulated wagering | No |
| User-generated content or chat | No |
| Shares location | No |
| Purchases digital goods | No |
| Ads | No |
| Unrestricted web access | No |

Expected rating: **Everyone / PEGI 3**.

## Data safety answers

| Section | Answer |
| --- | --- |
| Does your app collect or share any required user data types? | **No** |
| Is all user data encrypted in transit? | Not applicable — no data leaves the device |
| Do you provide a way for users to request data deletion? | Not applicable — no data is collected; clearing app storage removes local saves |
| Data collected | None |
| Data shared | None |
| Data processed ephemerally | None |
| Committed to Play Families policy | No — target audience is 13+ |

The Android release manifest requests only `VIBRATE`. There is no `INTERNET`
permission.

## App access

| Question | Answer |
| --- | --- |
| Are any features restricted? | No |
| Login required? | No |
| Special access or credentials? | None |

## Privacy policy

Host `docs/privacy-policy.html` at a public HTTPS URL, replace `YOUR_DEVELOPER_NAME`
and `YOUR_EMAIL_HERE`, then paste the URL into Play Console.

If GitHub Pages is enabled for this repository, the expected URL is:

`https://ffenuss.github.io/LifeIsAGame/privacy-policy.html`

## Contact details

| Field | Value |
| --- | --- |
| Developer name | `YOUR_DEVELOPER_NAME` |
| Support email | `YOUR_EMAIL_HERE` |
| Website | Optional — repository URL is fine |
| Phone | Optional |

## Release notes tone

Keep release notes short and concrete. Example:

> Version 1.0.0 — Life Estate arrives. 28 tiles, 16 living colonies, three rivals,
> and a floating island that grows with every match. Offline, no ads, no tracking.
