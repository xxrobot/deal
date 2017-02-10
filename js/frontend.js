'use strict';


function printAllCards(deck){
	for(var i=0;i<deck.length;i++){
		document.getElementById('debug').append(deck[i].name + " " +deck[i].subtype + " " +deck[i].type + "<br>");
	}
}