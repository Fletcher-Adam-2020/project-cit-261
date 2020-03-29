// Reset localStorage
function initLocal() {
	localStorage.check = 1;
	localStorage.match = "empty";
	localStorage.tries = 0;
	localStorage.matches = 0;
	localStorage.hints = 3;
	localStorage.star = localStorage.hex = localStorage.arrow = localStorage.bolt = localStorage.circle = 0;
	localStorage.square = localStorage.diamond = localStorage.heart = localStorage.ex = localStorage.moon = 0;
	$("#tries").html(localStorage.tries);
}

function loadSavedGame() {
	if (localStorage.saved) {
		displayCards();
		$("#tries").html(localStorage.tries);
	}
	else
		initGrid();
}

function displayCards() {
	var html = '<div class="row line"><div class="col-sm-1"></div>';
	var row = 0;
	var deck = JSON.parse(localStorage.deck);
	var deckStatus = JSON.parse(localStorage.deckStatus);

	for (var i = 0; i < deck.length; i++) {
		html += '<div class="cardholder col-sm-2"><img src="back.png" class="card" id="' + i + '" onclick="check(this, ' + i + ')"></div>';
		row++;
		if (row == 5) {
			html += '</div><div class="col-sm-1"></div>';
			row = 0;
			if (i < 19)
				html += '<div class="row line"><div class="col-sm-1"></div>';
		}
	}	
	document.getElementById("display").innerHTML = html;

	// Load saved game matches, if any.
	for (var i = 0; i < deck.length; i++) {
		if (deckStatus[i] == "true") {
			flipUp('#' + i, deck[i]);
			$('#' + i).css("background", "darkgreen");
			$('#' + i).attr("src", deck[i] + ".png");
			$('#' + i).prop("onclick", null).off("click");
		}
	}
}

// Initialize, shuffle and display the cards
function initGrid() {
	initLocal();
	// Define the cards, the temporary deck and some utility variables
	var cards = ["star", "hex", "arrow", "bolt", "circle", "square", "diamond", "heart", "ex", "moon"];
	var deck = [];
	var deckStatus = [];
	var r = 0;
	var c = 0;

	// Randomly assign the cards to a position in the deck
	while (deck.length < cards.length * 2) {
		r = Math.floor(Math.random() * 10);
		
		// Ensure there are only ever two copies of a card.
		if (localStorage[cards[r]] == 2) {
		}
		else {
			deck.push(cards[r]);
			deckStatus.push("false");
			localStorage[cards[r]]++;
		}
	}
	localStorage.deck = JSON.stringify(deck);
	localStorage.deckStatus = JSON.stringify(deckStatus);
	localStorage.saved = true;

	displayCards();
	
	// Save the current deck setup; the user can leave and come back!
}

function check(card, index) {
	var deck = JSON.parse(localStorage.deck);
	var shape = deck[index];
	flipUp(card, shape);
	$(card).css("pointer-events", "none");
	if (localStorage.check == null)
		localStorage.check = 1;

	if (localStorage.check > 1) {
		localStorage.check = 1;
			if (localStorage.match == shape) {
				var deckStatus = JSON.parse(localStorage.deckStatus);
				deckStatus[index] = "true";
				deckStatus[localStorage.matchID] = "true";
				$(card).attr("src", shape + ".png");
				$(card).prop("onclick", null).off("click");
				$('#' + localStorage.matchID).prop("onclick", null).off("click");
				$(card).css("background", "darkgreen");
				$('#' + localStorage.matchID).css("background", "darkgreen");
				$(card).css("cursor", "");
				$('#' + localStorage.matchID).css("cursor", "");
				localStorage.tries++;
				localStorage.deckStatus = JSON.stringify(deckStatus);
			}
			else {
				$('.board').css("background", "yellow");
				$(card).css("background", "darkred");
				$('#' + localStorage.matchID).css("background", "darkred");
				$('.card').css("pointer-events", "none");

				var reset = setTimeout(function() {
					$(card).attr("src", "back.png");
					$('#' + localStorage.matchID).attr("src", "back.png");
					$(card).css("background", "");
					$('#' + localStorage.matchID).css("background", "");
					localStorage.matchID = "empty";

					$('.card').css("pointer-events", "auto");

					$('.board').css("background", "");
				}, 1000);
				localStorage.tries++;
			}
	}
	else {
		localStorage.check++;
		localStorage.match = shape;
		localStorage.matchID = index;
		$(card).attr("src", shape + ".png");
	}

	$("#tries").html(localStorage.tries);
}

function flipUp(card, shape) {
	var height = 0;
	var flip = setInterval(function() {
    	if (height == 100) {
      		clearInterval(flip);
    	} else {
	      	height += 1; 
	      	$(card).css("height", height + "%")
    	}
  	}, 1);
	$(card).attr("src", shape + ".png");
}

function hint() {

}

function solve() {
	var deck = JSON.parse(localStorage.deck);
	var deckStatus = [];
	for (var i = 0; i < deck.length; i++) {
		deckStatus.push("true");
	}
	localStorage.deckStatus = JSON.stringify(deckStatus);

	displayCards();
}
