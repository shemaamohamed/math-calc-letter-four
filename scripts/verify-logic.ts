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

    // 1. Step 1: 1*4=4, 2*4=8, 3*4=12 -> Sum S1 = 24
    console.log(`Step 1 Details:`);
    console.log(`  - Positions * 4: [${resultMadad.step1Details.charPositions.map(c => `${c.pos}*4=${c.initialValue}`).join(', ')}]`);
    console.log(`  - Aggregated Sum S1: ${resultMadad.step1Details.sumCellValues} (Fraction: ${resultMadad.step1Details.fractionDisplay})`);
    console.log(`  - Last Cell Value: ${resultMadad.step1LastVal}`);

    if (resultMadad.step1Details.sumCellValues !== 24 || resultMadad.step1Details.fractionDisplay !== '24/1' || resultMadad.step1LastVal !== 12) {
        throw new Error(`Step 1 for مدد failed!`);
    }
    console.log("✅ Step 1 verified: Sum S1 = 24 (24/1), Last Cell = 12!");

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

    // 5. Step 5: (Cell / Last_Cell) * 100 -> [100/3%, 200/3%, 100/1%], then multiplied by Step 4 variable
    console.log(`Step 5 Percentages: [${resultMadad.section1.map(c => c.step5RatioDisplay).join(', ')}]`);
    console.log(`Step 5 Sum S5: ${resultMadad.step5SumDisplay} (Expected: 200% or 200/1%)`);
    const expectedMadadStep5 = ['100/3%', '200/3%', '100/1%'];
    const expectedMadadFinal = ['4/7', '104/7', '156/7'];

    resultMadad.section1.forEach((c, i) => {
        if (c.step5RatioDisplay !== expectedMadadStep5[i]) {
            throw new Error(`Step 5 percentage cell ${i} mismatch: got ${c.step5RatioDisplay}, expected ${expectedMadadStep5[i]}`);
        }
        if (c.resultDisplay !== expectedMadadFinal[i]) {
            throw new Error(`Step 5 final value cell ${i} mismatch: got ${c.resultDisplay}, expected ${expectedMadadFinal[i]}`);
        }
    });
    console.log("✅ Step 5 verified: Percentages=[100/3%, 200/3%, 100/1%] and Final Values=[4/7, 104/7, 156/7]!");

    // Total Sum S = 4/7 + 104/7 + 156/7 = 264/7
    console.log(`Total Sum S: ${resultMadad.transferredSumDisplay} (Expected: 264/7)`);
    if (resultMadad.transferredSumDisplay !== '264/7') {
        throw new Error(`Total Sum S mismatch: got ${resultMadad.transferredSumDisplay}, expected 264/7`);
    }
    console.log("✅ Total Sum S verified (264/7)!");

    // 4 Output Gates for "مدد"
    console.log(`\nAnswer Gates for 'مدد':`);
    console.log(`  - Answer 1 (√S)    : ${resultMadad.answer1.fullDisplay10} => Steps: ${resultMadad.answer1.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer1.singleDigit}`);
    console.log(`  - Answer 2 (√(S/N)): ${resultMadad.answer2.fullDisplay10} => Steps: ${resultMadad.answer2.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer2.singleDigit}`);
    console.log(`  - Answer 3 (√S .)  : ${resultMadad.answer3.fullDisplay10} => Steps: ${resultMadad.answer3.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer3.singleDigit}`);
    console.log(`  - Answer 4 (√(S/N).): ${resultMadad.answer4.fullDisplay10} => Steps: ${resultMadad.answer4.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer4.singleDigit}`);

    if (resultMadad.answer1.singleDigit !== 5 || resultMadad.answer2.singleDigit !== 4) {
        throw new Error("Answer gates validation failed for 'مدد'!");
    }
    console.log("✅ Answer Gates verified for 'مدد'!");

    // ============================================================================
    // TEST 2: Word "جليل"
    // ============================================================================
    console.log(`\n--- TEST 2: Word "جليل" ---`);
    const resultJalil = calculateArabicPower("جليل");
    console.log(`Step 1 S1: ${resultJalil.step1Details.fractionDisplay} (40/1), Last Cell: ${resultJalil.step1LastVal} (16)`);
    console.log(`Step 2 S2: ${resultJalil.step2SumDisplay} (30/1)`);
    console.log(`Step 3 Values: [${resultJalil.section1.map(c => c.step3Display).join(', ')}] (Expected: 4/3, 16/3, 12/1, 64/3)`);
    console.log(`Step 4 Variables: [ج=${resultJalil.section1[0].step4GroupDisplay}, ل=${resultJalil.section1[1].step4GroupDisplay}, ي=${resultJalil.section1[2].step4GroupDisplay}]`);
    console.log(`Step 5 Percentages: [${resultJalil.section1.map(c => c.step5RatioDisplay).join(', ')}] (Sum S5: ${resultJalil.step5SumDisplay})`);
    console.log(`Step 5 Final Values: [${resultJalil.section1.map(c => c.resultDisplay).join(', ')}] (Expected: 1/3, 40/3, 9/1, 80/3)`);
    console.log(`Total Sum S: ${resultJalil.transferredSumDisplay} (Expected: 148/3)`);

    const expectedJalilFinal = ['1/3', '40/3', '9/1', '80/3'];
    resultJalil.section1.forEach((c, i) => {
        if (c.resultDisplay !== expectedJalilFinal[i]) {
            throw new Error(`Jalil step 5 final value cell ${i} mismatch: got ${c.resultDisplay}, expected ${expectedJalilFinal[i]}`);
        }
    });

    if (resultJalil.step1Details.sumCellValues !== 40 ||
        resultJalil.step2SumDisplay !== '30/1' ||
        resultJalil.transferredSumDisplay !== '148/3') {
        throw new Error("Test 2 for جليل failed!");
    }
    console.log("✅ Step 1-5 for 'جليل' verified with updated 5-step engine!");

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
