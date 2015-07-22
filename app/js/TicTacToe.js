/**
 * TicTacToe application module
 * @author Dmitry Burlea
 */
var TicTacToe = (function() {

	/**
	 * All the possible win combinations
	 * @type {Array} winCombinations
	 * @private
	 */
	var winCombinations = [
		[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7],
		[2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7] ];

	/**
	 * Holds value of the current win combination
	 * @type {Array} winCombination
	 */
	var winCombination = [];

	/**
	 *
	 * @type {number} count
	 * Used to determine current turn
	 * @private
	 */
	var count = 0;
	/**
	 *
	 * @type {boolean}
	 * @private
	 */
	var gameIsOver = false;
	/**
	 *
	 * @type {string} xName
	 * @private
	 */
	var xName = 'x';
	/**
	 *
	 * @type {string} yClassName
	 * @private
	 */
	var	oName = 'o';
	/**
	 *
	 * @type {string} emptyCellText
	 * @private
	 */
	var emptyCellText = '-';

	/**
	 * Method reset the game. Set all the cells text to empty text and removes css classes
	 * Reset all the values back to their initial values
	 * @private
	 */
	var resetGame = function() {
		$("#board li").text(emptyCellText);
		$("#board li").removeClass('selected');
		$("#board li").removeClass('winner-cell');
		$("#board li").removeClass(oName);
		$("#board li").removeClass(xName);
		count = 0;
		gameIsOver = false;
		winCombination = [];
	};

	/**
	 * An utility method.
	 * TODO move out to Util module
	 * @param {Array} subset
	 * @param {Array} compareTo
	 * @returns {boolean} true if subset array is a subset of array which we test against
	 */
	var isSubset = function(subset, compareTo) {
		if (!(subset instanceof Array && compareTo instanceof Array)) {
			throw TypeError();
		}
		for (var i=0;i<subset.length;i++) {
			if (compareTo.indexOf(subset[i]) === -1) {
				return false;
			}
		}
		return true;
	}

	/**
	 *
	 * @param {String} playerName The class name of the player ('x' or 'o')
	 * @returns {boolean} true in case there is a winner
	 */
	var weHaveAWinner = function(playerName) {
		//select all the buttons
		var selected = $('.' + playerName),
			selectedIds = [];
		//get the id integer number and push it in the array of selected ids
		for (var i=0;i<selected.length;i++) {
			selectedIds.push(~~(selected[i].id.slice(-1)));
		}
		// if one of the win combinations is a subset of the selected ids then we have the winner
		return winCombinations.some(function(combination) {
			if (isSubset(combination, selectedIds)) {
				winCombination = combination;
				return true;
			} else {
				return false;
			}
		});

	};

	/**
	 *
	 * @param {String} message
	 */
	var gameOver = function(message) {
		var me = this;
		toastr.info(message);
		if (winCombination) {
			winCombination.forEach(function(item) {
				$('#c-' + item).addClass('winner-cell');
			});
		}
		gameIsOver = true;
	};

	/**
	 * Button click handler
	 * @private
	 */
	var onButtonClick = function() {

		if (gameIsOver) {
			toastr.warning('The game is over. Restart a new one.');
			return false;
		}

		if ($(this).hasClass('selected')) {
			toastr.warning('The cell is already selected');
			return false;
		}

		$(this).text(count % 2 == 0 ? oName : xName);
		$(this).addClass('selected ' + (count % 2 == 0 ? oName : xName));


		if (weHaveAWinner(oName))	{
			gameOver('O wins. Restart the game.');
		} else if (weHaveAWinner(xName)) {
			gameOver('X wins. Restart the game.');
		} else if (count == 8)	{
			gameOver('Its a tie. Restart the game.');
		} else {
			count++;
		}
	};

	return {
		/**
		 * Initialize game by adding event handlers to the buttons
		 */
		initializeGame : function() {
			$('#board li').click(onButtonClick);
			$('#reset').click(resetGame);
		}
	};
})();
