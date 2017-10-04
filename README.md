# GET RAW DATA

## SCRAPE ANGELS (name and account):

https://pixels.camp/angels/

    JSON.stringify( Array.prototype.slice.apply( document.querySelectorAll('.angel .name') ).map( a => [a.textContent.trim(), a.querySelector('a').href.split('/').pop() ] ) )


## SCRAPE ACCEPTED USERS (username):

https://pixels.camp/badges/owners/92 (having accepted badge)

    Array.prototype.slice.apply( document.querySelectorAll('#badges .user a') ).map( a => a.href.split('/').pop() )


## SCRAPE PROJECTS (name and id):

https://pixels.camp/projects/

    TODO REWRITE SELECTOR EXPR


## SCRAPE PROJECT DETAILS

https://pixels.camp/projects/14
https://api.pixels.camp/projects/14

    -> scrape-projects


## SCRAPE USER DETAILS

https://pixels.camp/JosePedroDias
https://api.pixels.camp/users/JosePedroDias

    -> scrape-users


## SCRAPE TRANSACTIONS

http://moon.pixels.camp:8548/events
http://moon.pixels.camp:8548/events/50
...

    -> scrape transactions



# prepare data 1st

angels began with 25000

average users began with ?

most badges earn you 100 (some more)

scavenger hunt earns 50000



ex user wo/ proj (JosePedroDias):
21Eea2ca122f3CcE2d5F1AE6482F5D6109F0193e

ex user w/ proj (anmo):
2aAAD4391e6fa365c0346503DA24B00bDfa3CeB9

ex proj (can i agree):
6720f8fc5383c838ec1b52812bc83fed5d315b85

ex angel (Gamboa):
48e6f88f863c3178f470d92f799c6959fe98e2fe

------

account used to give money to users (initial, badges, etc.)
[3d417b8305aa60688385a1ca56530130c77f8739](http://moon.pixels.camp:8548/account/0x3d417b8305aa60688385a1ca56530130c77f8739)

account used to bankrupt projects
[3aaec243e4d22484061b7123d0686136d9edddb1](http://moon.pixels.camp:8548/account/0x3aaec243e4d22484061b7123d0686136d9edddb1)

untagged accounts:

* [03384a7fcfc9b9872bc1746a275776df4f31e8b7](http://moon.pixels.camp:8548/account/0x03384a7fcfc9b9872bc1746a275776df4f31e8b7)
* [5b77258fa0bb2e24fd5041be372729c316b28294](http://moon.pixels.camp:8548/account/0x5b77258fa0bb2e24fd5041be372729c316b28294)
* [1011e3151cb8fbf5b08041937d521236f31e33cb](http://moon.pixels.camp:8548/account/0x1011e3151cb8fbf5b08041937d521236f31e33cb)
* [f077da9b9813e14fb5d5d44ac25ead05730d4f0d](http://moon.pixels.camp:8548/account/0xf077da9b9813e14fb5d5d44ac25ead05730d4f0d)
* [d065ec24cce987a1bedf6d8bfb4372066151b1dc](http://moon.pixels.camp:8548/account/0xd065ec24cce987a1bedf6d8bfb4372066151b1dc)
* [9189994b239ef8847741af5b845d298c10e18d26](http://moon.pixels.camp:8548/account/0x9189994b239ef8847741af5b845d298c10e18d26)
* [96ab9ff74d8bc56de5abdfcfbcfd29a191fe6519](http://moon.pixels.camp:8548/account/0x96ab9ff74d8bc56de5abdfcfbcfd29a191fe6519)
* [def322688855187fc4f8a777344268d6c4cbd989](http://moon.pixels.camp:8548/account/0xdef322688855187fc4f8a777344268d6c4cbd989)



first event after start of pitches
[452201_1_1](http://moon.pixels.camp:8548/event/452201_1_1)


# Events:

    ....
    #11481 89.7% User David Duarte -- 1500 -> Proj Boothchain
    #11482 89.7% Proj Secret Santa by #include braga -- 4412 -> APPLY_BANKRUPCY
    ....
    #11528 90.1% Proj helpAR -- 288658 -> APPLY_BANKRUPCY
    #11529 90.1% User David Duarte -- 1000 -> Proj Oh Telmo achas? (Oh Telmo, do you really think that?)

# Compute interesting info

See compute.js


# Graph along time

See render.* and data-for-browser.json

use space bar to toggle animation  
right arrow and left arrow to advance/move back one transaction at a time

transaction info on the console