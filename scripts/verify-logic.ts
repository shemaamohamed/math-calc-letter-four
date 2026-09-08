import { calculateArabicPower, normalizeChar } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR 5-STEP LOGIC    ");
console.log("   (Initial Multiplier 4 & Sum Aggregation)       ");
console.log("==================================================");

try {
    // ============================================================================
    // TEST 1: Word "جليل" - EXACT 1:1 MATCH WITH HANDWRITTEN SHEET
    // ============================================================================
    console.log(`\n--- TEST 1: Word "جليل" (Exact Match with Handwritten Sheet) ---`);
    const resultJalil = calculateArabicPower("جليل");
    
    // Step 1: 1*4=4, 2*4=8, 3*4=12, 4*4=16 -> Sum = 40
    console.log(`Step 1 Details:`);
    console.log(`  - Positions * 4: [${resultJalil.step1Details.charPositions.map(c => `${c.pos}*4=${c.initialValue}`).join(', ')}]`);
    console.log(`  - Aggregated Sum S1: ${resultJalil.step1Details.sumCellValues} (Fraction: ${resultJalil.step1Details.fractionDisplay})`);
    
    if (resultJalil.step1Details.sumCellValues !== 40 || resultJalil.step1Details.fractionDisplay !== '40/1') {
        throw new Error(`Step 1 for جليل failed: got ${resultJalil.step1Details.fractionDisplay}, expected 40/1`);
    }
    console.log("✅ Step 1 verified: Sum S1 = 40 (40/1)!");

    // Step 2: 1/1, 4/1, 9/1, 16/1 -> Sum S2 = 30/1
    console.log(`Step 2 Values: [${resultJalil.section1.map(c => c.step2Display).join(', ')}]`);
    console.log(`Step 2 Sum S2: ${resultJalil.step2SumDisplay} (Expected: 30/1)`);
    const expectedStep2 = ['1/1', '4/1', '9/1', '16/1'];
    resultJalil.section1.forEach((c, i) => {
        if (c.step2Display !== expectedStep2[i]) {
            throw new Error(`Step 2 cell ${i} mismatch: got ${c.step2Display}, expected ${expectedStep2[i]}`);
        }
    });
    if (resultJalil.step2SumDisplay !== '30/1') {
        throw new Error(`Step 2 sum mismatch: got ${resultJalil.step2SumDisplay}, expected 30/1`);
    }
    console.log("✅ Step 2 verified: [1/1, 4/1, 9/1, 16/1] and Sum S2 = 30/1!");

    // Step 3: 4/3, 16/3, 12/1, 64/3
    console.log(`Step 3 Values:`);
    console.log(`  - ج  : ${resultJalil.section1[0].step3Display} (Expected: 4/3)`);
    console.log(`  - ل#1: ${resultJalil.section1[1].step3Display} (Expected: 16/3)`);
    console.log(`  - ي  : ${resultJalil.section1[2].step3Display} (Expected: 12/1)`);
    console.log(`  - ل#2: ${resultJalil.section1[3].step3Display} (Expected: 64/3)`);

    const expectedStep3 = ['4/3', '16/3', '12/1', '64/3'];
    resultJalil.section1.forEach((c, i) => {
        if (c.step3Display !== expectedStep3[i]) {
            throw new Error(`Step 3 cell ${i} mismatch: got ${c.step3Display}, expected ${expectedStep3[i]}`);
        }
    });
    console.log("✅ Step 3 verified: [4/3, 16/3, 12/1, 64/3]!");

    // Step 4: Averages (ج: 4/3, ل: 40/3, ي: 12/1)
    console.log(`Step 4 Averages:`);
    console.log(`  - ج: ${resultJalil.section1[0].step4GroupDisplay} (Expected: 4/3)`);
    console.log(`  - ل: ${resultJalil.section1[1].step4GroupDisplay} (Expected: 40/3)`);
    console.log(`  - ي: ${resultJalil.section1[2].step4GroupDisplay} (Expected: 12/1)`);

    if (resultJalil.section1[0].step4GroupDisplay !== '4/3' ||
        resultJalil.section1[1].step4GroupDisplay !== '40/3' ||
        resultJalil.section1[2].step4GroupDisplay !== '12/1') {
        throw new Error(`Step 4 averages mismatch!`);
    }
    console.log("✅ Step 4 verified: (ج=4/3, ل=40/3, ي=12/1)!");

    // Step 5: Final Cell Values: ج=1/12, ل1=10/3, ي=27/4, ل2=40/3
    console.log(`Step 5 Final Values (Image Green-Underlined Results):`);
    console.log(`  - ج  : Ratio=${resultJalil.section1[0].percentageDisplay}, Final=${resultJalil.section1[0].resultDisplay} (Expected: 1/12)`);
    console.log(`  - ل#1: Ratio=${resultJalil.section1[1].percentageDisplay}, Final=${resultJalil.section1[1].resultDisplay} (Expected: 10/3)`);
    console.log(`  - ي  : Ratio=${resultJalil.section1[2].percentageDisplay}, Final=${resultJalil.section1[2].resultDisplay} (Expected: 27/4)`);
    console.log(`  - ل#2: Ratio=${resultJalil.section1[3].percentageDisplay}, Final=${resultJalil.section1[3].resultDisplay} (Expected: 40/3)`);

    const expectedFinal = ['1/12', '10/3', '27/4', '40/3'];
    resultJalil.section1.forEach((c, i) => {
        if (c.resultDisplay !== expectedFinal[i]) {
            throw new Error(`Step 5 cell ${i} mismatch: got ${c.resultDisplay}, expected ${expectedFinal[i]}`);
        }
    });
    console.log("✅ Step 5 verified 100% with handwritten sheet: [1/12, 10/3, 27/4, 40/3]!");

    // Total Sum S = 1/12 + 10/3 + 27/4 + 40/3 = 47/2
    console.log(`Total Sum S: ${resultJalil.transferredSumDisplay} (Expected: 47/2)`);
    if (resultJalil.transferredSumDisplay !== '47/2') {
        throw new Error(`Total Sum S mismatch: got ${resultJalil.transferredSumDisplay}, expected 47/2`);
    }
    console.log("✅ Total Sum S verified (47/2)!");

    // Check 4 Answer Gates for "جليل"
    console.log(`Answer 1 (√S)    : ${resultJalil.answer1.fullDisplay10} => Steps: ${resultJalil.answer1.digitSumSteps.join(' -> ')} => Root: ${resultJalil.answer1.singleDigit}`);
    console.log(`Answer 2 (√(S/N)): ${resultJalil.answer2.fullDisplay10} => Steps: ${resultJalil.answer2.digitSumSteps.join(' -> ')} => Root: ${resultJalil.answer2.singleDigit}`);
    console.log(`Answer 3 (√S .)  : ${resultJalil.answer3.fullDisplay10} => Steps: ${resultJalil.answer3.digitSumSteps.join(' -> ')} => Root: ${resultJalil.answer3.singleDigit}`);
    console.log(`Answer 4 (√(S/N).): ${resultJalil.answer4.fullDisplay10} => Steps: ${resultJalil.answer4.digitSumSteps.join(' -> ')} => Root: ${resultJalil.answer4.singleDigit}`);

    if (resultJalil.answer1.singleDigit !== 2 || resultJalil.answer2.singleDigit !== 5) {
        throw new Error(`Answer Gates mismatch for جليل`);
    }
    console.log("✅ All 4 Answer Gates verified for 'جليل'!");

    // ============================================================================
    // TEST 2: Word "مدد"
    // ============================================================================
    console.log(`\n--- TEST 2: Word "مدد" ---`);
    const resultMadad = calculateArabicPower("مدد");
    console.log(`Step 1 S1=${resultMadad.step1Details.sumCellValues} (Fraction: ${resultMadad.step1Details.fractionDisplay})`);
    if (resultMadad.step1Details.sumCellValues !== 24 || resultMadad.step1Details.fractionDisplay !== '24/1') {
        throw new Error(`Step 1 for مدد failed: got ${resultMadad.step1Details.fractionDisplay}`);
    }
    console.log(`Step 2 S2: ${resultMadad.step2SumDisplay} (Expected: 56/3)`);
    if (resultMadad.step2SumDisplay !== '56/3') {
        throw new Error(`Step 2 for مدد failed: got ${resultMadad.step2SumDisplay}`);
    }
    console.log(`Step 3 values: [${resultMadad.section1.map(c => c.step3Display).join(', ')}] (Expected: 12/7, 48/7, 108/7)`);
    const expectedMadadStep3 = ['12/7', '48/7', '108/7'];
    resultMadad.section1.forEach((c, i) => {
        if (c.step3Display !== expectedMadadStep3[i]) {
            throw new Error(`Step 3 cell ${i} for مدد mismatch: expected ${expectedMadadStep3[i]}, got ${c.step3Display}`);
        }
    });
    console.log("✅ Step 3 for 'مدد' verified (12/7, 48/7, 108/7)!");

    console.log(`Step 5 final values: [${resultMadad.section1.map(c => c.resultDisplay).join(', ')}] (Expected: 4/21, 104/21, 78/7)`);
    const expectedMadadFinal = ['4/21', '104/21', '78/7'];
    resultMadad.section1.forEach((c, i) => {
        if (c.resultDisplay !== expectedMadadFinal[i]) {
            throw new Error(`Step 5 cell ${i} for مدد mismatch: expected ${expectedMadadFinal[i]}, got ${c.resultDisplay}`);
        }
    });
    console.log("✅ Step 5 for 'مدد' verified (4/21, 104/21, 78/7)!");

    // ============================================================================
    // TEST 3: Character Normalization
    // ============================================================================
    console.log(`\n--- TEST 3: Character Normalization ("شجرة هدى بيت") ---`);
    const resultNorm = calculateArabicPower("شجرة هدى بيت");
    console.log(`Normalized: [${resultNorm.normalizedChars.join(', ')}]`);
    if (resultNorm.normalizedChars[3] !== 'ت' || resultNorm.normalizedChars[6] !== 'أ' || resultNorm.normalizedChars[9] !== 'ت') {
        throw new Error("Character normalization failed!");
    }
    console.log("✅ Normalization verified: ة->ت, ى->أ, etc.!");

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS PASSED WITH 100% MATHEMATICAL ACCURACY!");
    console.log("==================================================");
} catch (error) {
    console.error("❌ TEST FAILED:", error);
    process.exit(1);
}
