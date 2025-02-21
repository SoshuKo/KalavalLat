document.addEventListener("DOMContentLoaded", function () {
    // 第一子音リスト（低確率のものは別処理）
    const firstConsonants = ["hm", "m", "p", "b", "f", "v", "hn", "n", "t", "d", "s", "z", "hr", "r", "hl", "l", "ch", "j", "y", "sh", "k", "g", "q", "gg", "x", "gh", "h", "hh"];
    const firstConsonantsLow = ["pïr", "pïl", "pïm", "bïr", "bïl", "bïm", "fïr", "fïl", "tïr", "tïl", "tïn", "dïr", "dïl", "dïn", "sïl", "zïl", "chïr", "jïr", "shïr", "kïr", "kïl", "kïn", "gïr", "gïl", "gïn"];

    // 母音リスト（声調ごと）
    const vowels = {
        "0": ["a", "ia", "ai", "ua", "au"],
        "1": ["ā", "iā", "āi", "uā", "āu"],
        "2": ["á", "iá", "ái", "uá", "áu"],
        "3": ["à", "ià", "ài", "uà", "àu"]
    };

    // 第二子音リスト（低確率のものは別処理）
    const secondConsonants = [...firstConsonants];
    const secondConsonantsLow = [...firstConsonantsLow];

    // 音節末子音リスト（低確率のものは別処理）
    const finalConsonants = ["l", "n", "ng", "ny", "r", "y"];
    const finalConsonantsLow = ["hme", "me", "pe", "be", "fe", "ve", "hne", "ne", "te", "de", "se", "ze", "hre", "re", "hle", "le", "che", "je", "ye", "she", "ke", "ge", "qe", "gge", "xe", "ghe", "he", "hhe"];

    // クラス変化ルール
    const classChanges = {
        "2": { "a": "e", "ā": "ē", "á": "é", "à": "è" },
        "3": { "a": "o", "ā": "ō", "á": "ó", "à": "ò" },
        "4": { "a": "ï", "ā": "ī", "á": "í", "à": "ì", "ia": "ï", "iā": "ī", "iá": "í", "ià": "ì", "ai": "ï", "āi": "ī", "ái": "í", "ài": "ì" }
    };

    // 接辞付与ルール
    const suffixes = {
        "形容詞": { "a": "r", "ā": "r", "á": "r", "à": "r", "i": "r", "u": "r", "e": "ár", "default": "ár" },
        "副詞": { "a": "ye", "ā": "ye", "á": "ye", "à": "ye", "i": "ye", "u": "ye", "e": "i", "default": "ei" },
        "動詞": { "a": "be", "ā": "be", "á": "be", "à": "be", "i": "be", "u": "be", "e": "ïbe", "default": "ïbe" }
    };

    function randomChoice(arr, lowChanceArr = null, lowChanceRate = 0.1) {
        if (lowChanceArr && Math.random() < lowChanceRate) {
            return lowChanceArr[Math.floor(Math.random() * lowChanceArr.length)];
        }
        return arr[Math.floor(Math.random() * arr.length)];
    }

    function generateWord() {
        let word = randomChoice(firstConsonants, firstConsonantsLow);
        const toneSelect = document.getElementById("tone").value;
        let vowel = (toneSelect !== "random") ? randomChoice(vowels[toneSelect]) : randomChoice(vowels[randomChoice(["0", "1", "2", "3"])]);
        word += vowel;

        const syllableSelect = document.getElementById("syllables").value;
        if (syllableSelect === "2" || (syllableSelect === "random" && Math.random() < 0.3)) {
            word += randomChoice(secondConsonants, secondConsonantsLow);
            vowel = (toneSelect !== "random") ? randomChoice(vowels[toneSelect]) : randomChoice(vowels[randomChoice(["0", "1", "2", "3"])]);
            word += vowel;
        }

        if (Math.random() < 0.2) {
            word += randomChoice(finalConsonants, finalConsonantsLow, 0.05);
        }

        const column2Word = word;

        // クラスによる母音変化
        const classSelect = document.getElementById("class").value;
        if (classSelect !== "1") {
            for (const [key, value] of Object.entries(classChanges[classSelect])) {
                word = word.replace(new RegExp(key, "g"), value);
            }
        }

        // 品詞による接辞付与
        const posSelect = document.getElementById("pos").value;
        const lastChar = word.slice(-1);
        if (posSelect in suffixes) {
            if (lastChar in suffixes[posSelect]) {
                word += suffixes[posSelect][lastChar];
            } else {
                word += suffixes[posSelect]["default"];
            }
        }

        return { col1: word, col2: column2Word };
    }

    document.getElementById("generate").addEventListener("click", function () {
        const numWords = parseInt(document.getElementById("numWords").value, 10);
        const col1 = document.getElementById("col1");
        const col2 = document.getElementById("col2");
        col1.innerHTML = "";
        col2.innerHTML = "";

        for (let i = 0; i < numWords; i++) {
            const { col1: finalWord, col2: baseWord } = generateWord();
            col1.innerHTML += `<div>${finalWord}</div>`;
            col2.innerHTML += `<div>${baseWord}</div>`;
        }
    });
});
