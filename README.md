# Blatant Base Math

- Convert any number (positive or negative) from any base to any base
- Base 2 through 36 work out of the box. For higher bases, you'll need to define your own larger set of digits.
- Addition, subtraction, and multiplication are also supported between numbers of any bases
- Why "blatant"? Because all operations are done by incrementing or decrementing by 1 until the correct answer is reached.

### [Check out a demo](https://costava.github.io/blatant-base-math/demo/)

## Quick Start

```
var baseMath = new BaseMath();

// Convert '1011' from base 2 to base 10
baseMath.convert('1011', 2, 10);// "11"

// Add '1234' in base 10 with '12' in base 7
// The result is in the base of the first number
baseMath.add('1234', 10, '12', 7);// "1243"

// Subtract '50' in base 10 from '11101' in base 2
// The result is in the base of the first number
baseMath.subtract('11101', 2, '50', 10);// "-10101"

// Multiply '80' in base 16 with '5' in base 10
// The base of the result must be specified as the last argument
baseMath.multiply('80', 16, '5', 10, 2);// "1010000000"
```

Defining a custom set of digits:

```
var baseMath = new BaseMath({digitSet: ')!@#$%^&*('});

baseMath.add('!', 10, '@', 10);// "#"
```
