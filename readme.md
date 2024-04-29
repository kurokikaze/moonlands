[![Coverage Status](https://coveralls.io/repos/github/kurokikaze/moonlands/badge.svg?branch=master)](https://coveralls.io/github/kurokikaze/moonlands?branch=master)

# Moonlands

This is the game engine for playing Magi-Nation Duel, with rules enforcement.

## Architecture goals

* No Javascript in cards. Cards should be declarative. Don't mind all the `prompt`, `effect` or `select` calls in cards file - they just add default fields to objects. Card data and code should be separate.
* No code for individual cards. If card does something, it should tie into existing engine capabilities, not just be an "edge case" in game logic. All cards are constructed from the same pieces.
* We have to be able to interact with events as a whole and with their parts. If we want to trigger on (or replace) attack as a whole, we should be able to. If we need to trigger on (or replace) energy loss or creature death in attack - we also should be able to. That's where all this "actions transforming into more actions" scheme comes from.
* The engine have to be extendable, not just cover existing game or sets. If I would want to test custom Creature or Power, I should be able to. Be it Daybreak, custom cards or just a neat card idea.
* The engine needs to have API for bots to connect. I have already written bots for similar game, no point of letting that go to waste. Should be easier to test play too.