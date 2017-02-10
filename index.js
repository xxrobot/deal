var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var socketUsers = require('socket.io.users');

//var deck = require( "./js/backend.js" );

var deck = [];
var game = {
    players: []
}

app.get('/', function(req, res) {
    res.sendfile('index.html');
});

app.get('/js/frontend.js', function(req, res) {
    res.sendfile('js/frontend.js');
});

io.on('connection', function(socket) {

    //add players to game object
    // console.log("new connection" + socket.id);
    game.players.push(socket.id);

    var allConnectedClients = Object.keys(io.sockets.connected);
    // console.log('players' + allConnectedClients);
    io.emit('players', allConnectedClients);
    // console.log(io.sockets);


    socket.on('chat message', function(msg) {
        io.emit('chat message', socket.id + ": " + msg);
    });

    socket.on('shuffle', function(msg) {
        io.emit('chat message', 'cards have been shuffled');
        io.emit('New Deck', deck);

        makeDeck(CARDS);
        deck = shuffle(deck);
    });

    socket.on('drawCards', function(qty) {

        var cards = [];
        for (var i = 0; i < qty; i++) {
            console.log(cards);

            if (deck.length > 1) {
                cards.push(deck.shift());
            } else {
                io.emit('chat message', "no more cards! start a new game first");
            }
        }

        io.emit('chat message', socket.id + " is given new cards " + cards);
        socket.emit('receiveCards', cards);
    });


    socket.on('play', function(card) {
        game.players.socket.id.inPlay.push(card);
    });
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
    type: 'action',
    subtype: '',
    name: 'Hotel',
    bankValue: 4,
    desc: 'Add onto any full set you want to add M4 to the rent value (Except railroads and utilities)',
    qty: 2
}, {
    type: 'action',
    subtype: '',
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


function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
    // var shuffled = array;   
}

function makeDeck(CARDS) {
    for (var i = 0; i < CARDS.length; i++) {
        // multiply card by object.qty to make full deck
        for (var j = 0; j < CARDS[i].qty; j++) {
            deck.push(CARDS[i]);
        }
    }
}
