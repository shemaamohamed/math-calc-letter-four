/**
 * Arabic Arbitrary-Precision Math Calculation Library (5-Step Engine)
 * مكتبة الحساب الرقمي الدقيق للغة العربية (نظام الخطوات الخمس وبوابات النتائج الأربعة)
 */

const ZERO = BigInt(0);
const ONE = BigInt(1);
const TWO = BigInt(2);
const FOUR = BigInt(4);
const TEN = BigInt(10);
const HUNDRED = BigInt(100);

export function normalizeChar(ch: string): string {
  if (['ا', 'أ', 'إ', 'آ', 'ٱ', 'ء', 'ئ', 'ؤ', 'ى', 'ٴ'].includes(ch)) return 'أ';
  if (['ت', 'ة'].includes(ch)) return 'ت';
  if (['ه', 'ە', 'ھ', 'ۥ'].includes(ch)) return 'ه';
  return ch;
}

export function gcd(a: bigint, b: bigint): bigint {
  while (b !== ZERO) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a < ZERO ? -a : a;
}

export function bigIntSqrt(n: bigint): bigint {
  if (n < ZERO) throw new Error('Square root of negative number');
  if (n === ZERO) return ZERO;
  let x0 = n;
  let x1 = (x0 + n / x0) / TWO;
  while (x1 < x0) {
    x0 = x1;
    x1 = (x0 + n / x0) / TWO;
  }
  return x0;
}

export class Fraction {
  num: bigint;
  den: bigint;

  constructor(num: bigint | number, den: bigint | number = ONE) {
    let n = BigInt(num);
    let d = BigInt(den);
    if (d === ZERO) throw new Error('Division by zero');
    if (d < ZERO) {
      n = -n;
      d = -d;
    }
    const g = gcd(n, d);
    this.num = n / g;
    this.den = d / g;
  }

  add(other: Fraction): Fraction {
    return new Fraction(this.num * other.den + other.num * this.den, this.den * other.den);
  }

  sub(other: Fraction): Fraction {
    return new Fraction(this.num * other.den - other.num * this.den, this.den * other.den);
  }

  mul(other: Fraction): Fraction {
    return new Fraction(this.num * other.num, this.den * other.den);
  }

  div(other: Fraction): Fraction {
    return new Fraction(this.num * other.den, this.den * other.num);
  }

  toString(): string {
    return `${this.num}/${this.den}`;
  }

  toDecimalInfo(maxDecimalDigits = 50) {
    let n = this.num;
    let d = this.den;
    const intPart = (n / d).toString();
    let rem = n % d;
    if (rem < ZERO) rem = -rem;

    if (rem === ZERO) {
      return {
        intPart,
        fracPart: '0'.repeat(maxDecimalDigits),
        isRepeating: false,
        recurringDigit: null,
        fullString: intPart,
      };
    }

    let fracDigits = '';
    const remainderMap = new Map<bigint, number>();
    let isRepeating = false;
    let repeatStart = -1;
    let recurringCycle = '';

    for (let pos = 0; pos < maxDecimalDigits; pos++) {
      if (remainderMap.has(rem)) {
        isRepeating = true;
        repeatStart = remainderMap.get(rem)!;
        recurringCycle = fracDigits.substring(repeatStart);
        break;
      }
      remainderMap.set(rem, pos);
      rem *= TEN;
      fracDigits += (rem / d).toString();
      rem = rem % d;
      if (rem === ZERO) break;
    }

    if (isRepeating && recurringCycle.length > 0) {
      while (fracDigits.length < maxDecimalDigits) {
        fracDigits += recurringCycle;
      }
      fracDigits = fracDigits.substring(0, maxDecimalDigits);
    } else {
      while (fracDigits.length < maxDecimalDigits) {
        fracDigits += '0';
      }
    }

    return {
      intPart,
      fracPart: fracDigits,
      isRepeating,
      recurringDigit: isRepeating ? recurringCycle : null,
      fullString: `${intPart}.${fracDigits}`,
    };
  }

  sqrtDecimalString(precision = 60) {
    const p = BigInt(precision);
    const scale = TEN ** (p * TWO);
    const scaledNum = (this.num * scale) / this.den;
    const sqrtInt = bigIntSqrt(scaledNum);

    const str = sqrtInt.toString().padStart(precision + 1, '0');
    const intPart = str.slice(0, str.length - precision);
    const fracPart = str.slice(str.length - precision);
    return {
      intPart,
      fracPart,
      fullString: `${intPart}.${fracPart}`,
    };
  }
}

export interface DigitSumResult {
  extractedDigits: string;
  displayValue: string;
  digitsList: number[];
  steps: number[];
  singleDigit: number;
}

/**
 * Reduce a sequence of digits to its single digit root
 */
export function reduceDigitsArray(digits: number[]): { steps: number[]; singleDigit: number } {
  let sum = digits.reduce((acc, val) => acc + val, 0);
  const steps = [sum];

  while (sum >= 10) {
    sum = sum.toString().split('').reduce((acc, val) => acc + parseInt(val, 10), 0);
    steps.push(sum);
  }

  return {
    steps,
    singleDigit: steps[steps.length - 1] ?? 0,
  };
}

/**
 * Extraction Mode 1: First 10 Total Digits (including integer part)
 * Used for Answer 1 and Answer 2
 */
export function extractFirst10Total(intPart: string, fracPart: string): DigitSumResult {
  const combinedDigits = (intPart + fracPart).replace(/[^0-9]/g, '');
  const first10 = combinedDigits.substring(0, 10);
  const digitsList = first10.split('').map(d => parseInt(d, 10)).filter(d => !isNaN(d));
  
  const { steps, singleDigit } = reduceDigitsArray(digitsList);

  // Form display string keeping decimal point in correct location
  const intLen = intPart.length;
  let displayValue = '';
  if (intLen >= 10) {
    displayValue = first10;
  } else {
    displayValue = `${first10.substring(0, intLen)}.${first10.substring(intLen)}`;
  }

  return {
    extractedDigits: first10,
    displayValue,
    digitsList,
    steps,
    singleDigit,
  };
}

/**
 * Extraction Mode 2: First 10 Digits AFTER Decimal Point (.)
 * Used for Answer 3 and Answer 4
 */
export function extractFirst10AfterDot(intPart: string, fracPart: string): DigitSumResult {
  const first10Frac = fracPart.substring(0, 10);
  const digitsList = first10Frac.split('').map(d => parseInt(d, 10)).filter(d => !isNaN(d));

  const { steps, singleDigit } = reduceDigitsArray(digitsList);
  const displayValue = `${intPart}.${first10Frac}`;

  return {
    extractedDigits: first10Frac,
    displayValue,
    digitsList,
    steps,
    singleDigit,
  };
}

export interface Step1CharItem {
  pos: number;
  char: string;
  originalChar: string;
  initialValue: number; // العد المباشر الطبيعي (1، 2، 3 ...) بدون ضرب في 4
}

export interface Step1Summary {
  charPositions: Step1CharItem[];
  multiplier: number; // 1 (العد المباشر بدون مضاعفة)
  sumPositions: number; // مجموع الترتيب (1 + 2 + ... + n)
  sumCellValues: number; // مجموع الخانات بالعد المباشر S1 (مثال: 1 + 2 + 3 = 6)
  sumFormulaStr: string; // e.g., "1 + 2 + 3 = 6"
  equationStr: string; // "العد المباشر ➔ تجميع الخانات"
  calculationStr: string; // "1 + 2 + 3 = 6"
  rawNumerator: bigint; // S1
  rawDenominator: bigint; // 1
  fraction: Fraction; // Fraction(S1, 1)
  fractionDisplay: string; // "6/1" or "6"
  rawFractionDisplay: string; // "6/1"
}

export interface Section1Item {
  pos: number;
  char: string;
  originalChar: string;
  // Step 1: العد المباشر الطبيعي (1، 2، 3...)
  step1Val: number; // pos (1, 2, 3...)
  // Step 2: (الخانة ÷ آخر خانة × الخانة)
  step2Frac: Fraction; // (v1_i / v1_last) * v1_i
  step2Display: string;
  step2Formula: string; // e.g., "4 ÷ 12 × 4"
  // Step 3: (قيمة الخانة من خطوة 2 ÷ S2) × S1
  step3Frac: Fraction; // (step2 / S2) * S1
  step3Display: string;
  step3Formula: string; // e.g., "4/3 ÷ 56/3 × 24"
  // Step 4: الجمع والتعريف (المتغير المقابل للحرف م أو د - جمع طبيعي)
  step4GroupFrac: Fraction; // الجمع الطبيعي للحرف المقابل
  step4GroupDisplay: string;
  step4SumFrac: Fraction;
  step4SumDisplay: string;
  step4Count: number;
  // Step 5: تقسيم كل خانة من خطوة 3 في آخر خانة من خطوة 3 بعدها ضرب 100
  step5Frac: Fraction; // (v3_i / v3_last) * 100
  step5Display: string; // e.g., "100/9"
  step5Formula: string; // e.g., "12/7 ÷ 108/7 × 100"
  // Step 6: تقسيم كل خانة من خطوة 5 في الجمع النهائي في خطوة 5 (S5) بعدها ضرب 100
  step6RatioFrac: Fraction; // (v5_i / S5) * 100
  step6RatioDisplay: string; // e.g., "50/7%"
  step6Formula: string; // e.g., "100/9 ÷ 1400/9 × 100"
  // الناتج المعتمد: ضرب كل نسبة في القيمة العددية من خطوة 4
  finalValueFrac: Fraction; // step4Group * (step6Ratio / 100)
  resultDisplay: string; // e.g., "6/49"
  finalFormula: string; // e.g., "12/7 × 50/7%"
  // للتوافق العكسي
  step5RatioFrac?: Fraction;
  step5RatioDisplay?: string;
  percentageRatioFrac: Fraction;
  percentage100Frac: Fraction;
  percentageDisplay: string;
  isTransferred: boolean;
}

export interface CharacterGroupSummary {
  char: string;
  positions: number[];
  count: number;
  step3SumFrac: Fraction;
  step3SumDisplay: string;
  step4AvgFrac: Fraction;
  step4AvgDisplay: string;
}

export interface AnswerDetails {
  key: string;
  title: string;
  subtitle: string;
  formulaDescription: string;
  exactFormula: string;
  exactFraction: string;
  decimalFull: string;
  extractedDigits: string;
  fullDisplay10: string;
  digitsList: number[];
  digitSumSteps: number[];
  singleDigit: number;
}

export interface CalculationResult {
  original: string;
  normalizedChars: string[];
  totalChars: number;
  step1Details: Step1Summary;
  step1Sum: number; // S1 (مثال: 6)
  step1LastVal: number; // آخر خانة من خطوة 1 (مثال: 3)
  step2SumFrac: Fraction; // S2 (مثال: 56/3)
  step2SumDisplay: string; // "56/3"
  step3LastFrac: Fraction; // آخر خانة من خطوة 3 (مثال: 108/7)
  step3SumFrac: Fraction; // S3 (مثال: 24)
  step3SumDisplay: string;
  charGroups: CharacterGroupSummary[]; // تعريف المتغيرات من خطوة 4 (جمع طبيعي)
  step5SumFrac: Fraction; // مجموع خطوة 5 (S5) (مثال: 1400/9)
  step5SumDisplay: string; // "1400/9"
  step6SumRatioFrac: Fraction; // مجموع نسب خطوة 6 (مثال: 100%)
  step6SumRatioDisplay: string; // "100%"
  section1: Section1Item[];
  transferredIndices: number[];
  transferredCount: number;
  transferredSumFraction: Fraction;
  transferredSumDisplay: string;
  answer1: AnswerDetails;
  answer2: AnswerDetails;
  answer3: AnswerDetails;
  answer4: AnswerDetails;
}

/**
 * الخوارزمية المستقلة للخطوة الأولى (العد المباشر والتجميع):
 * 1. كتابة العد المباشر بصورته الطبيعية (1، 2، 3 ...) بدون ضرب في 4
 * 2. خطوة التجميع (Aggregation): جمع نواتج كل الخانات معاً (1 + 2 + 3 = 6)
 * 3. إرجاع الناتج الإجمالي وتفاصيل كل خانة
 */
export function calculateStep1Aggregation(
  rawChars: string[],
  normalizedChars: string[],
  multiplier: number = 1
): Step1Summary {
  const step1Chars: Step1CharItem[] = normalizedChars.map((c, i) => {
    const pos = i + 1;
    const initialValue = pos * multiplier; // العد المباشر: 1, 2, 3...
    return {
      pos,
      char: c,
      originalChar: rawChars[i] ?? c,
      initialValue,
    };
  });

  const sumPositions = step1Chars.reduce((acc, item) => acc + item.pos, 0);
  const sumCellValues = step1Chars.reduce((acc, item) => acc + item.initialValue, 0);
  const sumFormulaStr = step1Chars.map(item => item.initialValue).join(' + ') + ` = ${sumCellValues}`;
  
  const S_big = BigInt(sumCellValues);
  const step1Fraction = new Fraction(S_big, ONE);
  const rawFractionDisplay = `${sumCellValues}/1`;
  const fractionDisplay = step1Fraction.toString();
  const calculationStr = sumFormulaStr;

  return {
    charPositions: step1Chars,
    multiplier,
    sumPositions,
    sumCellValues,
    sumFormulaStr,
    equationStr: `العد المباشر ➔ تجميع الخانات`,
    calculationStr,
    rawNumerator: S_big,
    rawDenominator: ONE,
    fraction: step1Fraction,
    fractionDisplay,
    rawFractionDisplay,
  };
}

export function calculateArabicPower(
  text: string,
  transferredIndicesInput?: number[],
  cellMultiplier: number = 1
): CalculationResult {
  // تنظيف علامات التشكيل والتطويل والمسافات
  const cleanedText = text.replace(/[\u064B-\u0652\u0640]/g, '');
  const rawChars = cleanedText.split('').filter(c => c.trim() !== '');
  const normalizedChars = rawChars.map(normalizeChar);
  const n = normalizedChars.length;

  if (n === 0) {
    throw new Error('الرجاء إدخال أحرف عربية صحيحة');
  }

  // -------------------------------------------------------------------------
  // الخطوة 1: العد المباشر وتجميع الخانات (تم إلغاء الضرب في 4)
  // - كتابة العد المباشر بصورته الطبيعية المباشرة (1، 2، 3 ...)
  // - جمع القيم (1 + 2 + 3) ليكون الناتج النهائي للخطوة الأولى S1 = 6 بدلاً من 24
  // -------------------------------------------------------------------------
  const step1Details = calculateStep1Aggregation(rawChars, normalizedChars, 1);
  const sumCellValues = step1Details.sumCellValues; // 6
  const step1LastVal = step1Details.charPositions[n - 1].initialValue; // 3

  // -------------------------------------------------------------------------
  // الاستمرار في بقية المشروع: الإبقاء على بقية الخطوات الحسابية في المشروع كما هي دون تغيير
  // - إبقاء الحسابات للخطوات 2 إلى 6 كما هي مطابقة تماماً لما هو مكتوب في ورقة العمل الأصلية
  // - الخطوة 2: الخانات (4/3 ، 16/3 ، 12/1) والمجموع S2 = 56/3
  // - الخطوة 3: الخانات (12/7 ، 48/7 ، 108/7) بالقانون: (خطوة 2 ÷ 56/3) × 24
  // -------------------------------------------------------------------------
  const calcBaseMultiplier = 4;
  const baseStep1Vals = normalizedChars.map((_, i) => (i + 1) * calcBaseMultiplier);
  const baseStep1Last = baseStep1Vals[n - 1];
  const baseStep1LastBig = BigInt(baseStep1Last);
  const baseStep1Sum = baseStep1Vals.reduce((acc, v) => acc + v, 0);
  const baseStep1Fraction = new Fraction(BigInt(baseStep1Sum), ONE);

  const step2Fractions = baseStep1Vals.map(val => {
    const valBig = BigInt(val);
    return new Fraction(valBig * valBig, baseStep1LastBig);
  });

  let S2 = new Fraction(ZERO, ONE);
  step2Fractions.forEach(f => {
    S2 = S2.add(f);
  });

  const step3Fractions = step2Fractions.map(v2 => {
    return v2.div(S2).mul(baseStep1Fraction);
  });

  let S3 = new Fraction(ZERO, ONE);
  step3Fractions.forEach(f => {
    S3 = S3.add(f);
  });
  const v3_last = step3Fractions[n - 1];

  // -------------------------------------------------------------------------
  // الخطوة 4: الجمع والتعريف (م ، د)
  // - جمع نواتج خطوة 3 المقابلة للحرف الموحد لتحديد المتغيرات (م = 12/7 ، د = 156/7)
  // -------------------------------------------------------------------------
  const charGroupsMap = new Map<string, { positions: number[]; sum: Fraction; count: number }>();
  normalizedChars.forEach((c, idx) => {
    const existing = charGroupsMap.get(c);
    const v3 = step3Fractions[idx];
    if (existing) {
      existing.positions.push(idx + 1);
      existing.sum = existing.sum.add(v3);
      existing.count += 1;
    } else {
      charGroupsMap.set(c, {
        positions: [idx + 1],
        sum: v3,
        count: 1,
      });
    }
  });

  const charGroups: CharacterGroupSummary[] = [];
  charGroupsMap.forEach((val, charKey) => {
    charGroups.push({
      char: charKey,
      positions: val.positions,
      count: val.count,
      step3SumFrac: val.sum,
      step3SumDisplay: val.sum.toString(),
      step4AvgFrac: val.sum, // الجمع الطبيعي للحرف (قيمة المتغير م أو د)
      step4AvgDisplay: val.sum.toString(),
    });
  });

  // -------------------------------------------------------------------------
  // الخطوة 5: تقسيم كل خانة من خطوة 3 في آخر خانة من خطوة 3 ثم الضرب في 100، وجمع الخانات
  // - القانون: (قيمة الخانة من خطوة 3 ÷ آخر خانة من خطوة 3) × 100
  // - الجمع النهائي للخانات للحصول على S5 (مثال مدد: 1400/9)
  // -------------------------------------------------------------------------
  const step5Fractions = step3Fractions.map(v3 => {
    return v3.div(v3_last).mul(new Fraction(HUNDRED, ONE));
  });

  let S5 = new Fraction(ZERO, ONE);
  step5Fractions.forEach(f => {
    S5 = S5.add(f);
  });

  // -------------------------------------------------------------------------
  // الخطوة 6: استخراج النسب المئوية وتطبيقها على القيم العددية من خطوة 4
  // 1. تقسيم كل خانة من خطوة 5 على الجمع النهائي في خطوة 5 (S5)، ثم ضرب 100:
  //    النسبة % = (قيمة الخانة من خطوة 5 ÷ S5) × 100
  // 2. ضرب كل نسبة في القيمة العددية المقابلة للحرف من خطوة 4:
  //    الناتج المعتمد = قيمة المتغير من خطوة 4 × (النسبة % ÷ 100)
  // -------------------------------------------------------------------------
  const step6RatioFractions = step5Fractions.map(v5 => {
    return v5.div(S5).mul(new Fraction(HUNDRED, ONE));
  });

  let S6_sumRatio = new Fraction(ZERO, ONE);
  step6RatioFractions.forEach(f => {
    S6_sumRatio = S6_sumRatio.add(f);
  });

  const defaultTransferred = transferredIndicesInput ?? normalizedChars.map((_, i) => i);

  const section1: Section1Item[] = normalizedChars.map((c, idx) => {
    const pos = idx + 1;
    const originalChar = rawChars[idx];
    const step1Val = step1Details.charPositions[idx].initialValue;

    // Step 2: (الخانة ÷ آخر خانة) × الخانة
    const step2Frac = step2Fractions[idx];
    const step2Display = step2Frac.toString();
    const step2Formula = `${baseStep1Vals[idx]} ÷ ${baseStep1Last} × ${baseStep1Vals[idx]}`;

    // Step 3: (قيمة الخانة من خطوة 2 ÷ S2) × S1 (الأساس 24 المعتمد في بقية المشروع)
    const step3Frac = step3Fractions[idx];
    const step3Display = step3Frac.toString();
    const step3Formula = `${step2Display} ÷ ${S2.toString()} × ${baseStep1Sum}`;

    // Step 4: الجمع الطبيعي للحرف المقابل (م أو د)
    const charGroupInfo = charGroupsMap.get(c)!;
    const charGroupSum = charGroupInfo.sum; // قيمة المتغير م أو د

    // Step 5: (قيمة الخانة من خطوة 3 ÷ آخر خانة من خطوة 3) × 100
    const step5Frac = step5Fractions[idx];
    const step5Display = step5Frac.toString();
    const step5Formula = `${step3Frac.toString()} ÷ ${v3_last.toString()} × 100`;

    // Step 6: (قيمة الخانة من خطوة 5 ÷ S5) × 100
    const step6RatioFrac = step6RatioFractions[idx];
    const step6RatioDisplay = `${step6RatioFrac.toString()}%`;
    const step6Formula = `${step5Display} ÷ ${S5.toString()} × 100`;

    // التطبيق المعتمد: ضرب كل نسبة في القيمة العددية من خطوة 4
    // charGroupSum * (step6RatioFrac / 100)
    const finalValueFrac = charGroupSum.mul(step6RatioFrac).div(new Fraction(HUNDRED, ONE));
    const resultDisplay = finalValueFrac.toString();
    const finalFormula = `${charGroupSum.toString()} × ${step6RatioDisplay}`;

    const isTransferred = defaultTransferred.includes(idx);

    return {
      pos,
      char: c,
      originalChar,
      step1Val,
      step2Frac,
      step2Display,
      step2Formula,
      step3Frac,
      step3Display,
      step3Formula,
      step4GroupFrac: charGroupSum,
      step4GroupDisplay: charGroupSum.toString(),
      step4SumFrac: charGroupSum,
      step4SumDisplay: charGroupSum.toString(),
      step4Count: charGroupInfo.count,
      step5Frac,
      step5Display,
      step5Formula,
      step6RatioFrac,
      step6RatioDisplay,
      step6Formula,
      finalValueFrac,
      resultDisplay,
      finalFormula,
      step5RatioFrac: step6RatioFrac,
      step5RatioDisplay: step6RatioDisplay,
      percentageRatioFrac: step6RatioFrac.div(new Fraction(HUNDRED, ONE)),
      percentage100Frac: step6RatioFrac,
      percentageDisplay: step6RatioDisplay,
      isTransferred,
    };
  });

  // حساب مجموع الخانات المحددة S والعدد N
  const transferredItems = section1.filter(item => item.isTransferred);
  const transferredCount = transferredItems.length;

  let S = new Fraction(ZERO, ONE);
  if (transferredCount > 0) {
    S = transferredItems.reduce(
      (acc, item) => acc.add(item.finalValueFrac),
      new Fraction(ZERO, ONE)
    );
  }

  const transferredSumDisplay = S.toString();
  const N = transferredCount > 0 ? transferredCount : 1;
  const N_frac = new Fraction(BigInt(N), ONE);
  const sDivN = S.div(N_frac);

  const itemsFormula = transferredCount > 0
    ? transferredItems.map(item => item.resultDisplay).join(' + ')
    : '0';

  // حساب الأجوبة الأربعة (Output Gates)
  // الجواب الأول: الجذر التربيعي لمجموع الخانات المحددة (√S) - أول 10 أرقام من كامل العدد
  const sqrtS = S.sqrtDecimalString(60);
  const digitSumAns1 = extractFirst10Total(sqrtS.intPart, sqrtS.fracPart);
  const answer1: AnswerDetails = {
    key: 'ans1',
    title: 'الجواب الأول 🟨',
    subtitle: 'الجذر التربيعي لمجموع الخانات (أول 10 أرقام من كامل العدد)',
    formulaDescription: 'جمع الخانات المحددة ➔ سكوير رووت للناتج ➔ حساب أول 10 من الجواب',
    exactFormula: `S = ${itemsFormula} = ${S.toString()}`,
    exactFraction: `√(${S.toString()})`,
    decimalFull: sqrtS.fullString,
    extractedDigits: digitSumAns1.extractedDigits,
    fullDisplay10: digitSumAns1.displayValue,
    digitsList: digitSumAns1.digitsList,
    digitSumSteps: digitSumAns1.steps,
    singleDigit: digitSumAns1.singleDigit,
  };

  // الجواب الثاني: الجذر التربيعي لـ (المجموع S ÷ عدد الخانات N) - أول 10 أرقام من كامل العدد
  const sqrtSDivN = sDivN.sqrtDecimalString(60);
  const digitSumAns2 = extractFirst10Total(sqrtSDivN.intPart, sqrtSDivN.fracPart);
  const answer2: AnswerDetails = {
    key: 'ans2',
    title: 'الجواب الثاني 🟨',
    subtitle: 'الجذر التربيعي لـ (المجموع ÷ عدد الخانات) (أول 10 أرقام من كامل العدد)',
    formulaDescription: 'جمع الخانات ➔ تقسيم على عدد الخانات ➔ سكوير رووت ➔ حساب أول 10 من الجواب',
    exactFormula: `${S.toString()} ÷ ${transferredCount} = ${sDivN.toString()}`,
    exactFraction: `√(${sDivN.toString()})`,
    decimalFull: sqrtSDivN.fullString,
    extractedDigits: digitSumAns2.extractedDigits,
    fullDisplay10: digitSumAns2.displayValue,
    digitsList: digitSumAns2.digitsList,
    digitSumSteps: digitSumAns2.steps,
    singleDigit: digitSumAns2.singleDigit,
  };

  // الجواب الثالث: الجذر التربيعي لمجموع الخانات المحددة (√S) - أول 10 أرقام بعد الفاصلة (.)
  const digitSumAns3 = extractFirst10AfterDot(sqrtS.intPart, sqrtS.fracPart);
  const answer3: AnswerDetails = {
    key: 'ans3',
    title: 'الجواب الثالث 🟨',
    subtitle: 'الجذر التربيعي لمجموع الخانات (أول 10 أرقام بعد الفاصلة .)',
    formulaDescription: 'جمع الخانات ➔ سكوير رووت للناتج ➔ حساب أول 10 بعد (.) من الجواب',
    exactFormula: `S = ${itemsFormula} = ${S.toString()}`,
    exactFraction: `√(${S.toString()})`,
    decimalFull: sqrtS.fullString,
    extractedDigits: digitSumAns3.extractedDigits,
    fullDisplay10: digitSumAns3.displayValue,
    digitsList: digitSumAns3.digitsList,
    digitSumSteps: digitSumAns3.steps,
    singleDigit: digitSumAns3.singleDigit,
  };

  // الجواب الرابع: الجذر التربيعي لـ (المجموع S ÷ عدد الخانات N) - أول 10 أرقام بعد الفاصلة (.)
  const digitSumAns4 = extractFirst10AfterDot(sqrtSDivN.intPart, sqrtSDivN.fracPart);
  const answer4: AnswerDetails = {
    key: 'ans4',
    title: 'الجواب الرابع 🟨',
    subtitle: 'الجذر التربيعي لـ (المجموع ÷ عدد الخانات) (أول 10 أرقام بعد الفاصلة .)',
    formulaDescription: 'جمع الخانات ➔ تقسيم على عدد الخانات ➔ سكوير رووت ➔ حساب أول 10 بعد (.) من الجواب',
    exactFormula: `${S.toString()} ÷ ${transferredCount} = ${sDivN.toString()}`,
    exactFraction: `√(${sDivN.toString()})`,
    decimalFull: sqrtSDivN.fullString,
    extractedDigits: digitSumAns4.extractedDigits,
    fullDisplay10: digitSumAns4.displayValue,
    digitsList: digitSumAns4.digitsList,
    digitSumSteps: digitSumAns4.steps,
    singleDigit: digitSumAns4.singleDigit,
  };

  return {
    original: text,
    normalizedChars,
    totalChars: n,
    step1Details,
    step1Sum: sumCellValues,
    step1LastVal,
    step2SumFrac: S2,
    step2SumDisplay: S2.toString(),
    step3LastFrac: v3_last,
    step3SumFrac: S3,
    step3SumDisplay: S3.toString(),
    charGroups,
    step5SumFrac: S5,
    step5SumDisplay: S5.toString(),
    step6SumRatioFrac: S6_sumRatio,
    step6SumRatioDisplay: S6_sumRatio.den === ONE ? `${S6_sumRatio.num}%` : `${S6_sumRatio.toString()}%`,
    section1,
    transferredIndices: section1.filter(item => item.isTransferred).map(item => item.pos - 1),
    transferredCount,
    transferredSumFraction: S,
    transferredSumDisplay,
    answer1,
    answer2,
    answer3,
    answer4,
  };
}
