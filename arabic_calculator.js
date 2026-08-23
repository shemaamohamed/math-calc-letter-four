const fs = require('fs');

/**
 * Arabic Character Normalization according to User Rules
 */
function normalizeChar(ch) {
    if (['ا', 'أ', 'إ', 'آ', 'ٱ', 'ء', 'ئ', 'ؤ', 'ى'].includes(ch)) return 'أ';
    if (['ت', 'ة'].includes(ch)) return 'ت';
    if (['ه', 'ۥ'].includes(ch)) return 'ه';
    return ch;
}

/**
 * Greatest Common Divisor for BigInt
 */
function gcd(a, b) {
    a = BigInt(a);
    b = BigInt(b);
    while (b !== 0n) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a < 0n ? -a : a;
}

/**
 * Newton-Raphson Arbitrary-Precision Square Root for BigInt
 */
function bigIntSqrt(n) {
    if (n < 0n) throw new Error("Square root of negative number");
    if (n === 0n) return 0n;
    let x0 = n;
    let x1 = (x0 + n / x0) / 2n;
    while (x1 < x0) {
        x0 = x1;
        x1 = (x0 + n / x0) / 2n;
    }
    return x0;
}

/**
 * Arbitrary-Precision Fraction Class using BigInt
 */
class Fraction {
    constructor(num, den = 1n) {
        num = BigInt(num);
        den = BigInt(den);
        if (den === 0n) throw new Error("Division by zero");
        if (den < 0n) {
            num = -num;
            den = -den;
        }
        const g = gcd(num, den);
        this.num = num / g;
        this.den = den / g;
    }

    add(other) {
        return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den);
    }

    mul(other) {
        return new Fraction(this.num * other.num, this.den * other.den);
    }

    div(other) {
        return new Fraction(this.num * other.den, this.den * other.num);
    }

    toString() {
        return `${this.num}/${this.den}`;
    }

    sqrtDecimalString(precision = 50) {
        const p = BigInt(precision);
        const scale = 10n ** (p * 2n);
        const scaledNum = (this.num * scale) / this.den;
        const sqrtInt = bigIntSqrt(scaledNum);

        const str = sqrtInt.toString().padStart(precision + 1, '0');
        const intPart = str.slice(0, str.length - precision);
        const fracPart = str.slice(str.length - precision);
        return {
            intPart,
            fracPart,
            fullString: `${intPart}.${fracPart}`
        };
    }
}

/**
 * Reduce first 10 digits after dot to a single digit sum
 */
function reduceToSingleDigit(fracPart) {
    const first10Digits = fracPart.substring(0, 10);
    const digits = first10Digits.split('').map(d => parseInt(d, 10)).filter(d => !isNaN(d));
    let sum = digits.reduce((acc, val) => acc + val, 0);
    const steps = [sum];

    while (sum >= 10) {
        sum = sum.toString().split('').reduce((acc, val) => acc + parseInt(val, 10), 0);
        steps.push(sum);
    }

    return {
        first10Digits,
        steps,
        singleDigit: steps[steps.length - 1] || 0
    };
}

/**
 * Main Calculator Execution Function (3 Steps)
 */
function processWord(text) {
    const cleanText = text.replace(/[\u064B-\u0652\u0640]/g, '');
    const rawChars = cleanText.split('').filter(c => c.trim() !== '');
    const chars = rawChars.map(normalizeChar);
    const n = chars.length;
    if (n === 0) return { error: "Empty input text" };

    // Step 1: Natural Count (عد طبيعي)
    const step1Pos = chars.map((_, i) => i + 1);

    // Step 2: Natural Sum per unique normalized letter from step 1 (جمع القيم طبيعي من خطوة 1)
    const step2Map = {};
    chars.forEach((c, idx) => {
        step2Map[c] = (step2Map[c] || 0) + step1Pos[idx];
    });

    // Step 3: Extract Percentages & Terms (استخلاص النسب المئوية وضربها في قيمة خطوة 2 ثم الجمع)
    const totalLengthFrac = new Fraction(n, 1);
    let totalFraction = new Fraction(0n, 1n);

    const step3Details = chars.map((c, idx) => {
        const pctFraction = new Fraction(BigInt(step1Pos[idx]), BigInt(n));
        const letterStep2Val = BigInt(step2Map[c]);
        const termFraction = pctFraction.mul(new Fraction(letterStep2Val, 1n));
        totalFraction = totalFraction.add(termFraction);

        return {
            pos: idx + 1,
            char: c,
            letterSumStep2: letterStep2Val.toString(),
            percentageFraction: pctFraction.toString(),
            percentageDisplay: `${pctFraction.mul(new Fraction(100n, 1n)).toString()}%`,
            termFraction: termFraction.toString()
        };
    });

    // Answer 1 Calculation: Square Root of Final Fraction
    const sqrtInfo1 = totalFraction.sqrtDecimalString(50);
    const digitSum1 = reduceToSingleDigit(sqrtInfo1.fracPart);

    // Answer 2 Calculation: Divide Final Fraction by total letter count n, then Square Root
    const dividedFraction = totalFraction.div(totalLengthFrac);
    const sqrtInfo2 = dividedFraction.sqrtDecimalString(50);
    const digitSum2 = reduceToSingleDigit(sqrtInfo2.fracPart);

    return {
        wordInput: text,
        normalizedChars: chars,
        totalChars: n,
        step1: step1Pos,
        step2: step2Map,
        step3: step3Details,
        finalFraction: totalFraction.toString(),
        
        answer1: {
            exactFraction: `√(${totalFraction.toString()})`,
            baseFraction: totalFraction.toString(),
            decimalFull: sqrtInfo1.fullString,
            first10Digits: digitSum1.first10Digits,
            fullDisplay10: `${sqrtInfo1.intPart}.${digitSum1.first10Digits}`,
            digitSumSteps: digitSum1.steps,
            singleDigit: digitSum1.singleDigit
        },

        answer2: {
            exactFraction: `√(${dividedFraction.toString()})`,
            baseFraction: `${totalFraction.toString()} ÷ ${n} = ${dividedFraction.toString()}`,
            decimalFull: sqrtInfo2.fullString,
            first10Digits: digitSum2.first10Digits,
            fullDisplay10: `${sqrtInfo2.intPart}.${digitSum2.first10Digits}`,
            digitSumSteps: digitSum2.steps,
            singleDigit: digitSum2.singleDigit
        }
    };
}

// Command-line execution
const inputWord = process.argv[2] || 'مدد';
const result = processWord(inputWord);

console.log("==================================================");
console.log("   ARABIC ARBITRARY-PRECISION MATHEMATICAL CALCULATOR (3 STEPS)");
console.log("==================================================");
console.log(`INPUT WORD: ${result.wordInput}`);
console.log(`NORMALIZED CHARACTERS: [${result.normalizedChars.join(', ')}]`);
console.log("--------------------------------------------------");
console.log(`STEP 1 (Natural Count): ${result.step1.join(', ')}`);
console.log(`STEP 2 (Natural Sum per letter):`, result.step2);
console.log(`FINAL EXACT FRACTION: ${result.finalFraction}`);
console.log("--------------------------------------------------");
console.log("ANSWER 1 (Square Root of Final Fraction):");
console.log(`  - Exact Fraction : ${result.answer1.exactFraction}`);
console.log(`  - 10-Digit Value : ${result.answer1.fullDisplay10}`);
console.log(`  - First 10 Frac  : ${result.answer1.first10Digits}`);
console.log(`  - Digit Sum Steps: ${result.answer1.digitSumSteps.join(' -> ')}`);
console.log(`  - Single Digit   : ${result.answer1.singleDigit}`);
console.log("--------------------------------------------------");
console.log("ANSWER 2 (Square Root of Final Fraction ÷ Letter Count):");
console.log(`  - Base Division  : ${result.answer2.baseFraction}`);
console.log(`  - Exact Fraction : ${result.answer2.exactFraction}`);
console.log(`  - 10-Digit Value : ${result.answer2.fullDisplay10}`);
console.log(`  - First 10 Frac  : ${result.answer2.first10Digits}`);
console.log(`  - Digit Sum Steps: ${result.answer2.digitSumSteps.join(' -> ')}`);
console.log(`  - Single Digit   : ${result.answer2.singleDigit}`);
console.log("==================================================");

if (typeof module !== 'undefined') {
    module.exports = { processWord, normalizeChar, Fraction, bigIntSqrt };
}
