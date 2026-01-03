import { CommonSonStrArrayInfo } from './commonSonStrArrayInfo';

/**
 * 字符串对比工具类（Python风格）
 */
export class StringUtilsPy {
    /**
     * 求得的最长公共子串的最小长度
     */
    private static readonly MIN_ARRAY_LENGTH_OF_LONGEST_COMMON_STR = 3;
    /**
     * 校验当前求得的最长公共子串是否合法时，进行交叉对比时的阈值
     */
    private static readonly VALIDATE_LONGEST_COMMON_SON_STR_THRESHOLD = 2;
    /**
     * 在不断搜查随机字符时，设定最多搜查次数能防止资源过量消耗
     */
    private static readonly MAX_RANDOM_QUERY_NUM = 1000;
    /**
     * 原始字符串的 key
     */
    private static readonly originStrKey = 'originResult';
    /**
     * 变更后的字符串的 key
     */
    private static readonly newStrKey = 'newResult';
    /**
     * 在原始字符串上体现变更的字符串的 key
     */
    private static readonly resultAtOriginStrKey = 'mixResult';
    /**
     * 新增部分的颜色
     */
    private static readonly ADD_COLOR = 'green';
    /**
     * 删除部分的颜色
     */
    private static readonly REMOVE_COLOR = 'red';
    /**
     * 新增的html标记的 起始 字符串
     */
    private static readonly addSignStart = `<font style='background:${StringUtilsPy.ADD_COLOR};' color='black'>`;
    /**
     * 新增的html标记的 结束 字符串
     */
    private static readonly addSignEnd = '</font>';
    /**
     * 删除的html标记的 起始 字符串
     */
    private static readonly removeSignStart = `<font style='background:${StringUtilsPy.REMOVE_COLOR};' color='black'>`;
    /**
     * 删除的html标记的 结束 字符串
     */
    private static readonly removeSignEnd = '</font>';

    /**
     * 私有化构造方法，防止实例化
     */
    private constructor() {}

    /**
     * 测试方法
     */
    public static test(): void {
        const originStr = '1bac2bcdef3ae4aaa5bbb6';
        const newStr = 'bac8ae9aaa7bbb9bcdef4';
        const resultMap = StringUtilsPy.compare(originStr, newStr);
        console.log(resultMap);
    }

    /**
     * 对比两个字符串，产出对比结果
     * @param originStr 原始字符串
     * @param newStr （可能）变更后的字符串
     * @returns 对比结果的集合，有两个模式的对比结果。
     */
    public static compare(originStr: string, newStr: string): Record<string, string> {
        const map: Record<string, string> = {
            [StringUtilsPy.originStrKey]: originStr,
            [StringUtilsPy.newStrKey]: newStr,
        };
        const resultMap = StringUtilsPy.markDiffsBetweenStrs(
            map,
            StringUtilsPy.originStrKey,
            StringUtilsPy.newStrKey,
            StringUtilsPy.addSignStart,
            StringUtilsPy.addSignEnd,
            StringUtilsPy.removeSignStart,
            StringUtilsPy.removeSignEnd
        );
        const resultAtOriginStr = StringUtilsPy.markDiffsAtOriginBetweenStrs(
            originStr,
            newStr,
            StringUtilsPy.addSignStart,
            StringUtilsPy.addSignEnd,
            StringUtilsPy.removeSignStart,
            StringUtilsPy.removeSignEnd
        );
        resultMap[StringUtilsPy.resultAtOriginStrKey] = resultAtOriginStr;
        return resultMap;
    }

    /**
     * 比较两个字符串，将字符串中有变动的地方标记出来
     */
    public static markDiffsBetweenStrs(
        strsMap: Record<string, string>,
        originStrKey: string,
        newStrKey: string,
        addSignStart: string,
        addSignEnd: string,
        removeSignStart: string,
        removeSignEnd: string
    ): Record<string, string> {
        const blankParamsFlag =
            !strsMap ||
            Object.keys(strsMap).length < 1 ||
            StringUtilsPy.isBlank(originStrKey) ||
            StringUtilsPy.isBlank(newStrKey) ||
            StringUtilsPy.isBlank(addSignStart) ||
            StringUtilsPy.isBlank(addSignEnd) ||
            StringUtilsPy.isBlank(removeSignStart) ||
            StringUtilsPy.isBlank(removeSignEnd);
        if (blankParamsFlag) {
            return {};
        }
        if (StringUtilsPy.isBlank(strsMap[originStrKey])) {
            return strsMap;
        }
        const originStr = strsMap[originStrKey];
        const newStr = strsMap[newStrKey];

        let resultMap: Record<string, string> | null = null;
        if (StringUtilsPy.isBlank(originStr) && StringUtilsPy.isNotBlank(newStr)) {
            resultMap = {};
            resultMap[originStrKey] = '';
            resultMap[newStrKey] = addSignStart + newStr + addSignEnd;
        } else if (StringUtilsPy.isNotBlank(originStr) && StringUtilsPy.isBlank(newStr)) {
            resultMap = {};
            resultMap[originStrKey] = removeSignStart + originStr + removeSignEnd;
            resultMap[newStrKey] = '';
        } else if (StringUtilsPy.equals(newStr, originStr)) {
            resultMap = strsMap;
        } else {
            resultMap = StringUtilsPy.markDiffsBetweenUnequalStrs(
                strsMap,
                originStrKey,
                newStrKey,
                addSignStart,
                addSignEnd,
                removeSignStart,
                removeSignEnd
            );
        }
        return resultMap!;
    }

    /**
     * 比较两个字符串，将字符串中有变动的地方在原字符串上标记出来
     */
    public static markDiffsAtOriginBetweenStrs(
        originStr: string,
        newStr: string,
        addSignStart: string,
        addSignEnd: string,
        moveSignStart: string,
        moveSignEnd: string
    ): string {
        const blankParamsFlag =
            StringUtilsPy.isBlank(addSignStart) ||
            StringUtilsPy.isBlank(addSignEnd) ||
            StringUtilsPy.isBlank(moveSignStart) ||
            StringUtilsPy.isBlank(moveSignEnd);
        if (blankParamsFlag) {
            return originStr;
        }

        if (StringUtilsPy.isBlank(originStr) && StringUtilsPy.isNotBlank(newStr)) {
            return addSignStart + newStr + addSignEnd;
        } else if (StringUtilsPy.isNotBlank(originStr) && StringUtilsPy.isBlank(newStr)) {
            return moveSignStart + originStr + moveSignEnd;
        } else if (StringUtilsPy.equals(newStr, originStr)) {
            return originStr;
        } else {
            return StringUtilsPy.markDiffsAtOriginBetweenUnequalStrs(
                originStr,
                newStr,
                addSignStart,
                addSignEnd,
                moveSignStart,
                moveSignEnd
            );
        }
    }

    /**
     * 比较两个非空且不同的字符串，将字符串中有变动的地方标记出来
     */
    private static markDiffsBetweenUnequalStrs(
        strsMap: Record<string, string>,
        originStrKey: string,
        newStrKey: string,
        addSignStart: string,
        addSignEnd: string,
        removeSignStart: string,
        removeSignEnd: string
    ): Record<string, string> {
        const resultMap: Record<string, string> = {};
        const originStr = strsMap[originStrKey];
        const newStr = strsMap[newStrKey];
        const originCharArray = Array.from(originStr);
        const newCharArray = Array.from(newStr);
        const originStrResultBuilder: string[] = [];
        const newStrResultBuilder: string[] = [];

        const allSonStrList: CommonSonStrArrayInfo[] = [];
        StringUtilsPy.buildLongestSonStrArrayInfo(
            originCharArray,
            newCharArray,
            allSonStrList,
            0,
            null,
            0,
            0
        );

        if (!allSonStrList || allSonStrList.length < 1) {
            originStrResultBuilder.push(removeSignStart + originStr + removeSignEnd);
            newStrResultBuilder.push(addSignStart + newStr + addSignEnd);
            resultMap[originStrKey] = originStrResultBuilder.join('');
            resultMap[newStrKey] = newStrResultBuilder.join('');
            return resultMap;
        }

        allSonStrList.sort((a, b) => a.originStartIndex - b.originStartIndex);
        let currentStartIndex = 0;
        let sonNum = allSonStrList.length;

        for (const commonSonStrArrayInfo of allSonStrList) {
            const { originStartIndex, originEndIndex } = commonSonStrArrayInfo;
            sonNum--;
            if (currentStartIndex < originStartIndex) {
                originStrResultBuilder.push(
                    removeSignStart +
                    originStr.substring(currentStartIndex, originStartIndex) +
                    removeSignEnd
                );
                originStrResultBuilder.push(
                    originStr.substring(originStartIndex, originEndIndex + 1)
                );
                currentStartIndex = originEndIndex + 1;
                if (sonNum === 0 && currentStartIndex < originStr.length) {
                    originStrResultBuilder.push(
                        removeSignStart +
                        originStr.substring(currentStartIndex, originStr.length) +
                        removeSignEnd
                    );
                }
            } else {
                originStrResultBuilder.push(
                    originStr.substring(originStartIndex, originEndIndex + 1)
                );
                currentStartIndex = originEndIndex + 1;
                if (sonNum === 0 && currentStartIndex < originStr.length) {
                    originStrResultBuilder.push(
                        removeSignStart +
                        originStr.substring(currentStartIndex, originStr.length) +
                        removeEnd
                    );
                }
            }
        }

        allSonStrList.sort((a, b) => a.newStartIndex - b.newStartIndex);
        currentStartIndex = 0;
        sonNum = allSonStrList.length;

        for (const commonSonStrArrayInfo of allSonStrList) {
            const { newStartIndex, newEndIndex } = commonSonStrArrayInfo;
            sonNum--;
            if (currentStartIndex < newStartIndex) {
                newStrResultBuilder.push(
                    addSignStart +
                    newStr.substring(currentStartIndex, newStartIndex) +
                    addSignEnd
                );
                newStrResultBuilder.push(newStr.substring(newStartIndex, newEndIndex + 1));
                currentStartIndex = newEndIndex + 1;
                if (sonNum === 0 && currentStartIndex < newStr.length) {
                    newStrResultBuilder.push(
                        addSignStart +
                        newStr.substring(currentStartIndex, newStr.length) +
                        addSignEnd
                    );
                }
            } else {
                newStrResultBuilder.push(newStr.substring(newStartIndex, newEndIndex + 1));
                currentStartIndex = newEndIndex + 1;
                if (sonNum === 0 && currentStartIndex < newStr.length) {
                    newStrResultBuilder.push(
                        addSignStart +
                        newStr.substring(currentStartIndex, newStr.length) +
                        addSignEnd
                    );
                }
            }
        }

        resultMap[originStrKey] = originStrResultBuilder.join('');
        resultMap[newStrKey] = newStrResultBuilder.join('');
        return resultMap;
    }

    /**
     * 获取两个字符串的最长公共子串，获取的过程中组装所有公共子串的集合
     */
    private static buildLongestSonStrArrayInfo(
        originCharArray: string[],
        newCharArray: string[],
        allSonStrList: CommonSonStrArrayInfo[],
        minArrayLength: number,
        excludeSonCharArray: string[] | null,
        originIndexStartOffset: number,
        newIndexStartOffset: number
    ): void {
        if (originCharArray.length < 1 || newCharArray.length < 1) {
            return;
        }

        let currentCommonSonOriginArray: string[] | null = null;
        let currentCommonSonNewArray: string[] | null = null;
        let originCommonSonIndexStart = 0;
        let originCommonSonIndexEnd = 0;
        let newCommonSonIndexStart = 0;
        let newCommonSonIndexEnd = 0;
        let originCharArrayLeft: string[] | null = null;
        let originCharArrayRight: string[] | null = null;
        let newCharArrayLeft: string[] | null = null;
        let newCharArrayRight: string[] | null = null;
        let passFlag = false;
        const tempOriginCharArray = [...originCharArray];
        const tempNewCharArray = [...newCharArray];

        for (let i = 0; i < originCharArray.length; i++) {
            for (let j = 0; j < newCharArray.length; j++) {
                let length = 0;
                let m = i;
                let n = j;
                while (
                    m < originCharArray.length &&
                    n < newCharArray.length &&
                    originCharArray[m] === newCharArray[n]
                    ) {
                    length++;
                    m++;
                    n++;
                }
                const hasCommonSonFlag =
                    length !== 0 &&
                    (!currentCommonSonNewArray || currentCommonSonNewArray.length < length);
                if (hasCommonSonFlag) {
                    if (
                        excludeSonCharArray &&
                        JSON.stringify(
                            excludeSonCharArray
                        ) === JSON.stringify(originCharArray.slice(i, m))
                    ) {
                        for (let w = 0; w < excludeSonCharArray.length; w++) {
                            let randomOriginChar = String.fromCharCode(
                                Math.floor(Math.random() * 0xffff)
                            );
                            let randomQueryNum = 0;
                            while (
                                originCharArray.includes(randomOriginChar) &&
                                randomQueryNum < StringUtilsPy.MAX_RANDOM_QUERY_NUM
                                ) {
                                randomOriginChar = String.fromCharCode(
                                    Math.floor(Math.random() * 0xffff)
                                );
                                randomQueryNum++;
                            }
                            originCharArray[i + w] = randomOriginChar;
                            let randomNewChar = String.fromCharCode(
                                Math.floor(Math.random() * 0xffff)
                            );
                            randomQueryNum = 0;
                            while (
                                newCharArray.includes(randomNewChar) &&
                                randomQueryNum < StringUtilsPy.MAX_RANDOM_QUERY_NUM
                                ) {
                                randomNewChar = String.fromCharCode(
                                    Math.floor(Math.random() * 0xffff)
                                );
                                randomQueryNum++;
                            }
                            newCharArray[j + w] = randomNewChar;
                        }
                        passFlag = true;
                        continue;
                    }
                    currentCommonSonOriginArray = tempOriginCharArray.slice(i, m);
                    currentCommonSonNewArray = tempNewCharArray.slice(j, n);
                    originCommonSonIndexStart = i;
                    originCommonSonIndexEnd = m - 1;
                    newCommonSonIndexStart = j;
                    newCommonSonIndexEnd = n - 1;
                    originCharArrayLeft = i === 0 ? [] : tempOriginCharArray.slice(0, i);
                    originCharArrayRight =
                        m === tempOriginCharArray.length
                            ? []
                            : tempOriginCharArray.slice(m);
                    newCharArrayLeft = j === 0 ? [] : tempNewCharArray.slice(0, j);
                    newCharArrayRight =
                        n === tempNewCharArray.length ? [] : tempNewCharArray.slice(n);
                }
            }
        }

        if (!currentCommonSonOriginArray) {
            return;
        }

        if (excludeSonCharArray && passFlag) {
            originCharArray.splice(0, originCharArray.length, ...tempOriginCharArray);
            newCharArray.splice(0, newCharArray.length, ...tempNewCharArray);
        }

        const originStartIndex = originCommonSonIndexStart + originIndexStartOffset;
        const originEndIndex = originCommonSonIndexEnd + originIndexStartOffset;
        const newStartIndex = newCommonSonIndexStart + newIndexStartOffset;
        const newEndIndex = newCommonSonIndexEnd + newIndexStartOffset;

        const originLeftNewRightSonStrList: CommonSonStrArrayInfo[] = [];
        StringUtilsPy.buildLongestSonStrArrayInfo(
            originCharArrayLeft!,
            newCharArrayRight!,
            originLeftNewRightSonStrList,
            StringUtilsPy.MIN_ARRAY_LENGTH_OF_LONGEST_COMMON_STR,
            null,
            originIndexStartOffset,
            newEndIndex + 1
        );

        const originRightNewLeftSonStrList: CommonSonStrArrayInfo[] = [];
        StringUtilsPy.buildLongestSonStrArrayInfo(
            originCharArrayRight!,
            newCharArrayLeft!,
            originRightNewLeftSonStrList,
            StringUtilsPy.MIN_ARRAY_LENGTH_OF_LONGEST_COMMON_STR,
            null,
            originEndIndex + 1,
            newIndexStartOffset
        );

        let longestCommonSonStrArrayInfo: CommonSonStrArrayInfo | null = null;
        if (
            originLeftNewRightSonStrList.length >
            StringUtilsPy.VALIDATE_LONGEST_COMMON_SON_STR_THRESHOLD ||
            originRightNewLeftSonStrList.length >
            StringUtilsPy.VALIDATE_LONGEST_COMMON_SON_STR_THRESHOLD
        ) {
            StringUtilsPy.buildLongestSonStrArrayInfo(
                originCharArray,
                newCharArray,
                allSonStrList,
                0,
                currentCommonSonNewArray,
                originIndexStartOffset,
                newIndexStartOffset
            );
        } else if (currentCommonSonNewArray.length >= minArrayLength) {
            longestCommonSonStrArrayInfo = new CommonSonStrArrayInfo(
                originStartIndex,
                originEndIndex,
                newStartIndex,
                newEndIndex
            );
            allSonStrList.push(longestCommonSonStrArrayInfo);
        }

        if (longestCommonSonStrArrayInfo) {
            StringUtilsPy.buildLongestSonStrArrayInfo(
                originCharArrayLeft!,
                newCharArrayLeft!,
                allSonStrList,
                0,
                null,
                originIndexStartOffset,
                newIndexStartOffset
            );
            StringUtilsPy.buildLongestSonStrArrayInfo(
                originCharArrayRight!,
                newCharArrayRight!,
                allSonStrList,
                0,
                null,
                longestCommonSonStrArrayInfo.originEndIndex + 1,
                longestCommonSonStrArrayInfo.newEndIndex + 1
            );
        }
    }

    /**
     * 比较两个非空且不同的字符串，将字符串中有变动的地方在原字符串中标记出来
     */
    private static markDiffsAtOriginBetweenUnequalStrs(
        originStr: string,
        newStr: string,
        addSignStart: string,
        addSignEnd: string,
        moveSignStart: string,
        moveSignEnd: string
    ): string {
        const originCharArray = Array.from(originStr);
        const newCharArray = Array.from(newStr);
        const mixedStrResultBuilder: string[] = [];

        const allSonStrList: CommonSonStrArrayInfo[] = [];
        StringUtilsPy.buildLongestSonStrArrayInfo(
            originCharArray,
            newCharArray,
            allSonStrList,
            0,
            null,
            0,
            0
        );

        if (!allSonStrList || allSonStrList.length < 1) {
            mixedStrResultBuilder.push(
                moveSignStart + originStr + moveSignEnd + addSignStart + newStr + addSignEnd
            );
            return mixedStrResultBuilder.join('');
        }

        allSonStrList.sort((a, b) => a.originStartIndex - b.originStartIndex);
        let currentOriginStartIndex = 0;
        let currentNewStartIndex = 0;
        let sonNum = allSonStrList.length;

        for (const commonSonStrArrayInfo of allSonStrList) {
            const { originStartIndex, originEndIndex, newStartIndex, newEndIndex } =
                commonSonStrArrayInfo;
            sonNum--;

            if (currentOriginStartIndex < originStartIndex) {
                mixedStrResultBuilder.push(
                    moveSignStart +
                    originStr.substring(currentOriginStartIndex, originStartIndex) +
                    moveSignEnd
                );
            }
            if (currentNewStartIndex < newStartIndex) {
                mixedStrResultBuilder.push(
                    addSignStart +
                    newStr.substring(currentNewStartIndex, newStartIndex) +
                    addSignEnd
                );
            }

            mixedStrResultBuilder.push(
                originStr.substring(originStartIndex, originEndIndex + 1)
            );

            currentOriginStartIndex = originEndIndex + 1;
            if (sonNum === 0 && currentOriginStartIndex < originStr.length) {
                mixedStrResultBuilder.push(
                    moveSignStart +
                    originStr.substring(currentOriginStartIndex, originStr.length) +
                    moveSignEnd
                );
            }
            currentNewStartIndex = newEndIndex + 1;
            if (sonNum === 0 && currentNewStartIndex < newStr.length) {
                mixedStrResultBuilder.push(
                    addSignStart +
                    newStr.substring(currentNewStartIndex, newStr.length) +
                    addSignEnd
                );
            }
        }

        return mixedStrResultBuilder.join('');
    }

    /**
     * 判断字符串是否为空
     */
    private static isBlank(str: string | null | undefined): boolean {
        return str == null || str === '';
    }

    /**
     * 判断字符串是否非空
     */
    private static isNotBlank(str: string | null | undefined): boolean {
        return str != null && str !== '';
    }

    /**
     * 判断两个字符串是否相等
     */
    private static equals(str1: string | null | undefined, str2: string | null | undefined): boolean {
        return (str1 == null && str2 == null) || (str1 != null && str1 === str2);
    }
}