'use strict';
var game = {
    deck: [],
    players: {},
    center: [],
}

const messages = document.getElementById('messages');

function dragstart_handler(ev) {
    console.log("dragStart");
    // Change the source element's background color to signify drag has started
    // ev.currentTarget.style.border = "dashed";
    // Set the drag's format and data. Use the event target's id for the data. Must be a string :(
    var data = {
        arrayPosition: ev.target.getAttribute('data-card-array-position'),
        source: ev.target.getAttribute('data-source'),
        sourceGroup: ev.target.getAttribute('data-group'),
        // targetGroup: ev.target.getAttribute('data-group'),
        sourceId: ev.target.id
    }

    console.log('Dragstart')
    console.log(data)

    var jsonData = JSON.stringify(data);

    ev.dataTransfer.setData("text/plain", jsonData);
}

function dragover_handler(ev) {
    console.log("dragOver");
    ev.preventDefault();
}

function drop_handler(ev) {
    console.log("Drop");
    ev.preventDefault();
    // Get the data, which is the id of the drop target, convert json back to object
    var data = ev.dataTransfer.getData("text");
    var dataObj = JSON.parse(data);

    console.log(dataObj)
        //tell backend i moved card from hand to inplay
    if (ev.target.getAttribute('data-group') !== null) {

        console.log("sending this:" + dataObj.arrayPosition, dataObj.source, dataObj.sourceGroup, ev.target.getAttribute('data-group'))
        playProperty(dataObj.arrayPosition, dataObj.source, dataObj.sourceGroup, ev.target.getAttribute('data-group'))
        

        ev.target.appendChild(document.getElementById(dataObj.sourceId));
        // Clear the drag data cache (for all formats/types)
        ev.dataTransfer.clearData();
    }
}

function drop_handler_bank(ev) {
    ev.preventDefault();
    // Get the data, which is the id of the drop target, convert json back to object
    var data = ev.dataTransfer.getData("text");
    var dataObj = JSON.parse(data);
    addToBank(dataObj.arrayPosition)
    ev.target.appendChild(document.getElementById(dataObj.sourceId));
    ev.dataTransfer.clearData(); // Clear the drag data cache (for all formats/types)
}

function updateGame(data) {
    // console.log('I need to update: ' + data.location)
    socket.emit('chat message', 'i need to update ' + data.location);

    if (data.location == 'all') {

        // make player hands html
        function getActions(type, j) {
            var output = '';

            if (type == 'action') {
                output += '<a class="play-action" onClick="playActionToCenter(' + j + ')">Play Action in Center</a>';
            }
            if (type == 'money' || type == 'action') {
                output += '<a class="add-to-bank" onClick="addToBank(' + j + ')">Add to Bank</a>';
            }
            if (type == 'property') {
                output += '<a class="play-card" onClick="playCard(' + j + ')">Play Card</a>';
            }
            // if (type =='action' && subtype=='rent'){
            //     output += '<a class="chargeRent" onClick="chargeRent('+j+')">Charge Rent</a>';
            // }
            return output;
        }

        function getRents(card) {
            var output = '';
            if (card.type == 'property' && card.subtype != 'wild' && card.subtype != 'house' && card.subtype != 'hotel') {
                for (var i = 0; i < card.rent.length; i++) {
                    output += '<div class="rentValue">M' + card.rent[i] + '</div>';
                }
            }
            return output;
        }

        //        game.players[playerIndex].hand = game.players[playerIndex].hand || []; //make inHand object

        function printCards(cards, source) {
            var output = '';

            if (source == 'inPlay') {
                //you will have cards inside arrays, sorry.
                for (var i = 0; i < cards.length; i++) {
                    output += '<div class="card card-group" data-group=' + [i] + ' id="group' + [i] + '" ondrop="drop_handler(event);" ondragover="dragover_handler(event);">';
                    for (var j = 0; j < cards[i].length; j++) {
                        console.log('wtf is in here', cards)
                        output += '<div id="cardId' + [j] + '" data-group=' + [i] + '  data-source=' + source + ' data-card-array-position=' + [j] + ' class="card card-' + cards[i][j].type + ' subtype-' + cards[i][j].subtype + '" ondragstart="dragstart_handler(event);" draggable="true"">' +
                            '<div class="bank-value"><div class="money-sign"></div>' + cards[i][j].bankValue + '</div>' +
                            '<div class="name">' + cards[i][j].name + '</div>' +
                            '<div class="desc">' + desc + '</div>' +
                            '<div class="rent">' + getRents(cards[i][j]) + '</div>' +
                            '<div class="actions">' + getActions(cards[i][j].type, j) + '</div>' +
                            '</div>';
                    }
                    output += "</div>";
                } //end inplay array
                return output;
            } //end if statement for inPlay

            for (var j = 0; j < cards.length; j++) {
                var desc = cards[j].desc || '';
                output += '<div id="cardId' + [j] + '"  data-source=' + source + ' data-card-array-position=' + [j] + ' class="card card-' + cards[j].type + ' subtype-' + cards[j].subtype + '" ondragstart="dragstart_handler(event);" draggable="true"">' +
                    '<div class="bank-value"><div class="money-sign"></div>' + cards[j].bankValue + '</div>' +
                    '<div class="name">' + cards[j].name + '</div>' +
                    '<div class="desc">' + desc + '</div>' +
                    '<div class="rent">' + getRents(cards[j]) + '</div>' +
                    '<div class="actions">' + getActions(cards[j].type, j) + '</div>' +
                    '</div>';
            }
            return output;
        }

        function printProperties(cards) {
            for (var j = 0; j < cards.length; j++) {
                console.log(cards[j])
                return printCards(cards[j])
            }
        }



        $('#playersCards').empty();
        for (var i = 0; i < game.players.length; i++) {
            $('#playersCards').append('<div id="player-' + game.players[i].id + '" class="player">' +
                '<div class="player-name">' + game.players[i].id + '</div>' +
                '<div class="player-name">' + game.players[i].turn + '</div>' +
                '<div class="flex-container">' +
                '<div class="inPlay"><h4>IN PLAY</h4>' +
                '<div class="flex-container">' +
                printCards(game.players[i].inPlay, 'inPlay') +
                '<div class="card card-group" id="newGroup" data-group="newGroup" ondrop="drop_handler(event);" ondragover="dragover_handler(event);"></div>' +
                '</div>' +
                '</div>' +
                '<div class="bank" ondrop="drop_handler_bank(event);" ondragover="dragover_handler(event);"><h4>BANK</h4>' +
                '<div class="flex-container" >' +
                printCards(game.players[i].bank, 'bank') +
                '</div>' +
                '</div>' +
                '</div>' +
                '<div class="hand hand-' + game.players[i].id + '"><h4>HAND</h4>' +
                '<div class="flex-container">' +
                printCards(game.players[i].hand, 'hand') +
                '</div">' +
                '</div>' +
                '</div>' +
                '</div>');
            // console.log(listOfPlayersWithoutMe[i])
        }

        $('#player-' + socket.id).addClass('my-cards'); //label #myHand with my ID
        $("#drawCards").html('Draw Cards <div class="cardsLeft">' + game.deck.length + '</div>');


        //Update center card
        var lastCenterCard = [game.center[game.center.length - 1]];
        $('#centerCard').html(printCards(lastCenterCard));



        // Chat
        $('#players').empty();
        for (var i = 0; i < game.players.length; i++) {
            $('#players').append($('<li>').text(game.players[i].id));
        }


    }

}

function findWithAttr(array, attr, value) {
    for (var i = 0; i < array.length; i += 1) {
        if (array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}




function endTurn() {
    socket.emit('chat message', socket.id + "'s turn is over");
}

function addToBank(arrayPosition) {
    socket.emit('addToBank', arrayPosition);
}

function playProperty(arrayPosition, source, sourceGroup, targetGroup) {
    socket.emit('playProperty', arrayPosition, source, sourceGroup, targetGroup);
    console.log('asdfasdf', arrayPosition, source, sourceGroup, targetGroup)
}

function playCard(arrayPosition, source, target) {
    socket.emit('play', arrayPosition, source, target);
    console.log(arrayPosition, source, target)
}

function playActionToCenter(arrayPosition) {
    //INTHECENTER
    console.log('position of playtocentercard: ' + arrayPosition)
    socket.emit('playActionToCenter', arrayPosition);
}

function scrollToBottom() {
    messages.scrollTop = messages.scrollHeight;
}


var socket = io();
$('form').submit(function() {
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    return false;
});


socket.on('chat message', function(msg) {
    $('#messages').append($('<li>').text(msg));

    var shouldScroll = messages.scrollTop + messages.clientHeight === messages.scrollHeight;

    // console.log(shouldScroll + "" + (messages.scrollTop + messages.clientHeight) +" "+ messages.scrollHeight);

    //figure out if scroll position is the bottom
    /*
     * Get your messages, we'll just simulate it by appending a new one syncronously.
     */
    // After getting your messages.
    if (!shouldScroll) {
        scrollToBottom();
    }
});


// make new game
$('#drawCards').click(function() {
    socket.emit('chat message', "player " + socket.id + ' wants cards');

    var arrayPosition = findWithAttr(game.players, 'id', socket.id);


    function findPlayerIndex(fruit) {
        return fruit.id === data.id;
    }

    game.players[arrayPosition].hand.length === 0 && drawCards(5);
    game.players[arrayPosition].hand.length > 0 && drawCards(2);

    return false;
});

function drawCards(qty) {
    socket.emit('drawCards', qty);
    game.deck.splice(0, qty); //remove cards from local deck
}

socket.on('New Deck', function(freshDeck) {
    deck = freshDeck;
});

socket.on('gameData', function(gameData) {
    console.log('got new game data:')
    console.log(gameData)

    game = gameData;
    updateGame({
        location: 'all'
    });

});

socket.on('updateBoard', function(game) {
    // console.log(game);
    // updateGame(game); deprecated
});
