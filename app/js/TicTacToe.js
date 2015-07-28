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

	var board = [], undef, grid = 3, size = 100, intelligence = 6;

	/**
	 * Method reset the game. Set all the cells text to empty text and removes css classes
	 * Reset all the values back to their initial values
	 * @private
	 */
	var resetGame = function() {
		$("#board li").text(emptyCellText);
		$("#board li").removeClass('winner-cell');
		count = 0;
		gameIsOver = false;
		winCombination = [];
		board = [];
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
	};

	var won = function(playerCombination) {
		return winCombinations.some(function(combination) {
			if (isSubset(combination, playerCombination)) {
				winCombination = combination;
				return true;
			} else {
				return false;
			}
		});
	};


	/**
	 *
	 * @param {Number} depth
	 * @returns {boolean} true in case there is a winner
	 */
	var chk = function(depth) {
		var xCells = [], oCells = [];
		board.forEach(function(item, index) {
			if (item === 1) {
				xCells.push(index);
			} else if (item === -1) {
				oCells.push(index);
			}
		});

		if (won(xCells)) { return size - depth;}
		if (won(oCells)) { return depth - size;}
	};

	/**
	 *
	 * @param {String} message
	 */
	var gameOver = function(message, tie) {
		var me = this;
		toastr.info(message);
		if (winCombination && !tie) {
			winCombination.forEach(function(item) {
				$('#c-' + item).addClass('winner-cell');
			});
		}
		gameIsOver = true;
	};

	// negamax search with alpha-beta pruning
	// http://en.wikipedia.org/wiki/Negamax
	// http://en.wikipedia.org/wiki/Alpha-beta_pruning
	var search = function(depth, player, alpha, beta){
		var i = grid * grid, min = -size, max, value, next;
		if (value = chk(depth)) // either player won
			return value * player;
		if (intelligence > depth){ // recursion cutoff
			while(i--){
				if (!board[i]){
					board[i] = player;
					value = -search(depth + 1, -player, -beta, -alpha);
					board[i] = undef;
					if (max === undef || value > max) max = value;
					if (value > alpha) alpha = value;
					if (alpha >= beta) return alpha; // prune branch
					if (max > min){ min = max; next = i; } // best odds for next move
				}
			}
		}
		return depth ? max || 0 : next; // 0 is tie game
	};

	var draw = function(cellId, player) {
		$('#c-' + cellId).text(player === 1 ? xName : oName);
		board[cellId] = player;
	};

	/**
	 * Button click handler
	 * @private
	 */
	var onButtonClick = function() {
		var next;
		if (gameIsOver) {
			toastr.warning('The game is over. Restart a new one.');
			return false;
		}

		var id = $(this).context.id.slice(-1);
		if (board[id]) {
			toastr.warning('The cell is already selected');
			return false;
		}
		// draw X
		draw(id, 1);
		if (chk(0) > 0) {
			gameOver('X wins. Restart the game.');
			return false;
		}
		//calculate next move
		next = search(0, 1, -size, size);
		if (next === 0) {
			gameOver('Its a tie. Restart the game.', true);
			return false;
		}
		//draw O
		draw(next, -1);
		if (chk(0) < 0) {
			gameOver('O wins. Restart the game.');
			return false;
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
