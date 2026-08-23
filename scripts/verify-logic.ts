import { calculateArabicPower } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR 5-STEP LOGIC    ");
console.log("==================================================");

try {
    // TEST 1: Word "جليل" with cells 0, 1, 2 selected (Cell 3 unselected) - EXACT HANDWRITTEN SHEET 1 & 2
    const resultJaleelPartial = calculateArabicPower("جليل", [0, 1, 2]);
    console.log(`\n--- TEST 1: Word "جليل" with cells [1, 2, 3] selected matching handwritten sheet ---`);
    console.log(`Normalized chars: [${resultJaleelPartial.normalizedChars.join(', ')}]`);
    console.log(`Step 1 Sum S1 = ${resultJaleelPartial.step1Sum} (Expected: 40)`);
    console.log(`Step 2 Sum S2 = ${resultJaleelPartial.step2SumDisplay} (Expected: 30/1)`);
    
    // Check all 4 cells values in Step 5
    const cell1 = resultJaleelPartial.section1[0];
    const cell2 = resultJaleelPartial.section1[1];
    const cell3 = resultJaleelPartial.section1[2];
    const cell4 = resultJaleelPartial.section1[3];

    console.log(`Cell 1 (ج): Step 1=${cell1.step1Val}, Step 2=${cell1.step2Display}, Step 3=${cell1.step3Display}, Step 4=${cell1.step4GroupDisplay}, Ratio=${cell1.percentageDisplay}, Final=${cell1.resultDisplay}`);
    console.log(`Cell 2 (ل): Step 1=${cell2.step1Val}, Step 2=${cell2.step2Display}, Step 3=${cell2.step3Display}, Step 4=${cell2.step4GroupDisplay}, Ratio=${cell2.percentageDisplay}, Final=${cell2.resultDisplay}`);
    console.log(`Cell 3 (ي): Step 1=${cell3.step1Val}, Step 2=${cell3.step2Display}, Step 3=${cell3.step3Display}, Step 4=${cell3.step4GroupDisplay}, Ratio=${cell3.percentageDisplay}, Final=${cell3.resultDisplay}`);
    console.log(`Cell 4 (ل): Step 1=${cell4.step1Val}, Step 2=${cell4.step2Display}, Step 3=${cell4.step3Display}, Step 4=${cell4.step4GroupDisplay}, Ratio=${cell4.percentageDisplay}, Final=${cell4.resultDisplay}`);

    if (cell1.resultDisplay !== '1/12' || cell2.resultDisplay !== '20/3' || cell3.resultDisplay !== '27/4' || cell4.resultDisplay !== '80/3') {
        throw new Error(`Step 5 final cell values mismatch: ${cell1.resultDisplay}, ${cell2.resultDisplay}, ${cell3.resultDisplay}, ${cell4.resultDisplay}`);
    }
    console.log("✅ Step 5 Final values match handwritten Sheet 2 perfectly (1/12, 20/3, 27/4, 80/3)!");

    // Check Sum S for cells [1, 2, 3] = 1/12 + 20/3 + 27/4 = 27/2
    console.log(`Selected Sum S: ${resultJaleelPartial.transferredSumDisplay} (Expected: 27/2)`);
    if (resultJaleelPartial.transferredSumDisplay !== '27/2') {
        throw new Error(`Sum S mismatch: expected 27/2, got ${resultJaleelPartial.transferredSumDisplay}`);
    }

    // Check Answer 1: sqrt(27/2) -> 3.674234614 -> sum 40 -> 4
    console.log(`Answer 1 (الجواب الأول):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer1.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer1.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer1.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer1.singleDigit}`);
    if (resultJaleelPartial.answer1.fullDisplay10 !== '3.674234614' || resultJaleelPartial.answer1.singleDigit !== 4 || resultJaleelPartial.answer1.digitSumSteps[0] !== 40) {
        throw new Error(`Answer 1 mismatch: ${JSON.stringify(resultJaleelPartial.answer1)}`);
    }
    console.log("✅ Answer 1 matches handwritten Sheet 1 perfectly (3.674234614 -> 40 -> 4)!");

    // Check Answer 2: sqrt(9/2) -> 2.121320343 -> sum 21 -> 3
    console.log(`Answer 2 (الجواب الثاني):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer2.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer2.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer2.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer2.singleDigit}`);
    if (resultJaleelPartial.answer2.fullDisplay10 !== '2.121320343' || resultJaleelPartial.answer2.singleDigit !== 3 || resultJaleelPartial.answer2.digitSumSteps[0] !== 21) {
        throw new Error(`Answer 2 mismatch: ${JSON.stringify(resultJaleelPartial.answer2)}`);
    }
    console.log("✅ Answer 2 matches handwritten Sheet 1 perfectly (2.121320343 -> 21 -> 3)!");

    // Check Answer 3: sqrt(27/2) -> first 10 digits after dot: 6742346141 -> sum 38 -> 11 -> 2
    console.log(`Answer 3 (الجواب الثالث):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer3.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer3.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer3.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer3.singleDigit}`);
    if (resultJaleelPartial.answer3.extractedDigits !== '6742346141' || resultJaleelPartial.answer3.singleDigit !== 2 || resultJaleelPartial.answer3.digitSumSteps[0] !== 38) {
        throw new Error(`Answer 3 mismatch: ${JSON.stringify(resultJaleelPartial.answer3)}`);
    }
    console.log("✅ Answer 3 matches handwritten Sheet 1 perfectly (3.6742346141 -> 38 -> 11 -> 2)!");

    // Check Answer 4: sqrt(9/2) -> first 10 digits after dot: 1213203435 -> sum 24 -> 6
    console.log(`Answer 4 (الجواب الرابع):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer4.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer4.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer4.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer4.singleDigit}`);
    if (resultJaleelPartial.answer4.extractedDigits !== '1213203435' || resultJaleelPartial.answer4.singleDigit !== 6 || resultJaleelPartial.answer4.digitSumSteps[0] !== 24) {
        throw new Error(`Answer 4 mismatch: ${JSON.stringify(resultJaleelPartial.answer4)}`);
    }
    console.log("✅ Answer 4 matches handwritten Sheet 1 perfectly (2.1213203435 -> 24 -> 6)!");

    // TEST 2: Normalization verification
    const resultNorm = calculateArabicPower("شجرة هدى بيت");
    console.log(`\n--- TEST 2: Character Normalization ("شجرة هدى بيت") ---`);
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
