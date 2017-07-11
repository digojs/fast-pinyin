# fast-pinyin
快速汉字转拼音库

## 特性
- 仅支持 Node.js 环境。
- 比 [pinyin](https://www.npmjs.com/package/pinyin) 和 [pinyinlite](https://www.npmjs.com/package/pinyinlite) 更快、更小、更节约内存。
- 完整字库，支持所有简繁汉字。
- 支持多音字，但不支持智能识别。
- 支持音调。
- 支持特殊字符。
- 没有任何依赖项。

## 用法
```bash
npm install fast-pinyin
```

```js
var pinyin = require("fast-pinyin");
var output = pinyin('增长1%'); // => [ 'zeng', 'chang', undefined, undefined ]
```

### 支持特殊字符
```js
var output = pinyin('增长1%', {
    keepUnrecognized: true
}); // => [ 'zeng', 'chang', '1', '%' ]
```

### 支持多音字
```js
var output = pinyin('增长1%', {
    heteronym: true
}); // => [ 'zeng', 'chang|zhang', undefined, undefined ]
```

### 支持音调
```js
var output = pinyin('增长1%', {
    tone: true
}); // => [ 'zēng', 'cháng', undefined, undefined ]
```

> 提示，如果需要后期处理音调，可参考[此库](https://www.npmjs.com/package/pinyin-utils)

### 组合所有选项

```js
var output = pinyin('增长1%', {
    keepUnrecognized: true,
    heteronym: true,
    tone: true
}); // => [ 'zēng', 'cháng|zhǎng', '1', '%' ]
```

## API
### `pinyin(value[, options])`
获取汉字的拼音。

#### 参数

##### `value`
`String`，要获取的汉字。

##### `options`(可选)
`Object`，解析的选项。
- `keepUnrecognized`(可选): `Boolean`，是否包含未识别的字符。默认为 false。
- `heteronym`(可选): `Boolean`，是否识别多音字。默认为 false。
- `tone`(可选): `Boolean`，是否包含音调。默认为 false。

#### 返回
`String[]`，返回每个字符拼音字符串组成的数组，多音字用 | 分隔。如 `"jī|kē"`。

## 原理
通过查询内置的拼音字典，检索每个汉字对应的拼音。
为减少字典体积，所有数据使用二进制存储，每次检索的时间复杂度为 `O(1)`。

## 协议
MIT