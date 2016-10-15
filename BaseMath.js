/**
 * Non-performant base conversion and arithmetic
 * All operations are done by incrementing or decrementing by 1 until the
 *  correct answer is reached
 * https://github.com/Costava/blatant-base-math
 * Version: 0.0.1
 * @constructor
 * @param {object} [o]
 * @param {string} [o.digitSet]
 * @param {string} [o.negativeSign]
 */
function BaseMath(o) {
	if (o == undefined) {
		this.digitSet = BaseMath.defaults.digitSet;
		this.negativeSign = BaseMath.defaults.negativeSign;
	}
	else {
		this.digitSet = o.digitSet || BaseMath.defaults.digitSet;
		this.negativeSign = o.negativeSign || BaseMath.defaults.negativeSign;
	}
}

BaseMath.defaults = {
	digitSet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ',
	negativeSign: '-'
};

/**
 * @typedef {Object} Report
 * @property {string} name
 * @property {boolean} valid
 * @property {string} [reason] - why if not valid
 */

/**
 * @param {number} num
 * @returns {Report}
 */
BaseMath.numberReport = function(num) {
	var report = {
		name: "number"
	};

	if (typeof num == 'number') {
		if (isNaN(num)) {
			report.valid = false;
			report.reason = "is NaN";

			return report;
		}
		else if (num == Infinity || num == -Infinity) {
			report.valid = false;
			report.reason = "is infinite";

			return report;
		}
		else if (Math.floor(num) != num) {
			report.valid = false;
			report.reason = "not an integer";

			return report;
		}
	}
	else {
		report.valid = false;
		report.reason = "not typeof number";

		return report;
	}

	report.valid = true;

	return report;
};

/**
 * @param {string} value
 * @returns {Report}
 */
BaseMath.valueReport = function(value) {
	var report = {
		name: "value"
	};

	if (typeof value == 'string') {
		if (value.length == 0) {
			report.valid = false;
			report.reason = "empty string";

			return report;
		}
	}
	else {
		report.valid = false;
		report.reason = "not typeof string"

		return report;
	}

	report.valid = true;

	return report;
};

/**
 * @param {number} base
 * @returns {Report}
 */
BaseMath.baseReport = function(base) {
	var report = {
		name: "base"
	};

	if (typeof base == 'number') {
		if (isNaN(base)) {
			report.valid = false;
			report.reason = "is NaN";

			return report;
		}
		else if (base == Infinity || base == -Infinity) {
			report.valid = false;
			report.reason = "is infinite";

			return report;
		}
		else if (Math.floor(base) != base) {
			report.valid = false;
			report.reason = "not an integer";

			return report;
		}
		else if (base < 2) {
			report.valid = false;
			report.reason = "is less than 2";

			return report;
		}
	}
	else {
		report.valid = false;
		report.reason = "not typeof number";

		return report;
	}

	report.valid = true;

	return report;
};

/**
 * @param {string} digitSet
 * @param {number} base
 * @returns {Report}
 */
BaseMath.digitSetReport = function(digitSet, base) {
	var report = {
		name: "digitSet"
	};

	if (typeof digitSet == 'string') {
		if (digitSet.length < base) {
			report.valid = false;
			report.reason = "too short for the base";

			return report;
		}
	}
	else {
		report.valid = false;
		report.reason = "not typeof string";

		return report;
	}

	report.valid = true;

	return report;
};

/**
 * @param {string} negativeSign
 * @returns {Report}
 */
BaseMath.negativeSignReport = function(negativeSign) {
	var report = {
		name: "negativeSign"
	};

	if (typeof negativeSign == 'string') {
		if (negativeSign.length != 1) {
			report.valid = false;
			report.reason = "not a single character";

			return report;
		}
	}
	else {
		report.valid = false;
		report.reason = "not typeof string";

		return report;
	}

	report.valid = true;

	return report;
};

/**
 * Raise (nonnegative, integer) `value` by one. Does not check validity of arguments
 * @param {string} value - a nonnegative integer in `base`
 * @param {number} base
 * @param {string} digitSet
 * @returns {string}
 */
BaseMath._raise = function(value, base, digitSet) {
	var highestDigit = digitSet[base - 1];

	var index = value.length - 1;

	while (value[index] == highestDigit) {
		value = value.substring(0, index) + digitSet[0] + value.substring(index + 1);

		index -= 1;

		if (index < 0) {
			break;
		}
	}

	if (index >= 0) {
		var currentDigitIndex = digitSet.indexOf(value[index]);

		if (currentDigitIndex == -1) {
			throw new Error("Unknown digit present in `value`: " + value[index]);
		}

		return value.substring(0, index) + digitSet[currentDigitIndex + 1] + value.substring(index + 1);
	}
	else {// index < 0
		return digitSet[1] + value;
	}
};

/**
 * Lower (nonnegative, integer) `value` by one. Does not check validity of arguments.
 * @param {string} value - a nonnegative integer in `base`
 * @param {number} base
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._lower = function(value, base, digitSet, negativeSign) {
	if (value == digitSet[0]) {
		return negativeSign + digitSet[1];
	}

	var highestDigit = digitSet[base - 1];
	var lowestDigit = digitSet[0];

	var index = value.length - 1;

	while (value[index] == lowestDigit) {
		value = value.substring(0, index) + highestDigit + value.substring(index + 1);

		index -= 1;

		if (index < 0) {
			break;
		}
	}

	var currentDigitIndex = digitSet.indexOf(value[index]);

	if (currentDigitIndex == -1) {
		throw new Error("Unknown digit present in `value`: " + value[index]);
	}
	else if (index == 0 && value.length > 1 && currentDigitIndex == 1) {
		return value.substring(1);
	}

	return value.substring(0, index) + digitSet[currentDigitIndex - 1] + value.substring(index + 1);
};

/**
 * Returns absolute value of `value`. Does not check validity of arguments
 * @param {string} value
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._abs = function(value, negativeSign) {
	if (value[0] == negativeSign) {
		return value.substring(1);
	}

	return value;
};

BaseMath._ensureNegative = function(value, negativeSign) {
	if (value[0] != negativeSign) {
		return negativeSign + value;
	}

	return value;
};

/**
 * @param {string} value
 * @param {string} negativeSign
 * @returns {boolean}
 */
BaseMath._isNegative = function(value, negativeSign) {
	return value[0] == negativeSign;
};

/**
 * @param {string} value
 * @param {string} negativeSign
 * @returns {boolean}
 */
BaseMath._isPositive = function(value, negativeSign) {
	return value[0] != negativeSign;
};

/**
 * @param {string} value
 * @param {string} negativeSign
 * @returns {boolean}
 */
BaseMath._isZero = function(value, digitSet) {
	return value == digitSet[0];
};

/**
 * Increment (integer) `value` by one. Throws an error if arguments are invalid to increment with.
 * @param {string} value - an integer in `base`
 * @param {number} base - integer
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath.increment = function(value, base, digitSet, negativeSign) {
	var valueReport = BaseMath.valueReport(value);

	if (!valueReport.valid) {
		throw valueReport;
	}

	var baseReport = BaseMath.baseReport(base);

	if (!baseReport.valid) {
		throw baseReport;
	}

	var digitSetReport = BaseMath.digitSetReport(digitSet, base);

	if (!digitSetReport.valid) {
		throw digitSetReport;
	}

	var negativeSignReport = BaseMath.negativeSignReport(negativeSign);

	if (!negativeSignReport.valid) {
		throw negativeSignReport;
	}

	// arguments are valid

	return BaseMath._increment(value, base, digitSet, negativeSign);
};

/**
 * Like .increment, but without the argument checking
 * @param {string} value - an integer in `base`
 * @param {number} base - integer
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._increment = function(value, base, digitSet, negativeSign) {
	if (BaseMath._isPositive(value, negativeSign) || BaseMath._isZero(value, digitSet)) {
		return BaseMath._raise(value, base, digitSet);
	}

	var abs = BaseMath._abs(value, negativeSign);

	var newMagnitude = BaseMath._lower(abs, base, digitSet, negativeSign);

	if (BaseMath._isZero(newMagnitude, digitSet)) {
		return newMagnitude;
	}

	return negativeSign + newMagnitude;
};

/**
 * @param {string} value
 * @param {string} base
 * @returns {string}
 */
BaseMath.prototype.increment = function(value, base) {
	return BaseMath.increment(value, base, this.digitSet, this.negativeSign);
};

/**
 * Decrement (integer) `value` by one. Throws if arguments are invalid to increment with.
 * @param {string} value - an integer in `base`
 * @param {number} base - integer
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath.decrement = function(value, base, digitSet, negativeSign) {
	var valueReport = BaseMath.valueReport(value);

	if (!valueReport.valid) {
		throw valueReport;
	}

	var baseReport = BaseMath.baseReport(base);

	if (!baseReport.valid) {
		throw baseReport;
	}

	var digitSetReport = BaseMath.digitSetReport(digitSet, base);

	if (!digitSetReport.valid) {
		throw digitSetReport;
	}

	var negativeSignReport = BaseMath.negativeSignReport(negativeSign);

	if (!negativeSignReport.valid) {
		throw negativeSignReport;
	}

	// arguments are valid

	return BaseMath._decrement(value, base, digitSet, negativeSign);
};

/**
 * Like .decrement, but without the argument checking
 * @param {string} value - an integer in `base`
 * @param {number} base - integer
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._decrement = function(value, base, digitSet, negativeSign) {
	if (BaseMath._isPositive(value, negativeSign) || BaseMath._isZero(value, digitSet)) {
		return BaseMath._lower(value, base, digitSet, negativeSign);
	}

	var abs = BaseMath._abs(value, negativeSign);

	return negativeSign + BaseMath._raise(abs, base, digitSet, negativeSign);
};

/**
 * @param {string} value
 * @param {string} base
 * @returns {string}
 */
BaseMath.prototype.decrement = function(value, base) {
	return BaseMath.decrement(value, base, this.digitSet, this.negativeSign);
};

/**
 * Convert `number` into `base`
 * @param {number} number
 * @param {number} base - integer
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath.convertNumber = function(number, base, digitSet, negativeSign) {
	var numberReport = BaseMath.numberReport(number);

	if (!numberReport.valid) {
		throw numberReport;
	}

	var baseReport = BaseMath.baseReport(base);

	if (!baseReport.valid) {
		throw baseReport;
	}

	var digitSetReport = BaseMath.digitSetReport(digitSet, base);

	if (!digitSetReport.valid) {
		throw digitSetReport;
	}

	var negativeSignReport = BaseMath.negativeSignReport(negativeSign);

	if (!negativeSignReport.valid) {
		throw negativeSignReport;
	}

	// arguments are valid

	return BaseMath._convertNumber(number, base, digitSet, negativeSign);
};

/**
 * @param {number} number
 * @param {number} base - to this base
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._convertNumber = function(number, base, digitSet, negativeSign) {
	var value = digitSet[0];

	// Cannot simply use String(number) because
	// e.g. String(1e145) => "1e+145"

	if (number > 0) {
		while (number > 0) {
			number -= 1;

			value = BaseMath._increment(value, base, digitSet, negativeSign);
		}
	}
	else {
		while (number < 0) {
			number += 1;

			value = BaseMath._decrement(value, base, digitSet, negativeSign);
		}
	}

	return value;
};

/**
 * @param {number} number
 * @param {number} base - integer
 * @returns {string}
 */
BaseMath.prototype.convertNumber = function(number, base) {
	return BaseMath.convertNumber(number, base, this.digitSet, this.negativeSign);
};

/**
 * @param {string} value
 * @param {number} fromBase
 * @param {number} toBase
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath.convert = function(value, fromBase, toBase, digitSet, negativeSign) {
	var valueReport = BaseMath.valueReport(value);

	if (!valueReport.valid) {
		throw valueReport;
	}

	var fromBaseReport = BaseMath.baseReport(fromBase);

	if (!fromBaseReport.valid) {
		throw fromBaseReport;
	}

	var toBaseReport = BaseMath.baseReport(toBase);

	if (!toBaseReport.valid) {
		throw toBaseReport;
	}

	var digitSetReport = BaseMath.digitSetReport(digitSet, Math.max(fromBase, toBase));

	if (!digitSetReport.valid) {
		throw digitSetReport;
	}

	var negativeSignReport = BaseMath.negativeSignReport(negativeSign);

	if (!negativeSignReport.valid) {
		throw negativeSignReport;
	}

	// arguments are valid

	return BaseMath._convert(value, fromBase, toBase, digitSet, negativeSign);
};

/**
 * @param {string} value
 * @param {number} fromBase
 * @param {number} toBase
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._convert = function(value, fromBase, toBase, digitSet, negativeSign) {
	if (BaseMath._isZero(value, digitSet)) {
		return value;// zero is the same in all bases
	}

	var newValue = digitSet[0];

	if (BaseMath._isPositive(value, negativeSign)) {
		while (!BaseMath._isZero(value, digitSet)) {
			newValue = BaseMath._increment(newValue, toBase, digitSet, negativeSign);

			value = BaseMath._decrement(value, fromBase, digitSet, negativeSign);
		}
	}
	else {// value is negative
		while (!BaseMath._isZero(value, digitSet)) {
			newValue = BaseMath._decrement(newValue, toBase, digitSet, negativeSign);

			value = BaseMath._increment(value, fromBase, digitSet, negativeSign);
		}
	}

	return newValue;
};

/**
 * @param {string} value
 * @param {number} fromBase
 * @param {number} toBase
 * @returns {string}
 */
BaseMath.prototype.convert = function(value, fromBase, toBase) {
	return BaseMath.convert(value, fromBase, toBase, this.digitSet, this.negativeSign);
};

/**
 * Returns the `base1` number of `value1` with `value2` in `base2` added to it
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string} - in `base1`
 */
BaseMath.add = function(value1, base1, value2, base2, digitSet, negativeSign) {
	var value1Report = BaseMath.valueReport(value1);

	if (!value1Report.valid) {
		throw value1Report;
	}

	var base1Report = BaseMath.baseReport(base1);

	if (!base1Report.valid) {
		throw base1Report;
	}

	var value2Report = BaseMath.valueReport(value2);

	if (!value2Report.valid) {
		throw value2Report;
	}

	var base2Report = BaseMath.baseReport(base2);

	if (!base2Report.valid) {
		throw base2Report;
	}

	var highestBase = Math.max(base1, base2);

	var digitSetReport = BaseMath.digitSetReport(digitSet, highestBase);

	if (!digitSetReport.valid) {
		throw digitSetReport;
	}

	var negativeSignReport = BaseMath.negativeSignReport(negativeSign);

	if (!negativeSignReport.valid) {
		throw negativeSignReport;
	}

	return BaseMath._add(value1, base1, value2, base2, digitSet, negativeSign);
};

/**
 * Like .add but does not check validity of arguments
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._add = function(value1, base1, value2, base2, digitSet, negativeSign) {
	if (BaseMath._isZero(value2, digitSet)) {
		return value1;
	}

	if (BaseMath._isPositive(value2, negativeSign)) {
		while (!BaseMath._isZero(value2, digitSet)) {
			value1 = BaseMath._increment(value1, base1, digitSet, negativeSign);

			value2 = BaseMath._decrement(value2, base2, digitSet, negativeSign);
		}
	}
	else {
		while (!BaseMath._isZero(value2, digitSet)) {
			value1 = BaseMath._decrement(value1, base1, digitSet, negativeSign);

			value2 = BaseMath._increment(value2, base2, digitSet, negativeSign);
		}
	}

	return value1;
};

/**
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @returns {string}
 */
BaseMath.prototype.add = function(value1, base1, value2, base2) {
	return BaseMath.add(value1, base1, value2, base2, this.digitSet, this.negativeSign);
};

/**
 * Return `value1` in `base1` after subtracting `value2` in `base2` from it
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath.subtract = function(value1, base1, value2, base2, digitSet, negativeSign) {
	var value1Report = BaseMath.valueReport(value1);

	if (!value1Report.valid) {
		throw value1Report;
	}

	var base1Report = BaseMath.baseReport(base1);

	if (!base1Report.valid) {
		throw base1Report;
	}

	var value2Report = BaseMath.valueReport(value2);

	if (!value2Report.valid) {
		throw value2Report;
	}

	var base2Report = BaseMath.baseReport(base2);

	if (!base2Report.valid) {
		throw base2Report;
	}

	var highestBase = Math.max(base1, base2);

	var digitSetReport = BaseMath.digitSetReport(digitSet, highestBase);

	if (!digitSetReport.valid) {
		throw digitSetReport;
	}

	var negativeSignReport = BaseMath.negativeSignReport(negativeSign);

	if (!negativeSignReport.valid) {
		throw negativeSignReport;
	}

	return BaseMath._subtract(value1, base1, value2, base2, digitSet, negativeSign);
};

/**
 * Like .subtract but does not check validity of arguments
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._subtract = function(value1, base1, value2, base2, digitSet, negativeSign) {
	if (BaseMath._isZero(value2, digitSet)) {
		return value1;
	}

	if (BaseMath._isPositive(value2, negativeSign)) {
		while (!BaseMath._isZero(value2, digitSet)) {
			value1 = BaseMath._decrement(value1, base1, digitSet, negativeSign);

			value2 = BaseMath._decrement(value2, base2, digitSet, negativeSign);
		}
	}
	else {
		while (!BaseMath._isZero(value2, digitSet)) {
			value1 = BaseMath._increment(value1, base1, digitSet, negativeSign);

			value2 = BaseMath._increment(value2, base2, digitSet, negativeSign);
		}
	}

	return value1;
};

/**
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @returns {string}
 */
BaseMath.prototype.subtract = function(value1, base1, value2, base2) {
	return BaseMath.subtract(value1, base1, value2, base2, this.digitSet, this.negativeSign);
};

/**
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @param {number} answerBase
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath.multiply = function(value1, base1, value2, base2, answerBase, digitSet, negativeSign) {
	var value1Report = BaseMath.valueReport(value1);

	if (!value1Report.valid) {
		throw value1Report;
	}

	var base1Report = BaseMath.baseReport(base1);

	if (!base1Report.valid) {
		throw base1Report;
	}

	var value2Report = BaseMath.valueReport(value2);

	if (!value2Report.valid) {
		throw value2Report;
	}

	var base2Report = BaseMath.baseReport(base2);

	if (!base2Report.valid) {
		throw base2Report;
	}

	var answerBaseReport = BaseMath.baseReport(answerBase);

	if (!answerBaseReport.valid) {
		throw answerBaseReport;
	}

	var highestBase = Math.max(base1, base2, answerBase);

	var digitSetReport = BaseMath.digitSetReport(digitSet, highestBase);

	if (!digitSetReport.valid) {
		throw digitSetReport;
	}

	var negativeSignReport = BaseMath.negativeSignReport(negativeSign);

	if (!negativeSignReport.valid) {
		throw negativeSignReport;
	}

	return BaseMath._multiply(value1, base1, value2, base2, answerBase, digitSet, negativeSign);
};

/**
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @param {number} answerBase
 * @param {string} digitSet
 * @param {string} negativeSign
 * @returns {string}
 */
BaseMath._multiply = function(value1, base1, value2, base2, answerBase, digitSet, negativeSign) {
	if (BaseMath._isZero(value1, digitSet) || BaseMath._isZero(value2, digitSet)) {
		return digitSet[0];
	}

	var value1Abs = BaseMath._abs(value1, negativeSign);
	var value2Abs = BaseMath._abs(value2, negativeSign);

	var answer = digitSet[0];

	while (!BaseMath._isZero(value1Abs, digitSet)) {
		answer = BaseMath._add(answer, answerBase, value2Abs, base2, digitSet, negativeSign);

		value1Abs = BaseMath._decrement(value1Abs, base1, digitSet, negativeSign);
	}

	var value1Positive = BaseMath._isPositive(value1, negativeSign);
	var value2Positive = BaseMath._isPositive(value2, negativeSign);

	if (value1Positive && value2Positive) {
		return answer;
	}
	else if (value1Positive && !value2Positive) {
		return BaseMath._ensureNegative(answer, negativeSign);
	}
	else if (!value1Positive && value2Positive) {
		return BaseMath._ensureNegative(answer, negativeSign);
	}
	else if (!value1Positive && !value2Positive) {
		return value;
	}
	else {
		throw new Error("Unknown sign condition");
	}
};

/**
 * @param {string} value1
 * @param {number} base1
 * @param {string} value2
 * @param {number} base2
 * @param {number} answerBase
 * @returns {string}
 */
BaseMath.prototype.multiply = function(value1, base1, value2, base2, answerBase) {
	return BaseMath.multiply(value1, base1, value2, base2, answerBase, this.digitSet, this.negativeSign);
};

//////////

// /**
//  * @param {string} expression
//  * @param {*} expected
//  */
// function assert(expression, expected) {
// 	var actual = eval(expression);
//
// 	var info = expression + " | Expected: " +  expected + " | Actual: " +  actual;
//
// 	if (expected == actual) {
// 		console.log(info);
// 	}
// 	else {
// 		console.error(info);
// 	}
// }
//
// assert("BaseMath._raise('3', 10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')", '4');
// assert("BaseMath._raise('1', 2, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')", '10');
// assert("BaseMath._raise('0', 3, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ')", '1');
//
// assert("BaseMath._lower('7', 8, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '6');
// assert("BaseMath._lower('88', 10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '87');
// assert("BaseMath._lower('0', 4, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '-1');
//
// assert("BaseMath.add('-3', 10, '7', 8, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '4');
// assert("BaseMath.add('5', 10, '7', 8, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '12');
//
// assert("BaseMath.subtract('5', 10, '2', 8, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '3');
// assert("BaseMath.subtract('110', 2, '8', 10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '-10');
//
// assert("BaseMath.multiply('3', 4, '4', 10, 10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '12');
// assert("BaseMath.multiply('-3', 4, '7', 8, 10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '-21');
// assert("BaseMath.multiply('-11', 10, '10', 10, 10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '-110');
// assert("BaseMath.multiply('12', 10, '10', 10, 10, '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', '-')", '120');
