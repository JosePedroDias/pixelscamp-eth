# GET RAW DATA

##SCRAPE ANGELS (name and account):

https://pixels.camp/angels/

    JSON.stringify( Array.prototype.slice.apply( document.querySelectorAll('.angel .name') ).map( a => [a.textContent.trim(), a.querySelector('a').href.split('/').pop() ] ) )


##SCRAPE ACCEPTED USERS (username):

https://pixels.camp/badges/owners/92 (having accepted badge)

    Array.prototype.slice.apply( document.querySelectorAll('#badges .user a') ).map( a => a.href.split('/').pop() )


## SCRAPE PROJECTS (name and id):

https://pixels.camp/projects/

    TODO REWRITE SELECTOR EXPR


## SCRAPE PROJECT DETAILS

https://pixels.camp/projects/14
https://api.pixels.camp/projects/14

    -> scrape-projects


##SCRAPE USER DETAILS

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



# Compute interesting info

See compute.js


# Graph along time

TODO
