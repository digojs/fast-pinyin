var pinyinIndex = require("./dict/index.json");
var dict = require("fs").readFileSync(require("path").join(__dirname, "./dict/pinyin.dict"));

/**
 * 获取汉字的拼音。
 * @param {String} value 要获取的汉字。
 * @param {Object} options 解析的选项。
 * @property {Boolean?} tone 是否包含音调。默认为 false。
 * @property {Boolean?} heteronym 是否识别多音字。默认为 false。
 * @property {Boolean?} keepUnrecognized 是否包含未识别的字符。默认为 false。
 * @return {String[]} 返回每个字符拼音字符串组成的数组，多音字用 | 分隔。如 "jī|kē"。
 */
module.exports = exports = function (value, options) {
    var tone = options && options.tone;
    var heteronym = options && options.heteronym;
    var keepUnrecognized = options && options.keepUnrecognized;
    var result = new Array(value.length);
    for (var i = 0; i < value.length; i++) {
        var pinyin = exports.char(value, i);
        if (pinyin) {
            var isHeteronym = pinyin.indexOf("|") >= 0;
            if (isHeteronym && !heteronym) {
                pinyin = pinyin.split("|", 2)[0];
                isHeteronym = false;
            }
            if (!tone) {
                if (isHeteronym) {
                    var oldPinyin = pinyin;
                    pinyin = [];
                    oldPinyin.split("|").forEach(function (py) {
                        py = exports.removeTone(py);
                        if (pinyin.indexOf(py) < 0) {
                            pinyin.push(py);
                        }
                    });
                    pinyin = pinyin.join("|");
                } else {
                    pinyin = exports.removeTone(pinyin);
                }
            }
            result[i] = pinyin;
        } else if (keepUnrecognized) {
            result[i] = value[i];
        }
    }
    return result;
};

/**
 * 获取字符串中指定字符的拼音。
 * @param {String} value 要获取的汉字。
 * @param {String} index 要获取的索引。
 * @return {String} 返回拼音字符串，多音字用 | 分隔。如 "jī|kē"。
 */
exports.char = function (value, index) {
    var code = value.charCodeAt(index);
    if (code < 0x3400) {
        return;
    }
    code = (code - 0x3400) * 2;
    code = (dict[code] << 8) | dict[code + 1];
    return pinyinIndex[code - 1];
};

/**
 * 删除拼音中的音调部分。
 * @param {String} value 要处理的拼音。
 * @return {String} 返回拼音字符串。
 */
exports.removeTone = function (value) {
    return value.replace(/[āáǎàēéěèōóǒòīíǐìūúǔùüǘǚǜńň]/, function (char) {
        return {
            "ā": "a",
            "á": "a",
            "ǎ": "a",
            "à": "a",
            "ē": "e",
            "é": "e",
            "ě": "e",
            "è": "e",
            "ō": "o",
            "ó": "o",
            "ǒ": "o",
            "ò": "o",
            "ī": "i",
            "í": "i",
            "ǐ": "i",
            "ì": "i",
            "ū": "u",
            "ú": "u",
            "ǔ": "u",
            "ù": "u",
            "ü": "v",
            "ǘ": "v",
            "ǚ": "v",
            "ǜ": "v",
            "ń": "n",
            "ň": "n"
        }[char];
    });
};
