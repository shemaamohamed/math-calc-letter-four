import { calculateArabicPower } from '../src/lib/calculate';

console.log("==================================================");
console.log("   RUNNING VERIFICATION TESTS FOR 5-STEP LOGIC    ");
console.log("==================================================");

try {
    // TEST 1: Word "مدد" - EXACT HANDWRITTEN SHEET MATCH 100%
    console.log(`\n--- TEST 1: Word "مدد" (All 5 Steps matching handwritten Sheet) ---`);
    const resultMadad = calculateArabicPower("مدد");
    
    console.log(`Step 1: S = ${resultMadad.step1Details.sumPositions}, raw=${resultMadad.step1Details.rawFractionDisplay}, simplified=${resultMadad.step1Details.fractionDisplay}`);
    if (resultMadad.step1Details.sumPositions !== 6 || resultMadad.step1Details.fractionDisplay !== '9/1') {
        throw new Error(`Step 1 for مدد failed: got ${resultMadad.step1Details.fractionDisplay}`);
    }

    console.log(`Step 2 Sum S2: ${resultMadad.step2SumDisplay} (Expected: 14/3)`);
    if (resultMadad.step2SumDisplay !== '14/3') {
        throw new Error(`Step 2 sum S2 mismatch: expected 14/3, got ${resultMadad.step2SumDisplay}`);
    }

    // Check Step 3 values: م=9/14, د1=18/7, د2=81/14
    const cellM = resultMadad.section1[0];
    const cellD1 = resultMadad.section1[1];
    const cellD2 = resultMadad.section1[2];

    console.log(`Step 3 Values:`);
    console.log(`  - م  : ${cellM.step3Display} (Expected: 9/14)`);
    console.log(`  - د#1: ${cellD1.step3Display} (Expected: 18/7)`);
    console.log(`  - د#2: ${cellD2.step3Display} (Expected: 81/14)`);

    if (cellM.step3Display !== '9/14' || cellD1.step3Display !== '18/7' || cellD2.step3Display !== '81/14') {
        throw new Error(`Step 3 values mismatch: م=${cellM.step3Display}, د1=${cellD1.step3Display}, د2=${cellD2.step3Display}`);
    }
    console.log("✅ Step 3 values match handwritten Sheet perfectly (9/14, 18/7, 81/14)!");

    // Check Step 4 (averages): م=9/14, د=117/28
    console.log(`Step 4 Averages:`);
    console.log(`  - م: ${cellM.step4GroupDisplay} (Expected: 9/14)`);
    console.log(`  - د: ${cellD1.step4GroupDisplay} (Expected: 117/28)`);
    if (cellM.step4GroupDisplay !== '9/14' || cellD1.step4GroupDisplay !== '117/28') {
        throw new Error(`Step 4 average mismatch: م=${cellM.step4GroupDisplay}, د=${cellD1.step4GroupDisplay}`);
    }
    console.log("✅ Step 4 averages match handwritten Sheet perfectly (9/14, 117/28)!");

    // Check Step 5 final cell values: م=1/14, د1=13/7, د2=117/28
    console.log(`Step 5 Final Values:`);
    console.log(`  - م  : Ratio=${cellM.percentageDisplay}, Final=${cellM.resultDisplay} (Expected: 1/14)`);
    console.log(`  - د#1: Ratio=${cellD1.percentageDisplay}, Final=${cellD1.resultDisplay} (Expected: 13/7)`);
    console.log(`  - د#2: Ratio=${cellD2.percentageDisplay}, Final=${cellD2.resultDisplay} (Expected: 117/28)`);

    if (cellM.resultDisplay !== '1/14' || cellD1.resultDisplay !== '13/7' || cellD2.resultDisplay !== '117/28') {
        throw new Error(`Step 5 final cell values mismatch: ${cellM.resultDisplay}, ${cellD1.resultDisplay}, ${cellD2.resultDisplay}`);
    }
    console.log("✅ Step 5 Final values match handwritten Sheet perfectly (1/14, 13/7, 117/28)!");

    // Check Sum S = 1/14 + 13/7 + 117/28 = 171/28
    console.log(`Total Sum S: ${resultMadad.transferredSumDisplay} (Expected: 171/28)`);
    if (resultMadad.transferredSumDisplay !== '171/28') {
        throw new Error(`Sum S mismatch: expected 171/28, got ${resultMadad.transferredSumDisplay}`);
    }

    // Check 4 Answer Gates
    console.log(`Answer 1: ${resultMadad.answer1.fullDisplay10} => Steps: ${resultMadad.answer1.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer1.singleDigit}`);
    console.log(`Answer 2: ${resultMadad.answer2.fullDisplay10} => Steps: ${resultMadad.answer2.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer2.singleDigit}`);
    console.log(`Answer 3: ${resultMadad.answer3.fullDisplay10} => Steps: ${resultMadad.answer3.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer3.singleDigit}`);
    console.log(`Answer 4: ${resultMadad.answer4.fullDisplay10} => Steps: ${resultMadad.answer4.digitSumSteps.join(' -> ')} => Root: ${resultMadad.answer4.singleDigit}`);
    
    if (resultMadad.answer1.fullDisplay10 !== '2.471263413' || resultMadad.answer1.singleDigit !== 6) {
        throw new Error(`Answer 1 mismatch: ${JSON.stringify(resultMadad.answer1)}`);
    }
    if (resultMadad.answer2.fullDisplay10 !== '1.426784596' || resultMadad.answer2.singleDigit !== 7) {
        throw new Error(`Answer 2 mismatch: ${JSON.stringify(resultMadad.answer2)}`);
    }
    if (resultMadad.answer3.extractedDigits !== '4712634131' || resultMadad.answer3.singleDigit !== 5) {
        throw new Error(`Answer 3 mismatch: ${JSON.stringify(resultMadad.answer3)}`);
    }
    if (resultMadad.answer4.extractedDigits !== '4267845968' || resultMadad.answer4.singleDigit !== 5) {
        throw new Error(`Answer 4 mismatch: ${JSON.stringify(resultMadad.answer4)}`);
    }
    console.log("✅ All 4 Answer Gates verified for 'مدد'!");

    // TEST 2: Word "مكارم"
    console.log(`\n--- TEST 2: Word "مكارم" ---`);
    const resultMakarim = calculateArabicPower("مكارم");
    console.log(`Step 1 S=${resultMakarim.step1Details.sumPositions}, fraction=${resultMakarim.step1Details.rawFractionDisplay}`);
    if (resultMakarim.step1Details.sumPositions !== 15 || resultMakarim.step1Details.rawFractionDisplay !== '225/4') {
        throw new Error(`Step 1 for مكارم failed: got ${resultMakarim.step1Details.rawFractionDisplay}`);
    }
    console.log(`Step 2 S2: ${resultMakarim.step2SumDisplay} (Expected: 11/1)`);
    if (resultMakarim.step2SumDisplay !== '11/1') {
        throw new Error(`Step 2 for مكارم failed: got ${resultMakarim.step2SumDisplay}`);
    }
    console.log(`Step 3 values for مكارم: [${resultMakarim.section1.map(c => c.step3Display).join(', ')}] (Expected: 45/44, 45/11, 405/44, 180/11, 1125/44)`);
    const makarimStep3Expected = ['45/44', '45/11', '405/44', '180/11', '1125/44'];
    resultMakarim.section1.forEach((c, i) => {
        if (c.step3Display !== makarimStep3Expected[i]) {
            throw new Error(`Step 3 cell ${i} for مكارم mismatch: expected ${makarimStep3Expected[i]}, got ${c.step3Display}`);
        }
    });
    console.log("✅ Step 3 for 'مكارم' verified (45/44, 45/11, 405/44, 180/11, 1125/44)!");

    // TEST 3: Character Normalization
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
