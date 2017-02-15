var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketUsers = require('socket.io.users');

//this is backend code
//var deck = require( "./js/backend.js" );

const CARDS = [{
    type: 'money',
    subtype: 'money',
    name: 'M10',
    bankValue: 10,
    desc: 'M10',
    qty: 1
}, {
    type: 'money',
    subtype: 'money',
    name: 'M5',
    bankValue: 5,
    desc: 'M5',
    qty: 2
}, {
    type: 'money',
    subtype: 'money',
    name: 'M4',
    bankValue: 4,
    desc: 'M4',
    qty: 3
}, {
    type: 'money',
    subtype: 'money',
    name: 'M3',
    bankValue: 3,
    desc: 'M3',
    qty: 3
}, {
    type: 'money',
    subtype: 'money',
    name: 'M2',
    bankValue: 2,
    desc: 'M2',
    qty: 5
}, {
    type: 'money',
    subtype: 'money',
    name: 'M1',
    bankValue: 1,
    desc: 'M1',
    qty: 6
}, {
    type: 'action',
    subtype: '',
    name: 'Deal Breaker',
    bankValue: 5,
    desc: 'Steal a complete set of properties from any player. (includes any buildings.) Play into center to use',
    qty: 2
}, {
    type: 'action',
    subtype: '',
    name: 'Debt Collector',
    bankValue: 3,
    desc: 'Force any player to pay you M5.',
    qty: 3
}, {
    type: 'action',
    subtype: 'rent',
    name: 'Double the Rent',
    bankValue: 1,
    desc: 'Needs to be played with a rent card.',
    qty: 2
}, {
    type: 'action',
    subtype: '',
    name: 'Forced Deal',
    bankValue: 3,
    desc: 'Swap any property with another player. (cannot be part of a full set)',
    qty: 3
}, {
    type: 'property',
    subtype: 'hotel',
    name: 'Hotel',
    bankValue: 4,
    desc: 'Add onto any full set you want to add M4 to the rent value (Except railroads and utilities)',
    qty: 2
}, {
    type: 'property',
    subtype: 'house',
    name: 'House',
    bankValue: 3,
    desc: 'Add onto any full set you want to add M3 to the rent value (Except railroads and utilities)',
    qty: 3
}, {
    type: 'action',
    subtype: '',
    name: 'It\'s my Birthday',
    bankValue: 2,
    desc: 'All players give you M2 as a gift. Play in center to use.',
    qty: 3
}, {
    type: 'action',
    subtype: '',
    name: 'Just Say No',
    bankValue: 4,
    desc: 'Use any time when an action card is played against you. Play into center to use',
    qty: 3
}, {
    type: 'action',
    subtype: '',
    name: 'Pass Go',
    bankValue: 1,
    desc: 'Draw 2 extra cards. Play into center to use.',
    qty: 10
}, {
    type: 'action',
    subtype: '',
    name: 'Sly Deal',
    bankValue: 3,
    desc: 'Steal a property from the player of your choice. (cannot be part of a full set)',
    qty: 3
}, {
    type: 'property',
    subtype: 'Brown',
    name: 'Baltic Avenue',
    bankValue: 1,
    desc: '',
    qty: 1,
    rent: [1, 2]
}, {
    type: 'property',
    subtype: 'Brown',
    name: 'Medeteranian Ave',
    bankValue: 1,
    desc: '',
    qty: 1,
    rent: [1, 2]
}, {
    type: 'property',
    subtype: 'Blue',
    name: 'Boardwalk',
    bankValue: 4,
    desc: '',
    qty: 1,
    rent: [3, 8]
}, {
    type: 'property',
    subtype: 'Blue',
    name: 'Park Place',
    bankValue: 4,
    desc: '',
    qty: 1,
    rent: [3, 8]
}, {
    type: 'property',
    subtype: 'Green',
    name: 'North Carolina Ave',
    bankValue: 4,
    desc: '',
    qty: 1,
    rent: [2, 4, 7]
}, {
    type: 'property',
    subtype: 'Green',
    name: 'Pacific Avenue',
    bankValue: 4,
    desc: '',
    qty: 1,
    rent: [2, 4, 7]
}, {
    type: 'property',
    subtype: 'Green',
    name: 'Pennsylvania Avenue',
    bankValue: 4,
    desc: '',
    qty: 1,
    rent: [2, 4, 7]
}, {
    type: 'property',
    subtype: 'LightBlue',
    name: 'Connecticut Avenue',
    bankValue: 1,
    desc: '',
    qty: 1,
    rent: [1, 2, 3]
}, {
    type: 'property',
    subtype: 'LightBlue',
    name: 'Oriental Avenue',
    bankValue: 1,
    desc: '',
    qty: 1,
    rent: [1, 2, 3]
}, {
    type: 'property',
    subtype: 'LightBlue',
    name: 'Vermont Avenue',
    bankValue: 1,
    desc: '',
    qty: 1,
    rent: [1, 2, 3]
}, {
    type: 'property',
    subtype: 'Orange',
    name: 'New York Avenue',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 3, 5]
}, {
    type: 'property',
    subtype: 'Orange',
    name: 'St. James Place',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 3, 5]
}, {
    type: 'property',
    subtype: 'Orange',
    name: 'Tennessee Avenue',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 3, 5]
}, {
    type: 'property',
    subtype: 'Pink',
    name: 'St. Charles Place',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2, 4]
}, {
    type: 'property',
    subtype: 'Pink',
    name: 'Virgina Avenue',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2, 4]
}, {
    type: 'property',
    subtype: 'Pink',
    name: 'States Avenue',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2, 4]
}, {
    type: 'property',
    subtype: 'Black',
    name: 'Short Line',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2, 3, 4]
}, {
    type: 'property',
    subtype: 'Black',
    name: 'B. & O. Railboard',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2, 3, 4]
}, {
    type: 'property',
    subtype: 'Black',
    name: 'Reading Railroad',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2, 3, 4]
}, {
    type: 'property',
    subtype: 'Black',
    name: 'Pennsylvania Railroad',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2, 3, 4]
}, {
    type: 'property',
    subtype: 'Red',
    name: 'Kentucky Avenue',
    bankValue: 3,
    desc: '',
    qty: 1,
    rent: [2, 3, 6]
}, {
    type: 'property',
    subtype: 'Red',
    name: 'Indiana Avenue',
    bankValue: 3,
    desc: '',
    qty: 1,
    rent: [2, 3, 6]
}, {
    type: 'property',
    subtype: 'Red',
    name: 'Illinoise Avenue',
    bankValue: 3,
    desc: '',
    qty: 1,
    rent: [2, 3, 6]
}, {
    type: 'property',
    subtype: 'Mint',
    name: 'Water Works',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2]
}, {
    type: 'property',
    subtype: 'Mint',
    name: 'Electic Company',
    bankValue: 2,
    desc: '',
    qty: 1,
    rent: [1, 2]
}, {
    type: 'property',
    subtype: 'Yellow',
    name: 'Ventnor Avenue',
    bankValue: 3,
    desc: '',
    qty: 1,
    rent: [2, 4, 6]
}, {
    type: 'property',
    subtype: 'Yellow',
    name: 'Marvin Gardens',
    bankValue: 3,
    desc: '',
    qty: 1,
    rent: [2, 4, 6]
}, {
    type: 'property',
    subtype: 'Yellow',
    name: 'Atlanic Avenue',
    bankValue: 3,
    desc: '',
    qty: 1,
    rent: [2, 4, 6]
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['Blue', 'Green'],
    name: 'Blue/Green',
    bankValue: 4,
    desc: 'Play either side up.',
    qty: 1
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['Brown', 'LightBlue'],
    name: 'Brown/LightBlue',
    bankValue: 1,
    desc: 'Play either side up.',
    qty: 1
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['Pink', 'Orange'],
    name: 'Pink/Orange',
    bankValue: 2,
    desc: 'Play either side up.',
    qty: 2
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['Green', 'Black'],
    name: 'Green/Black',
    bankValue: 4,
    desc: 'Play either side up.',
    qty: 1
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['LightBlue', 'Black'],
    name: 'LightBlue/Black',
    bankValue: 4,
    desc: 'Play either side up.',
    qty: 1
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['Mint', 'Black'],
    name: 'Mint/Black',
    bankValue: 1,
    desc: 'Play either side up.',
    qty: 1
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['Red', 'Yellow'],
    name: 'Red/Yellow',
    bankValue: 1,
    desc: 'Play either side up.',
    qty: 2
}, {
    type: 'property',
    subtype: 'wild',
    colors: ['Rainbow'],
    name: 'Rainbow',
    bankValue: 0,
    desc: 'This card can be used as part of any property set. This card has no monetary value.',
    qty: 2
}, {
    type: 'action',
    subtype: 'rent',
    name: 'Blue/Brown',
    bankValue: 1,
    desc: 'All players pay you rent for Properties you own in one of these colors. Play into center to use.',
    qty: 2
}, {
    type: 'action',
    subtype: 'rent',
    name: 'Pink/Orange',
    bankValue: 1,
    desc: 'All players pay you rent for Properties you own in one of these colors. Play into center to use.',
    qty: 2
}, {
    type: 'action',
    subtype: 'rent',
    name: 'Red/Yellow',
    bankValue: 1,
    desc: 'All players pay you rent for Properties you own in one of these colors. Play into center to use.',
    qty: 2
}, {
    type: 'action',
    subtype: 'rent',
    name: 'Blue/Green',
    bankValue: 1,
    desc: 'All players pay you rent for Properties you own in one of these colors. Play into center to use.',
    qty: 2
}, {
    type: 'action',
    subtype: 'rent',
    name: 'Mint/Black',
    bankValue: 1,
    desc: 'All players pay you rent for Properties you own in one of these colors. Play into center to use.',
    qty: 2
}, {
    type: 'action',
    subtype: 'rent',
    name: 'Rainbow',
    bankValue: 3,
    desc: 'Force one player to pay you rent for properties you own in one of these colors.',
    qty: 3
}, ];


var game = {
    deck: shuffle(makeDeck(CARDS)),
    players: [],
    center: [{
    type: '',
    subtype: '',
    name: '',
    bankValue: 0,
    desc: '',
    qty: 0,
    rent: []
}],
}

function makeDeck(CARDS) {
    var newDeck = [];
    for (var i = 0; i < CARDS.length; i++) {
        // multiply card by object.qty to make full deck
        for (var j = 0; j < CARDS[i].qty; j++) {
           newDeck.push(CARDS[i]);
        }
    }
    return newDeck;
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


    //find arrayindex of socket.id in game.players
function getPlayerIndex(id){
    var index = game.players.map(function(o) { return o.id; }).indexOf(id);
    return index;
    console.log("index of " + id + " is " + index);
}

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/js/frontend.js', function(req, res) {
    res.sendfile('js/frontend.js');
});

app.get('/css/style.css', function(req, res) {
    res.sendfile('css/style.css');
});




io.on('connection', function(socket) {

    io.emit('chat message', socket.id + " has connected");
    //add players to game object
    var allConnectedClients = Object.keys(io.sockets.connected);
    console.log(allConnectedClients)
    socket.emit('players', allConnectedClients);

    for (var i=0;i<allConnectedClients.length;i++){
        if(getPlayerIndex(allConnectedClients[i])>=0){
            //they already exist
        }else{
            game.players.push({ id: allConnectedClients[i],
                                hand: [],
                                bank: [],
                                inPlay: [],
                                turn: 0,})
        }
    }

    //inital game data is sent to connected clients
    io.emit('gameData', game);


    // Handles Disconnects
    socket.on('disconnect', function(){
        io.emit('chat message ' + socket.id + ' has left.')
        var playerIndex = getPlayerIndex(socket.id);
        game.players.splice(playerIndex,1); //bye
        console.log(game.players);
        //remove user from game.players
    });

    //Handles chat messages
    socket.on('chat message', function(msg) {
        io.emit('chat message', socket.id + ": " + msg);
    });



    socket.on('drawCards', function(qty) {
        var id = socket.id;

        //Starts a new game
        if(game.center==''){
            io.emit('New Deck', game.deck);
        }

        var playerIndex = getPlayerIndex(socket.id);

        //set backend hand for player
        game.players[playerIndex].hand = game.players[playerIndex].hand || []; //make inHand object
        var cards = [];
        for (var i = 0; i < qty; i++) {
            // backend: gives user cards if there are cards to give
            if (game.deck.length > 0) {
                var card = game.deck.shift(); //remove card from deck
                cards.push(card); //place into players hand

                game.players[playerIndex].hand.push(card);//update backend state

                console.log('added card to user')
                console.log(game.players[playerIndex].hand)
            } else {
                io.emit('chat message', "no more cards!");
                return
            }
        }

        io.emit('chat message', socket.id + " picks up " + qty + " cards");

        var data = { id: socket.id,
                 cards: cards};

        io.emit('gameData', game);
    });


    function sendRentRequest(cardObject, recipient){
        if(cardObject.color !== 'Rainbow'){
            //all players need to pay rentValue

            //figure out how much to charge
            //get quantity of that color in players hand
        }else{

        }
    }

    socket.on('playActionToCenter', function(arrayPosition) {
        //arrayPosition - integer
        //set backend hand for player
        var id = getPlayerIndex(socket.id);
        var toCenter = game.players[id].hand.splice(arrayPosition,1)[0]; //removemove card from hand
        //game.players[id].bank = game.players[id].bank || []; //make inBank object if it doesnt exist
        game.center.push(toCenter); //add to center


        //what did the card do?
        if(toCenter.type=='action'){
            console.log('card played is an action card')
            if(toCenter.subtype == 'rent'){
                sendRentRequest(toCenter,'recipient');
            }
        }


        addTurn(id);

        console.log("Player " + socket.id + " added card to center " + toCenter)

        io.emit('gameData', game);

    });

    socket.on('play', function(arrayPosition, source, target) {
        console.log(socket.id + "has played this card");

        var id = getPlayerIndex(socket.id);
        var card = game.players[id].hand.splice(arrayPosition,1)[0]; //removemove card from hand
        
        console.log('removed card from hand')
        console.log(card)

        if (card.type == 'property') {

            //target can be, newGroup or inPlay[indexNumber]
            //make a new group in inPlay for my card
            console.log('its a property')
            if (target=='newGroup') {
                game.players[id].inPlay.push([card]);
                console.log('target is newGroup')
            }else{
                game.players[id].inPlay[target].push(card);
                console.log('Pushed to group: ' + target)
                console.log(game.players[id].inPlay)

            }
            
        }

        if (card.type == 'action') {
            game.center.splice(0,0,card);
        }

        console.log('sending game data');
        io.emit('gameData',game);
    });

    socket.on('addToBank', function(arrayPosition) {
        //arrayPosition - integer
        //set backend hand for player
        var id = getPlayerIndex(socket.id);
        var toBank = game.players[id].hand.splice(arrayPosition,1)[0]; //removemove card from hand
        game.players[id].bank = game.players[id].bank || []; //make inBank object if it doesnt exist
        game.players[id].bank.push(toBank); //add to bank

        addTurn(id);

        console.log("Player " + socket.id + " added card to bank:")
        console.log(toBank)

        io.emit('gameData', game);

    });

    function addTurn(id){
        game.players[id].turn++; //+1 to turn
        console.log('turn# ' + game.players[id].turn)

        if(game.players[id].turn == 3){
            io.emit('message', socket.id + "turn is over")
            game.players[id].turn=0; //+1 to turn
        }
    }

});

// Socket Users

// end socket users

function findClientsSocket(roomId, namespace) {
    var res = []
        // the default namespace is "/"
        ,
        ns = io.of(namespace || "/");

    if (ns) {
        for (var id in ns.connected) {
            if (roomId) {
                var index = ns.connected[id].rooms.indexOf(roomId);
                if (index !== -1) {
                    res.push(ns.connected[id]);
                }
            } else {
                res.push(ns.connected[id]);
            }
        }
    }
    return res;
}




http.listen(3000, function() {
    console.log('listening on *:3000');
});