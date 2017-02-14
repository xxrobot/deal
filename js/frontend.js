'use strict';
var game = {
    deck: [],
    players: {},
    center: [],
}

const messages = document.getElementById('messages');

function updateGame(data) {
    console.log('I need to update: ' + data.location)
    socket.emit('chat message', 'i need to update ' + data.location);

    if(data.location == 'all'){

        // make player hands html
        function getActions(type,j){
            var output='';

            if (type == 'action'){
                output += '<a class="play-action" onClick="playActionToCenter('+j+')">Play Action in Center</a>';
            }
            if (type =='money' || type == 'action'){
                output += '<a class="add-to-bank" onClick="addToBank('+j+')">Add to Bank</a>';
            }
            if (type =='property'){
                output += '<a class="play-card" onClick="playCard('+j+')">Play Card</a>';
            }
            // if (type =='action' && subtype=='rent'){
            //     output += '<a class="chargeRent" onClick="chargeRent('+j+')">Charge Rent</a>';
            // }
            return output;
        }

        function getRents(card){
            var output='';
            if(card.type =='property' && card.subtype != 'wild'
                                      && card.subtype != 'house'
                                      && card.subtype != 'hotel'){
                for (var i=0;i<card.rent.length;i++){
                    output += '<div class="rentValue">M' +card.rent[i]+ '</div>';
                }
            }
            return output;
        }

        //        game.players[playerIndex].hand = game.players[playerIndex].hand || []; //make inHand object

        function printCards(cards){
            var output ='';
            
            // console.log(cards);
            for(var j=0; j<cards.length;j++){

                var desc = cards[j].desc || '';
                output += '<div class="card card-'+cards[j].type+'">' +
                            '<div class="bank-value"><div class="money-sign"></div>' + cards[j].bankValue + '</div>' +
                            '<div class="name">' + cards[j].name + '</div>' +
                            '<div class="desc">' + desc + '</div>' +
                            '<div class="rent">' + getRents(cards[j]) + '</div>' + 
                            '<div class="actions">' + getActions(cards[j].type, j) + '</div>' +
                            '</div>';
            }
            return output;
        }

        $('#playersCards').empty();
            for (var i = 1; i < game.players.length; i++) {
                $('#playersCards').append('<div id="player-' + game.players[i].id + '" class="player">' +
                    '<div class="player-name">' + game.players[i].id + '</div>' +
                    '<div class="player-name">' + game.players[i].turn + '</div>' +
                    '<div class="flex-container">' +
                        '<div class="inPlay"><h4>IN PLAY</h4>'+
                            '<div class="flex-container">'+
                            printCards(game.players[i].inPlay)+
                            '</div>'+
                        '</div>' +
                        '<div class="bank"><h4>BANK</h4>'+
                            '<div class="flex-container">'+
                            printCards(game.players[i].bank)+
                            '</div>'+
                        '</div>' +
                    '</div>' +
                    '<div class="hand hand-' + game.players[i].id + '"><h4>HAND</h4>' +
                        '<div class="flex-container">'+
                            printCards(game.players[i].hand) +
                        '</div">'+
                    '</div>' +
                    '</div>' +
                    '</div>');
                // console.log(listOfPlayersWithoutMe[i])
            }

        $('#player-'+socket.id).addClass('my-cards'); //label #myHand with my ID
        $("#drawCards").html('Draw Cards <div class="cardsLeft">' + game.deck.length + '</div>');


    //Update center card
        var lastCenterCard = [game.center[game.center.length-1]];
        $('#centerCard').html(printCards(lastCenterCard));



    // Chat
    $('#players').empty();
    for (var i = 1; i < game.players.length; i++) {
        $('#players').append($('<li>').text(game.players[i].id));
    }


    }

}

function findWithAttr(array, attr, value) {
    for(var i = 0; i < array.length; i += 1) {
        if(array[i][attr] === value) {
            return i;
        }
    }
    return -1;
}


function updateBoard() {

    function actions(type, arrayPosition) {
        switch (type) {
            case 'money':
                return '<a href="#" onClick="addToBank(' + i + ')" class="addToBank">Add to Bank</a>';
                break;
            case 'action':
                return '<a href="#" onClick="playCard(' + i + ')" class="playCard">Play Card</a>' +
                    '<a href="#" onClick="addToBank(' + i + ')" class="addToBank">Add to Bank</a>';
                break;
            case 'property':
                return '<a href="#" onClick="playCard(' + i + ')" class="playCard">Play Card</a>';;
                break;
        }
    }
    $('#myHand').empty();
    for (var i = 0; i < board.myHand.length; i++) {

        $('#myHand').append('<div class="card ' + board.myHand[i].type + '">' +
            board.myHand[i].name +
            '<div class="desc">' + board.myHand[i].desc + '</div>' +
            '<div class="actions">' +
            actions(board.myHand[i].type, i) +
            '</div>' +
            '</div>');
    }
}


function endTurn() {
    socket.emit('chat message', socket.id + "'s turn is over");
}

function addToBank(arrayPosition) {
    socket.emit('addToBank', arrayPosition);
}

function playCard(arrayPosition) {
    socket.emit('play', arrayPosition);
}

function playActionToCenter(arrayPosition) {
    //INTHECENTER
    console.log('position of playtocentercard: ' +arrayPosition)
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
    game.deck.splice(0,qty); //remove cards from local deck
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
