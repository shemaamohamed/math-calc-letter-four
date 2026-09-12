import { calculateArabicPower, normalizeChar } from '../src/lib/calculate';

console.log("================================================================================");
console.log("             🧪 COMPREHENSIVE ARABIC MATH LOGIC VERIFICATION 🧪                 ");
console.log("             (Unified 5-Step Engine with Zero Approximations)                   ");
console.log("================================================================================\n");

// ============================================================================
// TEST 1: EXACT MATCH WITH HANDWRITTEN IMAGES ("مدد" - All Cells Transferred)
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("📌 TEST 1: Word 'مدد' (Matching Handwritten Reference Sheet 100%)");
console.log("--------------------------------------------------------------------------------");

const testMadad = calculateArabicPower("مدد");

console.log(`Original Word   : "${testMadad.original}"`);
console.log(`Normalized Chars: [${testMadad.normalizedChars.join(', ')}]`);
console.log(`Step 1 (S1)     : ${testMadad.step1Details.sumCellValues} -> Fraction = ${testMadad.step1Details.fractionDisplay}`);
console.log(`Step 2 Sum (S2) : ${testMadad.step2SumDisplay}`);
console.log(`Step 3 Last Val : ${testMadad.step3LastFrac.toString()}`);
console.log("\n📊 STEP-BY-STEP BREAKDOWN (القسم الأول: الخطوات الخمس):");

testMadad.section1.forEach(cell => {
  console.log(`  [الخانة ${cell.pos} (${cell.char})]:`);
  console.log(`    - خطوة 1 (المعامل 4)   : ${cell.step1Val}`);
  console.log(`    - خطوة 2 (تقسيم وضرب)  : ${cell.step2Display}`);
  console.log(`    - خطوة 3 (كسر قياسي)   : ${cell.step3Display}`);
  console.log(`    - خطوة 4 (جمع الحرف)   : ${cell.step4GroupDisplay}`);
  console.log(`    - خطوة 5 (النسبة %)    : ${cell.percentageDisplay}`);
  console.log(`    - الناتج الكسري النهائي: ${cell.resultDisplay} ${cell.isTransferred ? '✅ [زر انتقال: مفعّل]' : '❌ [زر انتقال: غير مفعّل]'}`);
});

console.log("\n📊 OUTPUT GATES (القسم الثاني: بوابات النتائج الأربعة):");
console.log(`  - مجموع الخانات المنتقلة (S) = ${testMadad.transferredSumDisplay}`);
console.log(`  - عدد الخانات المنتقلة (N)   = ${testMadad.transferredCount}`);
console.log(`  - ناتج S ÷ N                 = ${testMadad.answer2.exactFormula.split('=')[1]?.trim()}`);

console.log("\n  🟨 الجواب الأول (√S - أول 10 أرقام من كامل العدد):");
console.log(`     الصيغة: ${testMadad.answer1.exactFraction} = ${testMadad.answer1.fullDisplay10}`);
console.log(`     الأرقام الـ 10 المستخرجة: [${testMadad.answer1.digitsList.join(', ')}]`);
console.log(`     خطوات جمع الأرقام والاختزال: ${testMadad.answer1.digitSumSteps.join(' ➔ ')}`);
console.log(`     الرقم المفرد النهائي: [ ${testMadad.answer1.singleDigit} ]`);

console.log("\n  🟨 الجواب الثاني (√(S/N) - أول 10 أرقام من كامل العدد):");
console.log(`     الصيغة: ${testMadad.answer2.exactFraction} = ${testMadad.answer2.fullDisplay10}`);
console.log(`     الأرقام الـ 10 المستخرجة: [${testMadad.answer2.digitsList.join(', ')}]`);
console.log(`     خطوات جمع الأرقام والاختزال: ${testMadad.answer2.digitSumSteps.join(' ➔ ')}`);
console.log(`     الرقم المفرد النهائي: [ ${testMadad.answer2.singleDigit} ]`);

console.log("\n  🟨 الجواب الثالث (√S - أول 10 أرقام بعد الفاصلة .):");
console.log(`     الصيغة: ${testMadad.answer3.exactFraction} = ${testMadad.answer3.fullDisplay10}`);
console.log(`     الأرقام الـ 10 المستخرجة: [${testMadad.answer3.digitsList.join(', ')}]`);
console.log(`     خطوات جمع الأرقام والاختزال: ${testMadad.answer3.digitSumSteps.join(' ➔ ')}`);
console.log(`     الرقم المفرد النهائي: [ ${testMadad.answer3.singleDigit} ]`);

console.log("\n  🟨 الجواب الرابع (√(S/N) - أول 10 أرقام بعد الفاصلة .):");
console.log(`     الصيغة: ${testMadad.answer4.exactFraction} = ${testMadad.answer4.fullDisplay10}`);
console.log(`     الأرقام الـ 10 المستخرجة: [${testMadad.answer4.digitsList.join(', ')}]`);
console.log(`     خطوات جمع الأرقام والاختزال: ${testMadad.answer4.digitSumSteps.join(' ➔ ')}`);
console.log(`     الرقم المفرد النهائي: [ ${testMadad.answer4.singleDigit} ]`);

// Validations for "مدد"
const expectedMadadCells = ['2/7', '52/7', '78/7'];
const actualMadadCells = testMadad.section1.map(c => c.resultDisplay);
const isSection1Valid = JSON.stringify(actualMadadCells) === JSON.stringify(expectedMadadCells);

if (isSection1Valid && testMadad.transferredSumDisplay === '132/7') {
  console.log("\n>>> ✅ TEST 1 PASSED: 100% ACCURATE TO HANDWRITTEN SHEET FOR 'مدد'! <<<\n");
} else {
  console.error(">>> ❌ TEST 1 FAILED! <<<");
  process.exit(1);
}

// ============================================================================
// TEST 2: WORD "جليل"
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("📌 TEST 2: Word 'جليل'");
console.log("--------------------------------------------------------------------------------");

const testJalil = calculateArabicPower("جليل");
console.log(`Step 1 S1      : ${testJalil.step1Details.sumCellValues} (Fraction: ${testJalil.step1Details.fractionDisplay})`);
console.log(`Step 2 Sum S2  : ${testJalil.step2SumDisplay}`);
console.log(`Sum of all cells S = ${testJalil.transferredSumDisplay} (Expected: 296/15)`);
if (testJalil.transferredSumDisplay !== '296/15') {
  throw new Error(`Test 2 failed: expected 296/15, got ${testJalil.transferredSumDisplay}`);
}
console.log(">>> ✅ TEST 2 PASSED! <<<\n");

// ============================================================================
// TEST 3: CHARACTER NORMALIZATION RULES
// ============================================================================
console.log("--------------------------------------------------------------------------------");
console.log("📌 TEST 3: Character Normalization Rules");
console.log("--------------------------------------------------------------------------------");

const alifVariants = ['أ', 'إ', 'آ', 'ا', 'ء', 'ئ', 'ؤ', 'ى'];
console.log("1. Alif Variants (ألف = أ ، إ ، آ ، ا ، ء ، ئ ، ؤ ، ى):");
alifVariants.forEach(c => {
  const norm = normalizeChar(c);
  console.log(`   '${c}' ➔ '${norm}' ${norm === 'أ' ? '✅' : '❌'}`);
  if (norm !== 'أ') throw new Error(`Normalization failed for ${c}`);
});

const taVariants = ['ت', 'ة'];
console.log("\n2. Ta Variants (تاء = ت ، ة):");
taVariants.forEach(c => {
  const norm = normalizeChar(c);
  console.log(`   '${c}' ➔ '${norm}' ${norm === 'ت' ? '✅' : '❌'}`);
  if (norm !== 'ت') throw new Error(`Normalization failed for ${c}`);
});

const haVariants = ['ه', 'ۥ', 'ە'];
console.log("\n3. Ha Variants (هاء = ه):");
haVariants.forEach(c => {
  const norm = normalizeChar(c);
  console.log(`   '${c}' ➔ '${norm}' ${norm === 'ه' ? '✅' : '❌'}`);
  if (norm !== 'ه') throw new Error(`Normalization failed for ${c}`);
});

console.log("\n>>> ✅ TEST 3 PASSED: All Normalization Rules Verified! <<<\n");

console.log("================================================================================");
console.log("🎉 ALL LOGICAL, MATHEMATICAL, AND NORMALIZATION TESTS COMPLETED SUCCESSFULLY! 🎉");
console.log("================================================================================");
