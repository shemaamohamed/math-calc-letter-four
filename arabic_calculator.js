const fs = require('fs');

/**
 * Arabic Character Normalization according to User Rules
 */
function normalizeChar(ch) {
    if (['ا', 'أ', 'إ', 'آ', 'ٱ', 'ء', 'ئ', 'ؤ', 'ى', 'ٴ'].includes(ch)) return 'أ';
    if (['ت', 'ة'].includes(ch)) return 'ت';
    if (['ه', 'ە', 'ھ', 'ۥ'].includes(ch)) return 'ه';
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

    sub(other) {
        return new Fraction(this.num * other.den - other.num * this.den, this.den * other.den);
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

    sqrtDecimalString(precision = 60) {
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
 * Reduce a sequence of digits to its single digit root
 */
function reduceDigitsArray(digits) {
    let sum = digits.reduce((acc, val) => acc + val, 0);
    const steps = [sum];

    while (sum >= 10) {
        sum = sum.toString().split('').reduce((acc, val) => acc + parseInt(val, 10), 0);
        steps.push(sum);
    }

    return {
        steps,
        singleDigit: steps[steps.length - 1] || 0
    };
}

/**
 * Extraction Mode 1: First 10 Total Digits (including integer part)
 */
function extractFirst10Total(intPart, fracPart) {
    const combined = (intPart + fracPart).replace(/[^0-9]/g, '');
    const first10 = combined.substring(0, 10);
    const digits = first10.split('').map(d => parseInt(d, 10)).filter(d => !isNaN(d));
    const { steps, singleDigit } = reduceDigitsArray(digits);
    const intLen = intPart.length;
    const displayValue = intLen >= 10 ? first10 : `${first10.substring(0, intLen)}.${first10.substring(intLen)}`;
    return { first10, displayValue, digits, steps, singleDigit };
}

/**
 * Extraction Mode 2: First 10 Digits AFTER Decimal Point (.)
 */
function extractFirst10AfterDot(intPart, fracPart) {
    const first10Frac = fracPart.substring(0, 10);
    const digits = first10Frac.split('').map(d => parseInt(d, 10)).filter(d => !isNaN(d));
    const { steps, singleDigit } = reduceDigitsArray(digits);
    const displayValue = `${intPart}.${first10Frac}`;
    return { first10: first10Frac, displayValue, digits, steps, singleDigit };
}

/**
 * Main Calculator Execution Function (5 Steps & 4 Answer Gates)
 */
function processWord(text, selectedIndices = null) {
    const cleanText = text.replace(/[\u064B-\u0652\u0640]/g, '');
    const rawChars = cleanText.split('').filter(c => c.trim() !== '');
    const chars = rawChars.map(normalizeChar);
    const n = chars.length;
    if (n === 0) return { error: "Empty input text" };

    // Step 1: وضع اثنين وأربعين (42) على كل خانة ثم جمع نتائج الخانات (S1)
    const cellMultiplier = 42;
    const step1Chars = chars.map((c, i) => {
        const pos = i + 1;
        const initialValue = 42; // نضع 42 على كل خانة
        return { pos, char: c, originalChar: rawChars[i], initialValue };
    });
    const sumPositions = step1Chars.reduce((acc, item) => acc + item.pos, 0);
    const sumCellValues = step1Chars.reduce((acc, item) => acc + item.initialValue, 0);
    const sumFormulaStr = step1Chars.map(item => item.initialValue).join(' + ') + ` = ${sumCellValues}`;
    const S_big = BigInt(sumCellValues);
    const step1Fraction = new Fraction(S_big, 1n);
    const rawFractionDisplay = `${sumCellValues}/1`;
    const fractionDisplay = step1Fraction.toString();
    const lastCellVal = 42;

    const step1Details = {
        charPositions: step1Chars,
        multiplier: cellMultiplier,
        sumPositions,
        sumCellValues,
        sumFormulaStr,
        lastCellVal,
        equationStr: `وضع 42 على كل خانة ➔ تجميع الخانات`,
        rawFractionDisplay,
        fractionDisplay
    };

    // الخطوات 2 إلى 6: الحساب الرقمي الكسري المباشر المعتمد 100% على الورقة المرجعية اليدوية
    // Step 2: عدد طبيعي (1, 2, ... n) -> (i ÷ n) × i = i^2 / n
    const naturalIndices = chars.map((_, i) => i + 1);
    const lastNaturalVal = n;
    const lastNaturalValBig = BigInt(lastNaturalVal);
    const step1FractionExact = step1Fraction;

    const step2Fractions = naturalIndices.map(i => {
        const iBig = BigInt(i);
        return new Fraction(iBig * iBig, lastNaturalValBig);
    });
    let S2 = new Fraction(0n, 1n);
    step2Fractions.forEach(f => S2 = S2.add(f));

    // Step 3: (v2 / S2) * step1Fraction (S1)
    const step3Fractions = step2Fractions.map(v2 => v2.div(S2).mul(step1FractionExact));
    const v3_last = step3Fractions[n - 1];

    // Step 4: Group identical characters and sum step 3 (Natural Sum - Variable definition)
    const charGroupsMap = {};
    chars.forEach((c, idx) => {
        const v3 = step3Fractions[idx];
        if (charGroupsMap[c]) {
            charGroupsMap[c].sum = charGroupsMap[c].sum.add(v3);
            charGroupsMap[c].positions.push(idx + 1);
            charGroupsMap[c].count += 1;
        } else {
            charGroupsMap[c] = {
                sum: v3,
                positions: [idx + 1],
                count: 1
            };
        }
    });

    Object.keys(charGroupsMap).forEach(c => {
        const group = charGroupsMap[c];
        group.average = group.sum; // Natural sum (Variable value)
    });

    // Step 5: (v3_i / v3_last) * 100, then sum S5
    const step5Fractions = step3Fractions.map(v3 => {
        return v3.div(v3_last).mul(new Fraction(100n, 1n));
    });
    let S5 = new Fraction(0n, 1n);
    step5Fractions.forEach(f => S5 = S5.add(f));

    // Step 6: (v5_i / S5) * 100, then finalValue = step4Var * (ratio6 / 100)
    const step6RatioFractions = step5Fractions.map(v5 => {
        return v5.div(S5).mul(new Fraction(100n, 1n));
    });
    let S6_sumRatio = new Fraction(0n, 1n);
    step6RatioFractions.forEach(f => S6_sumRatio = S6_sumRatio.add(f));

    const defaultSelected = selectedIndices || chars.map((_, i) => i);
    const step6Details = chars.map((c, idx) => {
        const pos = idx + 1;
        const step1Val = 42;
        const naturalVal = idx + 1;
        const step2Frac = step2Fractions[idx];
        const step3Val = step3Fractions[idx];
        const step5Frac = step5Fractions[idx];
        const step5Display = step5Frac.toString();
        const step6RatioFrac = step6RatioFractions[idx];
        const step6Display = `${step6RatioFrac.toString()}%`;

        // Final result = Step 4 variable * (Step 6 Ratio / 100)
        const charGroup = charGroupsMap[c];
        const charSum = charGroup.sum;
        const finalValue = charSum.mul(step6RatioFrac).div(new Fraction(100n, 1n));
        const isSelected = defaultSelected.includes(idx);

        return {
            pos,
            char: c,
            step1: step1Val,
            step2: step2Frac.toString(),
            step2Formula: `${naturalVal} ÷ ${lastNaturalVal} × ${naturalVal}`,
            step3: step3Val.toString(),
            step3Formula: `${step2Frac.toString()} ÷ ${S2.toString()} × ${sumCellValues}`,
            step4Group: charSum.toString(),
            step4RawSum: charGroup.sum.toString(),
            step4Count: charGroup.count,
            step5Display: step5Display,
            step5Formula: `${step3Val.toString()} ÷ ${v3_last.toString()} × 100`,
            step6Percentage: step6Display,
            step6Formula: `${step5Display} ÷ ${S5.toString()} × 100`,
            step5Percentage: step6Display, // backwards compatibility
            percentage: step6Display,
            finalValue: finalValue.toString(),
            finalFormula: `${charSum.toString()} × ${step6Display}`,
            finalValueFrac: finalValue,
            isSelected
        };
    });

    // Sum of selected items S and count N
    const selectedItems = step6Details.filter(item => item.isSelected);
    const N = selectedItems.length > 0 ? selectedItems.length : 1;
    let S = new Fraction(0n, 1n);
    selectedItems.forEach(item => S = S.add(item.finalValueFrac));
    const SDivN = S.div(new Fraction(BigInt(N), 1n));

    // Answer 1: sqrt(S) - First 10 Total Digits
    const sqrtS = S.sqrtDecimalString(60);
    const ans1Info = extractFirst10Total(sqrtS.intPart, sqrtS.fracPart);

    // Answer 2: sqrt(S / N) - First 10 Total Digits
    const sqrtSDivN = SDivN.sqrtDecimalString(60);
    const ans2Info = extractFirst10Total(sqrtSDivN.intPart, sqrtSDivN.fracPart);

    // Answer 3: sqrt(S) - First 10 Digits AFTER dot
    const ans3Info = extractFirst10AfterDot(sqrtS.intPart, sqrtS.fracPart);

    // Answer 4: sqrt(S / N) - First 10 Digits AFTER dot
    const ans4Info = extractFirst10AfterDot(sqrtSDivN.intPart, sqrtSDivN.fracPart);

    return {
        wordInput: text,
        normalizedChars: chars,
        totalChars: n,
        step1Details,
        S1: sumCellValues.toString(),
        S2: S2.toString(),
        v3_last: v3_last.toString(),
        charGroups: charGroupsMap,
        step5Sum: S5.toString(),
        step6Details,
        step5Details: step6Details,
        selectedCount: selectedItems.length,
        sumS: S.toString(),
        SDivN: SDivN.toString(),
        
        answer1: {
            exactFraction: `√(${S.toString()})`,
            fullDisplay10: ans1Info.displayValue,
            first10Digits: ans1Info.first10,
            digitSumSteps: ans1Info.steps,
            singleDigit: ans1Info.singleDigit
        },
        answer2: {
            exactFraction: `√(${SDivN.toString()})`,
            baseFormula: `${S.toString()} ÷ ${selectedItems.length} = ${SDivN.toString()}`,
            fullDisplay10: ans2Info.displayValue,
            first10Digits: ans2Info.first10,
            digitSumSteps: ans2Info.steps,
            singleDigit: ans2Info.singleDigit
        },
        answer3: {
            exactFraction: `√(${S.toString()})`,
            fullDisplay10: ans3Info.displayValue,
            first10Digits: ans3Info.first10,
            digitSumSteps: ans3Info.steps,
            singleDigit: ans3Info.singleDigit
        },
        answer4: {
            exactFraction: `√(${SDivN.toString()})`,
            baseFormula: `${S.toString()} ÷ ${selectedItems.length} = ${SDivN.toString()}`,
            fullDisplay10: ans4Info.displayValue,
            first10Digits: ans4Info.first10,
            digitSumSteps: ans4Info.steps,
            singleDigit: ans4Info.singleDigit
        }
    };
}

// Command-line execution
const inputWord = process.argv[2] || 'مدد';
const result = processWord(inputWord);

console.log("==================================================");
console.log("   ARABIC ARBITRARY-PRECISION 6-STEP ENGINE");
console.log("==================================================");
console.log(`INPUT WORD: ${result.wordInput}`);
console.log(`NORMALIZED CHARS: [${result.normalizedChars.join(', ')}]`);
console.log(`S1: ${result.S1}, S2: ${result.S2}, S5: ${result.step5Sum}`);
console.log("--------------------------------------------------");
result.step6Details.forEach(item => {
    console.log(`Pos ${item.pos} (${item.char}): S1=${item.step1}, S2=${item.step2}, S3=${item.step3}, S4Var=${item.step4Group}, S5=${item.step5Display}, Ratio6=${item.step6Percentage} => Final=${item.finalValue}`);
});
console.log("--------------------------------------------------");
console.log(`SELECTED SUM S: ${result.sumS}`);
console.log(`ANSWER 1: ${result.answer1.exactFraction} => ${result.answer1.fullDisplay10} | Sum=${result.answer1.digitSumSteps.join('->')} => ${result.answer1.singleDigit}`);
console.log(`ANSWER 2: ${result.answer2.exactFraction} => ${result.answer2.fullDisplay10} | Sum=${result.answer2.digitSumSteps.join('->')} => ${result.answer2.singleDigit}`);
console.log(`ANSWER 3: ${result.answer3.exactFraction} => ${result.answer3.fullDisplay10} | Sum=${result.answer3.digitSumSteps.join('->')} => ${result.answer3.singleDigit}`);
console.log(`ANSWER 4: ${result.answer4.exactFraction} => ${result.answer4.fullDisplay10} | Sum=${result.answer4.digitSumSteps.join('->')} => ${result.answer4.singleDigit}`);
console.log("==================================================");

if (typeof module !== 'undefined') {
    module.exports = { processWord, normalizeChar, Fraction, bigIntSqrt };
}
