console.log('Base Math demo');

//////////

/*
 * Make `child` the first child of `parent`
 */
function prependChild(parent, child) {
	parent.insertBefore(child, parent.children[0]);
}

//////////

function getDigitSet() {
	return document.querySelector('.js-digit-set').value;
}

function addHistoryCommand(command) {
	var history = document.querySelector('.js-history');

	var elem = document.createElement('div');
	elem.className = 'history-command';

	elem.innerHTML = command;

	prependChild(history, elem);
}

function addHistoryResult(result) {
	var history = document.querySelector('.js-history');

	var elem = document.createElement('div');
	elem.className = 'history-result';

	elem.innerHTML = result;

	prependChild(history, elem);
}

function handleInput(input) {
	if (input == "") {
		return;
	}

	var digitSet = getDigitSet();

	var result;
	try {
		result = eval("BaseMath." + input.substring(0, input.length - 1) + ", '" + digitSet + "', '-')");
	}
	catch(e) {
		if (e instanceof Error) {
			result = e;
		}
		else {
			result = JSON.stringify(e);
		}
	}

	addHistoryResult(result);
	addHistoryCommand(input);// Do after so it is above
}

function tryInput() {
	var input = document.querySelector('.js-expr').value;

	document.querySelector('.js-expr').value = "";

	handleInput(input);
}

//////////

document.querySelector('.js-submit').addEventListener('click', tryInput);

window.addEventListener('keydown', function(e) {
	if (e.keyCode == 13) {// enter pressed
		tryInput();
	}
});
