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

    if (cell1.resultDisplay !== '1/12' || cell2.resultDisplay !== '10/3' || cell3.resultDisplay !== '27/4' || cell4.resultDisplay !== '40/3') {
        throw new Error(`Step 5 final cell values mismatch: ${cell1.resultDisplay}, ${cell2.resultDisplay}, ${cell3.resultDisplay}, ${cell4.resultDisplay}`);
    }
    console.log("✅ Step 5 Final values match handwritten Sheet perfectly (1/12, 10/3, 27/4, 40/3)!");

    // Check Sum S for cells [1, 2, 3] = 1/12 + 10/3 + 27/4 = 61/6
    console.log(`Selected Sum S: ${resultJaleelPartial.transferredSumDisplay} (Expected: 61/6)`);
    if (resultJaleelPartial.transferredSumDisplay !== '61/6') {
        throw new Error(`Sum S mismatch: expected 61/6, got ${resultJaleelPartial.transferredSumDisplay}`);
    }

    // Check Answer 1: sqrt(61/6) -> 3.188521078 -> sum 43 -> 7
    console.log(`Answer 1 (الجواب الأول):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer1.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer1.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer1.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer1.singleDigit}`);
    if (resultJaleelPartial.answer1.fullDisplay10 !== '3.188521078' || resultJaleelPartial.answer1.singleDigit !== 7 || resultJaleelPartial.answer1.digitSumSteps[0] !== 43) {
        throw new Error(`Answer 1 mismatch: ${JSON.stringify(resultJaleelPartial.answer1)}`);
    }
    console.log("✅ Answer 1 verified (3.188521078 -> 43 -> 7)!");

    // Check Answer 2: sqrt(61/18) -> 1.840893502 -> sum 40 -> 4
    console.log(`Answer 2 (الجواب الثاني):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer2.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer2.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer2.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer2.singleDigit}`);
    if (resultJaleelPartial.answer2.fullDisplay10 !== '1.840893502' || resultJaleelPartial.answer2.singleDigit !== 4 || resultJaleelPartial.answer2.digitSumSteps[0] !== 40) {
        throw new Error(`Answer 2 mismatch: ${JSON.stringify(resultJaleelPartial.answer2)}`);
    }
    console.log("✅ Answer 2 verified (1.840893502 -> 40 -> 4)!");

    // Check Answer 3: sqrt(61/6) -> first 10 digits after dot: 1885210782 -> sum 42 -> 6
    console.log(`Answer 3 (الجواب الثالث):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer3.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer3.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer3.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer3.singleDigit}`);
    if (resultJaleelPartial.answer3.extractedDigits !== '1885210782' || resultJaleelPartial.answer3.singleDigit !== 6 || resultJaleelPartial.answer3.digitSumSteps[0] !== 42) {
        throw new Error(`Answer 3 mismatch: ${JSON.stringify(resultJaleelPartial.answer3)}`);
    }
    console.log("✅ Answer 3 verified (3.1885210782 -> 42 -> 6)!");

    // Check Answer 4: sqrt(61/18) -> first 10 digits after dot: 8408935028 -> sum 47 -> 11 -> 2
    console.log(`Answer 4 (الجواب الرابع):`);
    console.log(`  - 10 Digits Display: ${resultJaleelPartial.answer4.fullDisplay10}`);
    console.log(`  - Digits List      : ${resultJaleelPartial.answer4.digitsList.join(', ')}`);
    console.log(`  - Steps & Single   : ${resultJaleelPartial.answer4.digitSumSteps.join(' -> ')} => ${resultJaleelPartial.answer4.singleDigit}`);
    if (resultJaleelPartial.answer4.extractedDigits !== '8408935028' || resultJaleelPartial.answer4.singleDigit !== 2 || resultJaleelPartial.answer4.digitSumSteps[0] !== 47) {
        throw new Error(`Answer 4 mismatch: ${JSON.stringify(resultJaleelPartial.answer4)}`);
    }
    console.log("✅ Answer 4 verified (1.8408935028 -> 47 -> 11 -> 2)!");

    // TEST 2: Normalization verification
    const resultNorm = calculateArabicPower("شجرة هدى بيت");
    console.log(`\n--- TEST 2: Character Normalization ("شجرة هدى بيت") ---`);
    console.log(`Normalized: [${resultNorm.normalizedChars.join(', ')}]`);
    if (resultNorm.normalizedChars[3] !== 'ت' || resultNorm.normalizedChars[6] !== 'أ' || resultNorm.normalizedChars[9] !== 'ت') {
        throw new Error("Character normalization failed!");
    }
    console.log("✅ Normalization verified: ة->ت, ى->أ, etc.!");

    // TEST 3: Step 1 Exact Calculations (Word "مكارم" & Word "مدد")
    console.log(`\n--- TEST 3: Step 1 Calculations (Words "مكارم" and "مدد") ---`);
    const resultMakarim = calculateArabicPower("مكارم");
    console.log(`Word "مكارم": positions sum S=${resultMakarim.step1Details.sumPositions} (Expected: 15), Step 1 fraction=${resultMakarim.step1Details.rawFractionDisplay} (Expected: 225/4)`);
    if (resultMakarim.step1Details.sumPositions !== 15 || resultMakarim.step1Details.rawFractionDisplay !== '225/4') {
        throw new Error(`Step 1 for مكارم failed: got ${resultMakarim.step1Details.rawFractionDisplay}`);
    }

    const resultMadad = calculateArabicPower("مدد");
    console.log(`Word "مدد": positions sum S=${resultMadad.step1Details.sumPositions} (Expected: 6), raw=${resultMadad.step1Details.rawFractionDisplay} (Expected: 36/4), simplified=${resultMadad.step1Details.fractionDisplay} (Expected: 9/1)`);
    if (resultMadad.step1Details.sumPositions !== 6 || resultMadad.step1Details.rawFractionDisplay !== '36/4' || resultMadad.step1Details.fractionDisplay !== '9/1') {
        throw new Error(`Step 1 for مدد failed: got raw ${resultMadad.step1Details.rawFractionDisplay}, simplified ${resultMadad.step1Details.fractionDisplay}`);
    }
    console.log("✅ Step 1 verified for مكارم (225/4) and مدد (36/4 = 9/1) perfectly!");

    console.log("\n==================================================");
    console.log("🎉 ALL TESTS PASSED WITH 100% MATHEMATICAL ACCURACY!");
    console.log("==================================================");
} catch (error) {
    console.error("❌ TEST FAILED:", error);
    process.exit(1);
}
