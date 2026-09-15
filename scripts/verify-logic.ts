import { calculateArabicPower, normalizeChar } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR 6-STEP ENGINE   ");
console.log("   (Exact Fractional Math - No Approximations)    ");
console.log("==================================================");

try {
    // ============================================================================
    // TEST 1: Word "مدد" - EXACT 1:1 MATCH WITH HANDWRITTEN SHEET
    // ============================================================================
    console.log(`\n--- TEST 1: Word "مدد" (Exact Match with Handwritten Sheet) ---`);
    const resultMadad = calculateArabicPower("مدد");

    // 1. Step 1: العد المباشر الطبيعي: الخانة 1 = 1، الخانة 2 = 2، الخانة 3 = 3 -> Sum S1 = 6
    console.log(`Step 1 Details:`);
    console.log(`  - Direct Count Positions: [${resultMadad.step1Details.charPositions.map(c => `الخانة ${c.pos}=${c.initialValue}`).join(', ')}]`);
    console.log(`  - Aggregated Sum S1: ${resultMadad.step1Details.sumCellValues} (Fraction: ${resultMadad.step1Details.fractionDisplay})`);
    console.log(`  - Last Cell Value: ${resultMadad.step1LastVal}`);

    if (resultMadad.step1Details.sumCellValues !== 6 || resultMadad.step1Details.fractionDisplay !== '6/1' || resultMadad.step1LastVal !== 3) {
        throw new Error(`Step 1 for مدد failed!`);
    }
    console.log("✅ Step 1 verified: Sum S1 = 6 (6/1), Last Cell = 3!");

    // 2. Step 2: (Cell / Last_Cell) * Cell -> 4/12*4 = 4/3, 8/12*8 = 16/3, 12/12*12 = 12/1 -> Sum S2 = 56/3
    console.log(`Step 2 Values: [${resultMadad.section1.map(c => c.step2Display).join(', ')}]`);
    console.log(`Step 2 Sum S2: ${resultMadad.step2SumDisplay} (Expected: 56/3)`);
    const expectedMadadStep2 = ['4/3', '16/3', '12/1'];
    resultMadad.section1.forEach((c, i) => {
        if (c.step2Display !== expectedMadadStep2[i]) {
            throw new Error(`Step 2 cell ${i} mismatch: got ${c.step2Display}, expected ${expectedMadadStep2[i]}`);
        }
    });
    if (resultMadad.step2SumDisplay !== '56/3') {
        throw new Error(`Step 2 sum mismatch: got ${resultMadad.step2SumDisplay}, expected 56/3`);
    }
    console.log("✅ Step 2 verified: [4/3, 16/3, 12/1] and Sum S2 = 56/3!");

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

    // 4. Step 4: Natural Sum / Variables (م = 12/7, د = 48/7 + 108/7 = 156/7)
    console.log(`Step 4 Natural Sums / Variables:`);
    console.log(`  - م: ${resultMadad.section1[0].step4GroupDisplay} (Expected: 12/7)`);
    console.log(`  - د: ${resultMadad.section1[1].step4GroupDisplay} (Expected: 156/7)`);
    console.log(`  - د: ${resultMadad.section1[2].step4GroupDisplay} (Expected: 156/7)`);

    if (resultMadad.section1[0].step4GroupDisplay !== '12/7' ||
        resultMadad.section1[1].step4GroupDisplay !== '156/7' ||
        resultMadad.section1[2].step4GroupDisplay !== '156/7') {
        throw new Error(`Step 4 natural sums mismatch!`);
    }
    console.log("✅ Step 4 verified: (م = 12/7, د = 156/7)!");

    // 5. Step 5: (v3_i / v3_last) * 100 -> [100/9, 400/9, 100/1] -> Sum S5 = 1400/9
    console.log(`Step 5 Values: [${resultMadad.section1.map(c => c.step5Display).join(', ')}]`);
    console.log(`Step 5 Sum S5: ${resultMadad.step5SumDisplay} (Expected: 1400/9)`);
    const expectedMadadStep5 = ['100/9', '400/9', '100/1'];
    resultMadad.section1.forEach((c, i) => {
        if (c.step5Display !== expectedMadadStep5[i]) {
            throw new Error(`Step 5 cell ${i} mismatch: got ${c.step5Display}, expected ${expectedMadadStep5[i]}`);
        }
    });
    if (resultMadad.step5SumDisplay !== '1400/9') {
        throw new Error(`Step 5 Sum mismatch: got ${resultMadad.step5SumDisplay}, expected 1400/9`);
    }
    console.log("✅ Step 5 verified: Values=[100/9, 400/9, 100/1] and Sum S5 = 1400/9!");

    // 6. Step 6: (v5_i / S5) * 100 -> [50/7%, 200/7%, 450/7%], then multiplied by Step 4 variable
    console.log(`Step 6 Percentages: [${resultMadad.section1.map(c => c.step6RatioDisplay).join(', ')}]`);
    console.log(`Step 6 Sum: ${resultMadad.step6SumRatioDisplay} (Expected: 100%)`);
    const expectedMadadStep6 = ['50/7%', '200/7%', '450/7%'];
    const expectedMadadFinal = ['6/49', '312/49', '702/49'];

    resultMadad.section1.forEach((c, i) => {
        if (c.step6RatioDisplay !== expectedMadadStep6[i]) {
            throw new Error(`Step 6 percentage cell ${i} mismatch: got ${c.step6RatioDisplay}, expected ${expectedMadadStep6[i]}`);
        }
        if (c.resultDisplay !== expectedMadadFinal[i]) {
            throw new Error(`Final value cell ${i} mismatch: got ${c.resultDisplay}, expected ${expectedMadadFinal[i]}`);
        }
    });
    console.log("✅ Step 6 verified: Percentages=[50/7%, 200/7%, 450/7%] and Final Values=[6/49, 312/49, 702/49]!");

    // Total Sum S = 6/49 + 312/49 + 702/49 = 1020/49
    console.log(`Total Sum S: ${resultMadad.transferredSumDisplay} (Expected: 1020/49)`);
    if (resultMadad.transferredSumDisplay !== '1020/49') {
        throw new Error(`Total Sum S mismatch: got ${resultMadad.transferredSumDisplay}, expected 1020/49`);
    }
    console.log("✅ Total Sum S verified (1020/49)!");

    // 4 Output Gates for "مدد"
    console.log(`\nAnswer Gates for 'مدد':`);
    console.log(`  - Answer 1 (√S)    : ${resultMadad.answer1.fullDisplay10} => Steps: ${resultMadad.answer1.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer1.singleDigit}`);
    console.log(`  - Answer 2 (√(S/N)): ${resultMadad.answer2.fullDisplay10} => Steps: ${resultMadad.answer2.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer2.singleDigit}`);
    console.log(`  - Answer 3 (√S .)  : ${resultMadad.answer3.fullDisplay10} => Steps: ${resultMadad.answer3.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer3.singleDigit}`);
    console.log(`  - Answer 4 (√(S/N).): ${resultMadad.answer4.fullDisplay10} => Steps: ${resultMadad.answer4.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer4.singleDigit}`);

    if (resultMadad.answer1.singleDigit !== 6 || resultMadad.answer2.singleDigit !== 9 ||
        resultMadad.answer3.singleDigit !== 8 || resultMadad.answer4.singleDigit !== 9) {
        throw new Error("Answer gates validation failed for 'مدد'!");
    }
    console.log("✅ Answer Gates verified for 'مدد' (Roots: 6, 9, 8, 9)!");

    // ============================================================================
    // TEST 2: Word "جليل"
    // ============================================================================
    console.log(`\n--- TEST 2: Word "جليل" ---`);
    const resultJalil = calculateArabicPower("جليل");
    console.log(`Step 1 S1: ${resultJalil.step1Details.fractionDisplay} (10/1), Last Cell: ${resultJalil.step1LastVal} (4)`);
    console.log(`Step 2 S2: ${resultJalil.step2SumDisplay} (30/1)`);
    console.log(`Step 3 Values: [${resultJalil.section1.map(c => c.step3Display).join(', ')}] (Expected: 4/3, 16/3, 12/1, 64/3)`);
    console.log(`Step 4 Variables: [ج=${resultJalil.section1[0].step4GroupDisplay}, ل=${resultJalil.section1[1].step4GroupDisplay}, ي=${resultJalil.section1[2].step4GroupDisplay}]`);
    console.log(`Step 5 Values: [${resultJalil.section1.map(c => c.step5Display).join(', ')}] (Sum S5: ${resultJalil.step5SumDisplay})`);
    console.log(`Step 6 Percentages: [${resultJalil.section1.map(c => c.step6RatioDisplay).join(', ')}]`);
    console.log(`Step 6 Final Values: [${resultJalil.section1.map(c => c.resultDisplay).join(', ')}] (Expected: 2/45, 32/9, 18/5, 128/9)`);
    console.log(`Total Sum S: ${resultJalil.transferredSumDisplay} (Expected: 964/45)`);

    const expectedJalilFinal = ['2/45', '32/9', '18/5', '128/9'];
    resultJalil.section1.forEach((c, i) => {
        if (c.resultDisplay !== expectedJalilFinal[i]) {
            throw new Error(`Jalil final value cell ${i} mismatch: got ${c.resultDisplay}, expected ${expectedJalilFinal[i]}`);
        }
    });

    if (resultJalil.step1Details.sumCellValues !== 10 ||
        resultJalil.step2SumDisplay !== '30/1' ||
        resultJalil.transferredSumDisplay !== '964/45') {
        throw new Error("Test 2 for جليل failed!");
    }
    console.log("✅ Step 1-6 for 'جليل' verified with updated 6-step engine!");

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
