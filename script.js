document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generate").addEventListener("click", generateWords);
});

function generateWords() {
    const numWords = parseInt(document.getElementById("numWords").value, 10);
    const pos = document.getElementById("pos").value;
    const wordClass = parseInt(document.getElementById("class").value, 10);
    const syllablesOption = document.getElementById("syllables").value;
    const toneOption = document.getElementById("tone").value;

    const col1 = document.getElementById("col1");
    const col2 = document.getElementById("col2");
    col1.innerHTML = "";
    col2.innerHTML = "";

    for (let i = 0; i < numWords; i++) {
        let originalWord = generateBaseWord(syllablesOption, toneOption);
        let modifiedWord = applyClassAndSuffix(originalWord, wordClass, pos);
        
        // ⑦以降を適用する前の単語（列2）
        let wordElem2 = document.createElement("p");
        wordElem2.textContent = originalWord;
        col2.appendChild(wordElem2);

        // ⑦以降を適用した単語（列1）
        let wordElem1 = document.createElement("p");
        wordElem1.textContent = modifiedWord;
        col1.appendChild(wordElem1);
    }
}

// ①～⑥: 基本単語の生成
function generateBaseWord(syllablesOption, toneOption) {
    const firstConsonants = [
        "hm", "m", "p", "b", "f", "v", "hn", "n", "t", "d", "s", "z", "hr", "r", "hl", "l",
        "ch", "j", "y", "sh", "k", "g", "q", "gg", "x", "gh", "h", "hh"
    ];
    const rareFirstConsonants = [
        "pïr", "pïl", "pïm", "bïr", "bïl", "bïm", "fïr", "fïl", "tïr", "tïl", "tïn",
        "dïr", "dïl", "dïn", "sïl", "zïl", "chïr", "jïr", "shïr", "kïr", "kïl", "kïn",
        "gïr", "gïl", "gïn"
    ];

    const firstVowels = {
        "0": ["a", "ia", "ai", "ua", "au"],
        "1": ["ā", "iā", "āi", "uā", "āu"],
        "2": ["á", "iá", "ái", "uá", "áu"],
        "3": ["à", "ià", "ài", "uà", "àu"]
    };

    let firstConsonant = randomChoice([...firstConsonants, ...rareFirstConsonants], 0.1);
    let tone = toneOption === "random" ? randomChoice(["0", "1", "2", "3"]) : toneOption;
    let firstVowel = randomChoice(firstVowels[tone]);

    let baseWord = firstConsonant + firstVowel;

    if (syllablesOption === "2" || (syllablesOption === "random" && Math.random() < 0.3)) {
        const secondConsonants = [...firstConsonants, ...rareFirstConsonants];
        let secondConsonant = randomChoice(secondConsonants, 0.05);
        let secondVowel = randomChoice(firstVowels[tone]);
        baseWord += secondConsonant + secondVowel;
    }

    if (Math.random() < 0.2) {
        const finalConsonants = [
            "l", "n", "ng", "ny", "r", "y",
            "hme", "me", "pe", "be", "fe", "ve", "hne", "ne", "te", "de", "se", "ze",
            "hre", "re", "hle", "le", "che", "je", "ye", "she", "ke", "ge", "qe", "gge", "xe", "ghe", "he", "hhe"
        ];
        baseWord += randomChoice(finalConsonants, 0.05);
    }

    return baseWord;
}

// ⑦以降: クラス変化と接辞の付与
function applyClassAndSuffix(word, wordClass, pos) {
    const classTransformations = {
        "2": { "a": "e", "ā": "ē", "á": "é", "à": "è" },
        "3": { "a": "o", "ā": "ō", "á": "ó", "à": "ò" },
        "4": { "a": "ï", "ā": "ī", "á": "í", "à": "ì", "ia": "ï", "iā": "ī", "iá": "í", "ià": "ì", "ai": "ï", "āi": "ī", "ái": "í", "ài": "ì" }
    };

    if (wordClass in classTransformations) {
        for (let key in classTransformations[wordClass]) {
            let regex = new RegExp(key, "g");
            word = word.replace(regex, classTransformations[wordClass][key]);
        }
    }

    word = applySuffix(word, pos);
    return word;
}

// ⑨ 品詞ごとの接辞付与
function applySuffix(word, pos) {
    if (pos === "名詞") {
        return word;
    } else if (pos === "形容詞") {
        if (/[aāáàiu]$/.test(word)) return word + "r";
        if (/e$/.test(word)) return word.slice(0, -1) + "ár";
        return word + "ár";
    } else if (pos === "副詞") {
        if (/[aāáàiu]$/.test(word)) return word + "ye";
        if (/e$/.test(word)) return word + "i";
        return word + "ei";
    } else if (pos === "動詞") {
        if (/[aāáàiu]$/.test(word)) return word + "be";
        if (/e$/.test(word)) return word.slice(0, -1) + "ïbe";
        return word + "ïbe";
    }
    return word;
}

// ランダム抽選関数（低確率対応）
function randomChoice(array, rareProbability = 0.0) {
    if (Math.random() < rareProbability) {
        return array[array.length - Math.floor(Math.random() * Math.min(array.length, 5)) - 1];
    }
    return array[Math.floor(Math.random() * array.length)];
}
