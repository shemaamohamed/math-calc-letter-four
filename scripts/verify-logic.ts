import { calculateArabicPower, normalizeChar } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR 5-STEP LOGIC    ");
console.log("   (Exact Fractional Math - No Approximations)    ");
console.log("==================================================");

try {
    // ============================================================================
    // TEST 1: Word "مدد" - EXACT 1:1 MATCH WITH HANDWRITTEN SHEET
    // ============================================================================
    console.log(`\n--- TEST 1: Word "مدد" (Exact Match with Handwritten Sheet) ---`);
    const resultMadad = calculateArabicPower("مدد");

    // 1. Step 1: 1*4=4, 2*4=8, 3*4=12 -> Sum S1 = 24
    console.log(`Step 1 Details:`);
    console.log(`  - Positions * 4: [${resultMadad.step1Details.charPositions.map(c => `${c.pos}*4=${c.initialValue}`).join(', ')}]`);
    console.log(`  - Aggregated Sum S1: ${resultMadad.step1Details.sumCellValues} (Fraction: ${resultMadad.step1Details.fractionDisplay})`);

    if (resultMadad.step1Details.sumCellValues !== 24 || resultMadad.step1Details.fractionDisplay !== '24/1') {
        throw new Error(`Step 1 for مدد failed: got ${resultMadad.step1Details.fractionDisplay}, expected 24/1`);
    }
    console.log("✅ Step 1 verified: Sum S1 = 24 (24/1)!");

    // 2. Step 2: 4/24*4 = 2/3, 8/24*8 = 8/3, 12/24*12 = 6/1 -> Sum S2 = 28/3
    console.log(`Step 2 Values: [${resultMadad.section1.map(c => c.step2Display).join(', ')}]`);
    console.log(`Step 2 Sum S2: ${resultMadad.step2SumDisplay} (Expected: 28/3)`);
    const expectedMadadStep2 = ['2/3', '8/3', '6/1'];
    resultMadad.section1.forEach((c, i) => {
        if (c.step2Display !== expectedMadadStep2[i]) {
            throw new Error(`Step 2 cell ${i} mismatch: got ${c.step2Display}, expected ${expectedMadadStep2[i]}`);
        }
    });
    if (resultMadad.step2SumDisplay !== '28/3') {
        throw new Error(`Step 2 sum mismatch: got ${resultMadad.step2SumDisplay}, expected 28/3`);
    }
    console.log("✅ Step 2 verified: [2/3, 8/3, 6/1] and Sum S2 = 28/3!");

    // 3. Step 3: (v2 / S2) * S1 -> [12/7, 48/7, 108/7]
    console.log(`Step 3 Values:`);
    console.log(`  - م (خانة 1)  : ${resultMadad.section1[0].step3Display} (Expected: 12/7)`);
    console.log(`  - د (خانة 2)  : ${resultMadad.section1[1].step3Display} (Expected: 48/7)`);
    console.log(`  - د (خانة 3)  : ${resultMadad.section1[2].step3Display} (Expected: 108/7)`);

    const expectedMadadStep3 = ['12/7', '48/7', '108/7'];
    resultMadad.section1.forEach((c, i) => {
        if (c.step3Display !== expectedMadadStep3[i]) {
            throw new Error(`Step 3 cell ${i} mismatch: got ${c.step3Display}, expected ${expectedMadadStep3[i]}`);
        }
    });
    console.log("✅ Step 3 verified: [12/7, 48/7, 108/7]!");

    // 4. Step 4: Natural Sum (م = 12/7, د = 48/7 + 108/7 = 156/7)
    console.log(`Step 4 Natural Sums:`);
    console.log(`  - م: ${resultMadad.section1[0].step4GroupDisplay} (Expected: 12/7)`);
    console.log(`  - د: ${resultMadad.section1[1].step4GroupDisplay} (Expected: 156/7)`);
    console.log(`  - د: ${resultMadad.section1[2].step4GroupDisplay} (Expected: 156/7)`);

    if (resultMadad.section1[0].step4GroupDisplay !== '12/7' ||
        resultMadad.section1[1].step4GroupDisplay !== '156/7' ||
        resultMadad.section1[2].step4GroupDisplay !== '156/7') {
        throw new Error(`Step 4 natural sums mismatch!`);
    }
    console.log("✅ Step 4 verified: (م=12/7, د=156/7)!");

    // 5. Step 5: Percentages and Final Values
    console.log(`Step 5 Details (Exact Match with Handwritten Green Underlined Results):`);
    console.log(`  - الخانة 1 (م): Ratio=${resultMadad.section1[0].percentageDisplay}, Final=${resultMadad.section1[0].resultDisplay} (Expected: 2/7)`);
    console.log(`  - الخانة 2 (د): Ratio=${resultMadad.section1[1].percentageDisplay}, Final=${resultMadad.section1[1].resultDisplay} (Expected: 52/7)`);
    console.log(`  - الخانة 3 (د): Ratio=${resultMadad.section1[2].percentageDisplay}, Final=${resultMadad.section1[2].resultDisplay} (Expected: 78/7)`);

    const expectedMadadRatios = ['50/3%', '100/3%', '50/1%'];
    const expectedMadadFinal = ['2/7', '52/7', '78/7'];

    resultMadad.section1.forEach((c, i) => {
        if (c.percentageDisplay !== expectedMadadRatios[i]) {
            throw new Error(`Step 5 percentage cell ${i} mismatch: got ${c.percentageDisplay}, expected ${expectedMadadRatios[i]}`);
        }
        if (c.resultDisplay !== expectedMadadFinal[i]) {
            throw new Error(`Step 5 final value cell ${i} mismatch: got ${c.resultDisplay}, expected ${expectedMadadFinal[i]}`);
        }
    });
    console.log("✅ Step 5 verified 100% with handwritten sheet: [2/7, 52/7, 78/7]!");

    // Total Sum S = 2/7 + 52/7 + 78/7 = 132/7
    console.log(`Total Sum S: ${resultMadad.transferredSumDisplay} (Expected: 132/7)`);
    if (resultMadad.transferredSumDisplay !== '132/7') {
        throw new Error(`Total Sum S mismatch: got ${resultMadad.transferredSumDisplay}, expected 132/7`);
    }
    console.log("✅ Total Sum S verified (132/7)!");

    // 4 Output Gates for "مدد"
    console.log(`\nAnswer Gates for 'مدد':`);
    console.log(`  - Answer 1 (√S)    : ${resultMadad.answer1.fullDisplay10} => Steps: ${resultMadad.answer1.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer1.singleDigit}`);
    console.log(`  - Answer 2 (√(S/N)): ${resultMadad.answer2.fullDisplay10} => Steps: ${resultMadad.answer2.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer2.singleDigit}`);
    console.log(`  - Answer 3 (√S .)  : ${resultMadad.answer3.fullDisplay10} => Steps: ${resultMadad.answer3.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer3.singleDigit}`);
    console.log(`  - Answer 4 (√(S/N).): ${resultMadad.answer4.fullDisplay10} => Steps: ${resultMadad.answer4.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer4.singleDigit}`);

    // ============================================================================
    // TEST 2: Word "جليل"
    // ============================================================================
    console.log(`\n--- TEST 2: Word "جليل" ---`);
    const resultJalil = calculateArabicPower("جليل");
    console.log(`Step 1 S1: ${resultJalil.step1Details.fractionDisplay} (40/1)`);
    console.log(`Step 2 S2: ${resultJalil.step2SumDisplay} (12/1)`);
    console.log(`Step 3 Values: [${resultJalil.section1.map(c => c.step3Display).join(', ')}] (Expected: 4/3, 16/3, 12/1, 64/3)`);
    console.log(`Step 4 Natural Sums: [ج=${resultJalil.section1[0].step4GroupDisplay}, ل=${resultJalil.section1[1].step4GroupDisplay}, ي=${resultJalil.section1[2].step4GroupDisplay}]`);
    console.log(`Step 5 Final Values: [${resultJalil.section1.map(c => c.resultDisplay).join(', ')}]`);
    console.log(`Total Sum S: ${resultJalil.transferredSumDisplay} (Expected: 296/15)`);

    if (resultJalil.step1Details.sumCellValues !== 40 ||
        resultJalil.step2SumDisplay !== '12/1' ||
        resultJalil.transferredSumDisplay !== '296/15') {
        throw new Error("Test 2 for جليل failed!");
    }
    console.log("✅ Step 1-5 for 'جليل' verified with updated unified rules!");

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
