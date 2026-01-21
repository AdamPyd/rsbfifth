package com.adam.rsbfifth.service.impl.util;

import lombok.Getter;
import lombok.Setter;
import org.springframework.util.CollectionUtils;

import java.util.*;

public final class StringUtilsPy {
    /**
     * 求得的最长公共子串的最小长度-{@value}
     * {@value}
     */
    private static final int MIN_ARRAY_LENGTH_OF_LONGEST_COMMON_STR = 3;
    /**
     * 校验当前求得的最长公共子串是否合法时，进行交叉对比时的阈值,即不算当前最长公共子串后，下一级子串数不超过几个，此最长公共子串为合法的-{@value}
     */
    private static final int VALIDATE_LONGEST_COMMON_SON_STR_THRESHOLD = 2;
    /**
     * 在不断搜查随机字符时，设定最多搜查次数能防止资源过量消耗
     * {@value}
     */
    private static final int MAX_RANDOM_QUERY_NUM = 1000;
    /**
     * 原始字符串的 key-{@value}
     */
    private static final String originStrKey = "originStrKey";
    /**
     * 变更后的字符串的 key-{@value}
     */
    private static final String newStrKey = "newStrKey";
    /**
     * 在原始字符串上体现变更的字符串的 key-{@value}
     */
    private static final String resultAtOriginStrKey = "resultAtOriginStrKey";
    /**
     * 新增部分的颜色，绿色-{@value}
     */
    private static final String ADD_COLOR = "#00FF00";
    /**
     * 删除部分的颜色，红色-{@value}
     */
    private static final String REMOVE_COLOR = "#FF0000";
//    /**
//     * 新增的html标记的 起始 字符串-{@value}
//     */
//    private static final String addSignStart = String.format("<font style='background:%s;' color='%s'>"
//            , ADD_COLOR, getContrastColor(ADD_COLOR));
    /**
     * 新增的html标记的 结束 字符串-{@value}
     */
    private static final String addSignEnd = "</font>";
//    /**
//     * 删除的html标记的 起始 字符串-{@value}
//     */
//    private static final String removeSignStart = String.format("<s style='background:%s; text-decoration: line-through %s 3px;' color='%s'>"
//            , REMOVE_COLOR, getContrastColor(REMOVE_COLOR), getContrastColor(REMOVE_COLOR));
    /**
     * 删除的html标记的 结束 字符串-{@value}
     */
    private static final String removeSignEnd = "</s>";

    /**
     * 私有化构造方法，防止实例化
     */
    private StringUtilsPy() {
    }

    /**
     * 测试 main 方法
     * @param args
     */
    public static void main(String[] args) {
        String originStr = "1bac2bcdef3ae4aaa5bbb6";
        String newStr = "bac8ae9aaa7bbb9bcdef4";
        Map<String, String> resultMap = compare(originStr, newStr
                , ADD_COLOR, REMOVE_COLOR
                , MIN_ARRAY_LENGTH_OF_LONGEST_COMMON_STR
                , VALIDATE_LONGEST_COMMON_SON_STR_THRESHOLD);
        System.out.println(resultMap);
    }

    /**
     * 对比两个字符串，产出对比结果，能识别行变更
     * @param originStr 原始字符串
     * @param newStr （可能）变更后的字符串
     * @param addColor 新增部分的背景色
     * @param removeColor 删除部分的背景色
     * @param minArrayLengthOfLongestCommonStr 最长公共子串的最小长度
     * @param validateLongestCommonSonStrThreshold 校验当前求得的最长公共子串是否合法时，进行交叉对比时的阈值,即不算当前最长公共子串后，下一级子串数不超过几个，此最长公共子串为合法的
     * @return 对比结果的集合，有两个模式的对比结果。
     *          - 对比模式下
     *              {@link #originStrKey} 对应的是原始字符串的值，其中体现 删除 部分
     *              {@link #newStrKey} 对应的是（可能）变更后的字符串的值，其中体现 新增 部分
     *          - 融合模式下
     *              {@value #resultAtOriginStrKey} 对应的是原始字符串的值，其中体现了 新增、删除 的部分
     */
    public static Map<String, String> compareCareLineChange(String originStr, String newStr
            , String addColor, String removeColor
            , Integer minArrayLengthOfLongestCommonStr, Integer validateLongestCommonSonStrThreshold){

        // 1、根据换行符（"\n"）拆分 originStr 和 newStr
        String[] originStrLineArr = originStr.split("\n");
        String[] newStrLineArr = newStr.split("\n");

        // 2、对比 originStrLineArr 和 newStrLineArr，识别行变更。
        HashMap<String, StrLineToAnotherStrLinesMapping> originLineToNewLineMap = new HashMap<>();
        // 2.1、遍历 originStrLineArr，匹配到 originStrLineArr 各行对应的 newStrLineArr 各行最长公共子串集合
        for (int i = 0; i < originStrLineArr.length; i++){
            StrLineToAnotherStrLinesMapping currentOriginMappingObj = new StrLineToAnotherStrLinesMapping();
            currentOriginMappingObj.setLineIndex(i);
            currentOriginMappingObj.setLineStr(originStrLineArr[i]);
            originLineToNewLineMap.put(Integer.toString(i), currentOriginMappingObj);
            // 2.1.1、遍历 newStrLineArr
            for (int j = 0; j < newStrLineArr.length; j++){
                List<CommonSonStrArrayInfo> allSonStrList = new ArrayList<CommonSonStrArrayInfo>();
                /*
                 * 2.1.2、对比 originStrLineArr[index] 和 newStrLineArr[j++],依次取得 originStrLineArr[index] 和各 newStrLineArr[j++] 的最长公共子串
                 * 2.1.3、对求得的最长连续公共子串进行合法性校验
                 */
                buildLongestSonStrArrayInfo(originStr.toCharArray(), newStr.toCharArray(), allSonStrList, 0, null, 0, 0
                        , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
                if (CollectionUtils.isEmpty(allSonStrList)){
                    // originStrLine 与 这行 newStrLine 没有最长公共子串，不组装
                    continue;
                }
                // 对 allSonStrList 按照 sonStr.length 由大到小排序
                StrLengthComparator originStrComparator = new StrLengthComparator();
                Collections.sort(allSonStrList, originStrComparator);
                // 取第一个即为最长公共子串
                CommonSonStrArrayInfo longestCommonStrInfo = allSonStrList.get(0);
                List<StrLineToAnotherStrLinesMapping> newStrMappingList = currentOriginMappingObj.getNewStrMappingWithOrder();
                if (null == newStrMappingList) {
                    newStrMappingList = new ArrayList<>();
                    currentOriginMappingObj.setNewStrMappingWithOrder(newStrMappingList);
                }
                StrLineToAnotherStrLinesMapping currentNewMappingObj = new StrLineToAnotherStrLinesMapping();
                currentNewMappingObj.setLineIndex(j);
                currentNewMappingObj.setLineStr(newStrLineArr[j]);
                // 取第一个.todo 这里需要验证起始下标
                currentNewMappingObj.setCommonLongestSubStr(newStrLineArr[j].substring(longestCommonStrInfo.getNewStartIndex(), longestCommonStrInfo.getNewEndIndex() + 1));
                newStrMappingList.add(currentNewMappingObj);
            }
        }

        // 2.2、遍历 #2.1.4 的结果，组装出 笛卡尔积 todo 这里要想想，怎么组装笛卡尔积
        Iterator<Map.Entry<String, StrLineToAnotherStrLinesMapping>> iterator = originLineToNewLineMap.entrySet().iterator();
        while (iterator.hasNext()){
            Map.Entry<String, StrLineToAnotherStrLinesMapping> next = iterator.next();
            StrLineToAnotherStrLinesMapping originStrLineMapping = next.getValue();
            // 新开一个 mapping
            StrLineToAnotherStrLinesMapping originToNewMap = new StrLineToAnotherStrLinesMapping();
            originToNewMap.setLineIndex(originStrLineMapping.getLineIndex());
            originToNewMap.setLineStr(originStrLineMapping.getLineStr());

            List<StrLineToAnotherStrLinesMapping> newStrMappingWithOrder = originStrLineMapping.getNewStrMappingWithOrder();
            if (null == newStrMappingWithOrder || newStrMappingWithOrder.isEmpty()) {
                // 没有对应的最长公共子串
                continue;
            }
            for (int i = 0; i < newStrMappingWithOrder.size(); i++){

            }

            // ??? 对 newStrMappingWithOrder 按照 longestCommonStr.length 由大到小排序
            StrLineLongestCommonStrComparator originStrComparator = new StrLineLongestCommonStrComparator();
            Collections.sort(newStrMappingWithOrder, originStrComparator);
            // 取最长的
            originToNewMap.setNewStrMapping(newStrMappingWithOrder.get(0));
        }
        /*
         * 以 originStrLineArr[index] 为基准在 newStrLineArr 中找与之匹配的行
         * 这里面沿用LCS(最长连续公共子串)的思路，按顺序遍历 originStrLineArr 和 newStrLineArr
         * ，查找最长连续公共子串（并且对最长连续公共子串进行合法性校验)
         *
         * 2.1、遍历 originStrLineArr，匹配到 originStrLineArr 各行对应的 newStrLineArr 各行最长公共子串集合
         *
         * 2.1.1、遍历 newStrLineArr
         * 2.1.2、对比 originStrLineArr[index] 和 newStrLineArr[j++]
         *  ,依次取得 originStrLineArr[index] 和各 newStrLineArr[j++] 的最长公共子串
         * 2.1.3、对求得的最长连续公共子串进行合法性校验
         * 2.1.4、得到结果
           {
              // originIndex
              "0":
              {
                "originLineIndex": 0,
                "originLineStr": "originLineStr",
                "newStrMappingWithOrder": [
                // 按照 commonLongestSubStr 长短，由长到短排序
                  {
                    "newLineIndex": 2,
                    "newLineStr": "newStrLine",
                    "commonLongestSubStr": "commonLongestSubStr"
                  }
                ]
              }
            }
         * 2.2、遍历 #2.1.4 的结果，组装出 笛卡尔积，得到
         *      最多 originStrLineArr.size * newStrLineArr.size 个组合，每个组合均需要保证这几个条件
         *          2.2.1、originIndex、newIndex 均按由小到大排序
         *          2.2.2、commonLongestSubStr 不能为空
         *          组合结果结构为
                    [
                      // 每个 item 即为一个组合
                      [
                        // 每个 item 即为一个映射关系，originIndex 一定连续，但是 newStrMapping 不一定有值
                        {
                          "originLineIndex": 0,
                          "originLineStr": "originLineStr",
                          "newStrMapping": {
                            "newLineIndex": 2,
                            "newLineStr": "newStrLine",
                            "commonLongestSubStr": "commonLongestSubStr"
                          }
                        },
                        {
                          "originLineIndex": 1,
                          "originLineStr": "originLineStr",
                          "newStrMapping": null
                        },
                        {
                          "originLineIndex": 2,
                          "originLineStr": "originLineStr",
                          "newStrMapping": {
                            "newLineIndex": 3,
                            "newLineStr": "newStrLine",
                            "commonLongestSubStr": "commonLongestSubStr"
                          }
                        }
                      ]
         *
         * 2.3、遍历 #2.2 得出的结果，取 size 最长的 items，从中选一个 item，作为最终结果
         *      2.3.1、取出 size 最长的 items
         *      2.3.2、各 items 分别拼接 commonLongestSubStr，
         *          取 commonLongestSubStrTotal 最长的第一个 item，结构同 #2.2.2
         *
         * 2.4、遍历 #2.3.2 中结果，对 originStrLineArr 和 newStrLineArr 进行标注。
         *      构建 originIndexOffsetMap 和 newIndexOffsetMap，key 为原 index，value 为新 index。
         *      构建 originIndexOffsetList、 newIndexOffsetList，两个 list.size 一样
         *      2.4.1、newStrMapping 为空时
         *          2.4.1.1、originStrLineArr[i] 标注为删除（红背景，删除线）
         *          2.4.1.2、originStrLineArr.size + 1
         *          2.4.1.3、newStrLineArr.size + 1
         *          2.4.1.4、newStrLineArr 的 [i, newStrLineArr.size) 下标 +1
         *          2.4.1.5、newStrLineArr [i] 赋值为 originStrLineArr[i].size 的空字符串，标注为删除（红背景）
         *      2.4.2、newStrMapping 不为空时
         *          2.4.2.1、originIndex == newIndex
         *              对 originIndex 和 newIndex 执行对比字符串（#compare)方法逻辑
         *          2.4.2.2、originIndex > newIndex
         *              对 originIndex 和 newIndex 执行对比字符串（#compare)方法逻辑
         *              ps : 这时认为 originStrLineArr[newIndex - originIndex]已经补齐了
         *          2.4.2.3、originIndex < newIndex
         *
         *
         *
         */
        return null;
    }

    /**
     * 对比两个字符串，产出对比结果
     * @param originStr 原始字符串
     * @param newStr （可能）变更后的字符串
     * @param addColor 新增部分的背景色
     * @param removeColor 删除部分的背景色
     * @param minArrayLengthOfLongestCommonStr 最长公共子串的最小长度
     * @param validateLongestCommonSonStrThreshold 校验当前求得的最长公共子串是否合法时，进行交叉对比时的阈值,即不算当前最长公共子串后，下一级子串数不超过几个，此最长公共子串为合法的
     * @return 对比结果的集合，有两个模式的对比结果。
     *          - 对比模式下
     *              {@link #originStrKey} 对应的是原始字符串的值，其中体现 删除 部分
     *              {@link #newStrKey} 对应的是（可能）变更后的字符串的值，其中体现 新增 部分
     *          - 融合模式下
     *              {@value #resultAtOriginStrKey} 对应的是原始字符串的值，其中体现了 新增、删除 的部分
     */
    public static Map<String, String> compare(String originStr, String newStr
            , String addColor, String removeColor
            , Integer minArrayLengthOfLongestCommonStr, Integer validateLongestCommonSonStrThreshold) {
        // 兜底配置
        addColor = isBlank(addColor) ? ADD_COLOR : addColor;
        removeColor = isBlank(removeColor) ? REMOVE_COLOR : removeColor;
        minArrayLengthOfLongestCommonStr = minArrayLengthOfLongestCommonStr == null
                ? MIN_ARRAY_LENGTH_OF_LONGEST_COMMON_STR : minArrayLengthOfLongestCommonStr;
        validateLongestCommonSonStrThreshold = validateLongestCommonSonStrThreshold == null
                ? VALIDATE_LONGEST_COMMON_SON_STR_THRESHOLD : validateLongestCommonSonStrThreshold;

        HashMap<String, String> map = new HashMap<String, String>();
        map.put(originStrKey, originStr);
        map.put(newStrKey, newStr);

        // 新增的html标记的 起始 字符串
        String addSignStart = String.format("<font style='background:%s;' color='%s'>"
                , addColor, getContrastColor(addColor));
        // 删除的html标记的 起始 字符串
        String removeSignStart = String.format("<s style='background:%s; text-decoration: line-through black 3px;' color='%s'>"
                , removeColor, getContrastColor(removeColor));

        Map<String, String> resultMap = markDiffsBetweenStrs(map, originStrKey, newStrKey
                , addSignStart, addSignEnd, removeSignStart, removeSignEnd
                , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);

        String resultAtOriginStr = markDiffsAtOriginBetweenStrs(originStr, newStr
                , addSignStart, addSignEnd, removeSignStart, removeSignEnd
                , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);

        resultMap.put(resultAtOriginStrKey, resultAtOriginStr);
        return resultMap;
    }

    /**
     * 比较两个字符串，将字符串中有变动的地方标记出来<br/>
     *      exp: <br/>
     *          当入参 strsMap -> {"originStrKey":"这是一段字符串","newStrKey":"是两段字符串啊"} <br/>
     *                originStrKey -> originStrKey <br/>
     *                newStrKey -> newStrKey <br/>
     *                addSignStart -> $$aStart$$ <br/>
     *                addSignEnd -> $$aEnd$$ <br/>
     *                removeSignStart -> $$mStart$$ <br/>
     *                removeSignEnd -> $$mEnd$$ <br/>
     *          返回 {"originStrKey":"$$mStart$$这$$mEnd$$是$$mStart$$一$$mEnd$$段字符串","newStrKey":"是$$aStart$$两$$aEnd$$段字符串$$aStart$$啊$$aEnd$$"}
     * @param originStrKey 被比较的字符串（初始字符串）的对应key
     * @param newStrKey （可能）有变更的字符串的对应key
     * @param addSignStart 新增的起始占位符
     * @param addSignEnd 新增的结束占位符
     * @param removeSignStart 删除的起始占位符
     * @param removeSignEnd 删除的结束占位符
     * @return Map<String, String> 标记后的字符串集合
     */
    public static Map<String, String> markDiffsBetweenStrs(Map<String, String> strsMap, String originStrKey, String
            newStrKey, String addSignStart, String addSignEnd, String removeSignStart, String removeSignEnd
            , int minArrayLengthOfLongestCommonStr, int validateLongestCommonSonStrThreshold){
        boolean blankParamsFlag = strsMap == null || strsMap.size() < 1 || isBlank(originStrKey) ||
                isBlank (newStrKey) || isBlank(addSignStart) || isBlank(addSignEnd)
                || isBlank(removeSignStart) || isBlank(removeSignEnd);
        // 入参为空时返回空集合
        if (blankParamsFlag) {
            return new HashMap<String, String>();
        }
        // 入参的map集合中缺少必要值时，返回原集合
        if (isBlank(strsMap.get(originStrKey))){
            return strsMap;
        }
        // 被比较的字符串
        String originStr = strsMap.get(originStrKey);
        // 新的（、可能有变动的）字符串
        String newStr = strsMap.get(newStrKey);

        // 情况分类
        Map<String, String> resultMap = null;
        if (isBlank(originStr) && isNotBlank(newStr)){
            // 1、originStr 为空 && newStr 不为空，可以理解为字符串新增
            resultMap = new HashMap<String, String>();
            resultMap.put(originStrKey, "");
            resultMap.put(newStrKey, addSignStart + newStr + addSignEnd);
        } else if (isNotBlank(originStr) && isBlank(newStr)){
            // 2、newStr 为空 && originStr 不为空，可以理解为字符串被删除了
            resultMap = new HashMap<String, String>();
            resultMap.put(originStrKey, removeSignStart + originStr + removeSignEnd);
            resultMap.put(newStrKey, "");
        } else if (equals(newStr, originStr)){
            // 3、newStr equals originStr，这时包含 newStr、originStr 均为空的情况
            resultMap = strsMap;
        } else {
            // 4、newStr 不为空 && originStr 不为空 && newStr != originStr
            resultMap = markDiffsBetweenUnequalStrs(strsMap, originStrKey, newStrKey, addSignStart, addSignEnd,
                    removeSignStart, removeSignEnd
                    , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        }
        return resultMap;
    }

    /**
     * 比较两个字符串，将字符串中有变动的地方在原字符串上标记出来<br/>
     *      exp: <br/>
     *          当入参 strsMap -> {"originStrKey":"这是一段字符串","newStrKey":"是两段字符串啊"} <br/>
     *                originStrKey -> originStrKey <br/>
     *                newStrKey -> newStrKey <br/>
     *                addSignStart -> $$aStart$$ <br/>
     *                addSignEnd -> $$aEnd$$ <br/>
     *                moveSignStart -> $$mStart$$ <br/>
     *                moveSignEnd -> $$mEnd$$ <br/>
     *          返回 "$$mStart$$这$$mEnd$$是$$mStart$$一$$mEnd$$$$aStart$$两$$aEnd$$段字符串$$aStart$$啊$$aEnd$$"
     * @param originStr 被比较的字符串（初始字符串）
     * @param newStr （可能）有变更的字符串
     * @param addSignStart 新增的起始占位符
     * @param addSignEnd 新增的结束占位符
     * @param moveSignStart 删除的起始占位符
     * @param moveSignEnd 删除的结束占位符
     * @return String 标记变更点后的字符串
     */
    public static String markDiffsAtOriginBetweenStrs(String originStr, String newStr, String addSignStart, String
            addSignEnd, String moveSignStart, String moveSignEnd
            , int minArrayLengthOfLongestCommonStr, int validateLongestCommonSonStrThreshold){
        boolean blankParamsFlag = isBlank(addSignStart)
                || isBlank(addSignEnd) || isBlank(moveSignStart) || isBlank(moveSignEnd);
        // 入参为空时返回空集合
        if (blankParamsFlag) {
            return originStr;
        }

        // 情况分类
        if (isBlank(originStr) && isNotBlank(newStr)){
            // 1、originStr 为空 && newStr 不为空，可以理解为字符串新增
            return addSignStart + newStr + addSignEnd;
        } else if (isNotBlank(originStr) && isBlank(newStr)){
            // 2、newStr 为空 && originStr 不为空，可以理解为字符串被删除了
            return moveSignStart + originStr + moveSignEnd;
        } else if (equals(newStr, originStr)){
            // 3、newStr equals originStr，这时包含 newStr、originStr 均为空的情况
            return originStr;
        } else {
            // 4、newStr 不为空 && originStr 不为空 && newStr != originStr
            return markDiffsAtOriginBetweenUnequalStrs(originStr, newStr, addSignStart, addSignEnd,
                    moveSignStart, moveSignEnd
                    , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        }
    }

    /**
     * 比较两个非空且不同的字符串，将字符串中有变动的地方标记出来<br/>
     *      exp: <br/>
     *          当入参 strsMap -> {"originStrKey":"这是一段字符串","newStrKey":"是两段字符串啊"} <br/>
     *                originStrKey -> originStrKey <br/>
     *                newStrKey -> newStrKey <br/>
     *                addSignStart -> $$aStart$$ <br/>
     *                addSignEnd -> $$aEnd$$ <br/>
     *                removeSignStart -> $$aStart$$ <br/>
     *                removeSignEnd -> $$mEnd$$ <br/>
     *          返回 {"originStrKey":"$$aStart$$这$$mEnd$$是$$aStart$$一$$mEnd$$段字符串","newStrKey":"是$$aStart$$两$$aEnd$$段字符串$$aStart$$啊$$aEnd$$"}
     * @param originStrKey 被比较的字符串（初始字符串）的对应key
     * @param newStrKey （可能）有变更的字符串的对应key
     * @param addSignStart 新增的起始占位符
     * @param addSignEnd 新增的结束占位符
     * @param removeSignStart 删除的起始占位符
     * @param removeSignEnd 删除的结束占位符
     * @return Map<String, String> 标记后的字符串集合
     */
    private static Map<String, String> markDiffsBetweenUnequalStrs(Map<String, String> strsMap, String originStrKey, String
            newStrKey, String addSignStart, String addSignEnd, String removeSignStart, String removeSignEnd
            , int minArrayLengthOfLongestCommonStr, int validateLongestCommonSonStrThreshold){
        Map<String, String> resultMap = new HashMap<String, String>();
        // 被比较的字符串
        String originStr = strsMap.get(originStrKey);
        // 新的（、可能有变动的）字符串
        String newStr = strsMap.get(newStrKey);
        // 转换为字符数组。Java的String底层实际就是以char[]存储的，所以转换不会消耗啥资源；同时，转换成char[]后，便于对单个数组元素进行比较
        char[] originCharArray = originStr.toCharArray();
        char[] newCharArray = newStr.toCharArray();
        // 用于组装两个字符串各自结果的builder
        StringBuilder originStrResultBuilder = new StringBuilder();
        StringBuilder newStrResultBuilder = new StringBuilder();

        /*
         * 两个字符串的所有公共子串。
         *  LCS（最长公共子串）求得两个字符串的最长公共子串，并借助阈值，对比 左-右、右-左 的公共子串数确定该最长公共子串数的合法性
         *  -> 分治法，根据各自的最长公共子串将两个字符串（剔除最长公共子串后）拆成左右两个字符串，并按照 左-左、右-右对比
         *  -> 递归上述两步操作
         */
        List<CommonSonStrArrayInfo> allSonStrList = new ArrayList<CommonSonStrArrayInfo>();
        buildLongestSonStrArrayInfo(originCharArray, newCharArray, allSonStrList, 0, null, 0, 0
                , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        if (allSonStrList == null || allSonStrList.size() < 1){
            // 1、两个字符串没有公共子串
            originStrResultBuilder.append(removeSignStart);
            originStrResultBuilder.append(originStr);
            originStrResultBuilder.append(removeSignEnd);
            newStrResultBuilder.append(addSignStart);
            newStrResultBuilder.append(newStr);
            newStrResultBuilder.append(addSignEnd);
            resultMap.put(originStrKey, originStrResultBuilder.toString());
            resultMap.put(newStrKey, newStrResultBuilder.toString());
            return resultMap;
        }

        // 对 allSonStrList 按照 originStartIndex 由小到大排序
        OriginStrComparator originStrComparator = new OriginStrComparator();
        Collections.sort(allSonStrList, originStrComparator);
        int currentStartIndex = 0;
        // 公共子串数量
        int sonNum = allSonStrList.size();
        // 拼接 originStrResult
        for (CommonSonStrArrayInfo commonSonStrArrayInfo : allSonStrList){
            int originStartIndex = commonSonStrArrayInfo.getOriginStartIndex();
            int originEndIndex = commonSonStrArrayInfo.getOriginEndIndex();
            sonNum--;
            if (currentStartIndex < originStartIndex){
                // 公共子串前标记删除
                originStrResultBuilder.append(removeSignStart);
                originStrResultBuilder.append(originStr.substring(currentStartIndex, originStartIndex));
                originStrResultBuilder.append(removeSignEnd);
                // 拼接公共子串
                originStrResultBuilder.append(originStr.substring(originStartIndex, originEndIndex + 1));
                // 移动指针
                currentStartIndex = originEndIndex + 1;
                if (sonNum == 0 && currentStartIndex < originStr.length()){
                    // 公共子串已经遍历完了，但是字符串还没拼接完，需要将后面的补上
                    originStrResultBuilder.append(removeSignStart);
                    originStrResultBuilder.append(originStr.substring(currentStartIndex, originStr.length()));
                    originStrResultBuilder.append(removeSignEnd);
                }
            } else {
                // 直接拼接公共子串
                originStrResultBuilder.append(originStr.substring(originStartIndex, originEndIndex + 1));
                // 移动指针
                currentStartIndex = originEndIndex + 1;
                if (sonNum == 0 && currentStartIndex < originStr.length()){
                    // 公共子串已经遍历完了，但是字符串还没拼接完，需要将后面的补上
                    originStrResultBuilder.append(removeSignStart);
                    originStrResultBuilder.append(originStr.substring(currentStartIndex, originStr.length()));
                    originStrResultBuilder.append(removeSignEnd);
                }
            }
        }
        // 对 allSonStrList 按照 newStartIndex 由小到大排序
        NewStrComparator newStrComparator = new NewStrComparator();
        Collections.sort(allSonStrList, newStrComparator);
        currentStartIndex = 0;
        // 公共子串数量
        sonNum = allSonStrList.size();
        // 拼接 newStrResult
        for (CommonSonStrArrayInfo commonSonStrArrayInfo : allSonStrList){
            int newStartIndex = commonSonStrArrayInfo.getNewStartIndex();
            int newEndIndex = commonSonStrArrayInfo.getNewEndIndex();
            sonNum--;
            if (currentStartIndex < newStartIndex){
                // 公共子串前标记添加
                newStrResultBuilder.append(addSignStart);
                newStrResultBuilder.append(newStr.substring(currentStartIndex, newStartIndex));
                newStrResultBuilder.append(addSignEnd);
                // 拼接公共子串
                newStrResultBuilder.append(newStr.substring(newStartIndex, newEndIndex + 1));
                // 移动指针
                currentStartIndex = newEndIndex + 1;
                if (sonNum == 0 && currentStartIndex < newStr.length()){
                    // 公共子串已经遍历完了，但是字符串还没拼接完，需要将后面的补上
                    newStrResultBuilder.append(addSignStart);
                    newStrResultBuilder.append(newStr.substring(currentStartIndex, newStr.length()));
                    newStrResultBuilder.append(addSignEnd);
                }
            } else {
                newStrResultBuilder.append(newStr.substring(newStartIndex, newEndIndex + 1));
                // 移动指针
                currentStartIndex = newEndIndex + 1;
                if (sonNum == 0 && currentStartIndex < newStr.length()){
                    // 公共子串已经遍历完了，但是字符串还没拼接完，需要将后面的补上
                    newStrResultBuilder.append(addSignStart);
                    newStrResultBuilder.append(newStr.substring(currentStartIndex, newStr.length()));
                    newStrResultBuilder.append(addSignEnd);
                }
            }
        }

        // 组装返回结果
        resultMap.put(originStrKey, originStrResultBuilder.toString());
        resultMap.put(newStrKey, newStrResultBuilder.toString());
        return resultMap;
    }

    /**
     * 获取两个字符串的最长公共子串，获取的过程中组装所有公共子串的集合
     *  LCS（最长公共子串）求得两个字符串的最长公共子串，并借助阈值，对比 左-右、右-左 的公共子串数确定该最长公共子串数的合法性
     *  -> 分治法，根据各自的最长公共子串将两个字符串（剔除最长公共子串后）拆成左右两个字符串，并按照 左-左、右-右对比
     *  -> 递归上述两步操作
     * @param originCharArray 被比较的字符串（初始字符串）对应的字符数组
     * @param newCharArray （可能）有变更的字符串对应的字符数组
     * @param allSonStrList 公共子串的信息集合
     * @param minArrayLength 要求的公共子串的长度最低是几
     * @param excludeSonCharArray 在求最长公共子串时要排除的子串字符数组
     * @param originIndexStartOffset 当前 origin 字符数组相对root origin数组的起始偏移量
     * @param newIndexStartOffset 当前 new 字符数组相对root new数组的起始偏移量
     */
    private static void buildLongestSonStrArrayInfo(char[] originCharArray, char[] newCharArray
            , List<CommonSonStrArrayInfo> allSonStrList, int minArrayLength
            , char[] excludeSonCharArray, int originIndexStartOffset
            , int newIndexStartOffset
            , int minArrayLengthOfLongestCommonStr, int validateLongestCommonSonStrThreshold) {
        // 1、递归退出声明
        if (originCharArray.length < 1 || newCharArray.length < 1){
            return;
        }

        /// 2、获取两个字符数组（对应的字符串）的最长公共子串
        // 2.1、两个字符串公共子串对应字符数组
        char[] currentCommonSonOriginArray = null;
        char[] currentCommonSonNewArray = null;
        // 2.2、两个字符串的公共子串的起始下标
        int originCommonSonIndexStart = 0;
        int originCommonSonIndexEnd = 0;
        int newCommonSonIndexStart = 0;
        int newCommonSonIndexEnd = 0;
        // 2.3、originCharArray 根据最长公共子串截取后的两部分
        char[] originCharArrayLeft = null;
        char[] originCharArrayRight = null;
        // 2.4、newCharArray 根据最长公共子串截取后的两部分
        char[] newCharArrayLeft = null;
        char[] newCharArrayRight = null;
        // 是否有跳过剔除字符串的操作
        boolean passFlag = false;
        // 临时保存两个字符数组，当有剔除操作时，在拿到最长公共子串后恢复原aaray
        char[] tempOriginCharArray = originCharArray;
        char[] tempNewCharArray = newCharArray;
        // 2.5、求两个字符串各自的最长公共子串（对应的字符数组）和通过这个子分隔的子串（对应的字符数组）
        for (int i = 0; i < originCharArray.length; i++){
            for (int j = 0; j < newCharArray.length; j++){
                int length = 0;
                int m = i;
                int n = j;
                while (m < originCharArray.length && n < newCharArray.length){
                    if (originCharArray[m] != newCharArray[n]){
                        break;
                    }
                    length++;
                    m++;
                    n++;
                }
                // 有公共子字符串的标志
                boolean hasCommonSonFlag = (length != 0 && (currentCommonSonNewArray == null ||
                        currentCommonSonNewArray.length < length));
                if (hasCommonSonFlag){
                    // 如果设置了排除的数组，需要剔除
                    if (excludeSonCharArray != null && Arrays.equals(excludeSonCharArray, Arrays.copyOfRange
                            (originCharArray, i, m))){
                        // 暂时将两个数组中与剔除数组匹配的区间替换为（元素互不相同的）随机内容
                        for (int w = 0; w < excludeSonCharArray.length; w++){
                            char randomOriginChar = (char)(new Random().nextInt('\uFFFF'));
                            int randomQueryNum = 0;
                            while (Arrays.toString(originCharArray).contains(String.valueOf(randomOriginChar))){
                                randomOriginChar = (char)(new Random().nextInt(1));
                                if (++randomQueryNum > MAX_RANDOM_QUERY_NUM){
                                    break;
                                }
                            }
                            originCharArray[i + w] = randomOriginChar;
                            char randomNewChar = (char)(new Random().nextInt('\uFFFF'));
                            randomQueryNum = 0;
                            while (Arrays.toString(newCharArray).contains(String.valueOf(randomNewChar))){
                                randomNewChar = (char)(new Random().nextInt(1));
                                if (++randomQueryNum > MAX_RANDOM_QUERY_NUM){
                                    break;
                                }
                            }
                            newCharArray[j + w] = randomNewChar;
                        }
                        passFlag = true;
                        continue;
                    }
                    currentCommonSonOriginArray = Arrays.copyOfRange(tempOriginCharArray, i, m);
                    currentCommonSonNewArray = Arrays.copyOfRange(tempNewCharArray, j, n);
                    originCommonSonIndexStart = i;
                    originCommonSonIndexEnd = m - 1;
                    newCommonSonIndexStart = j;
                    newCommonSonIndexEnd = n - 1;
                    // 对tempOriginCharArray（去掉最长公共子串后）进行左右拆分
                    if (i == 0){
                        originCharArrayLeft = new char[0];
                    } else {
                        originCharArrayLeft = Arrays.copyOfRange(tempOriginCharArray, 0, i);
                    }
                    if (m == tempOriginCharArray.length){
                        originCharArrayRight = new char[0];
                    } else {
                        originCharArrayRight = Arrays.copyOfRange(tempOriginCharArray, m, tempOriginCharArray.length);
                    }
                    // newCharArray（去掉最长公共子串后）进行左右拆分
                    if (j == 0){
                        newCharArrayLeft = new char[0];
                    } else {
                        newCharArrayLeft = Arrays.copyOfRange(tempNewCharArray, 0, j);
                    }
                    if (n == newCharArray.length){
                        newCharArrayRight = new char[0];
                    } else {
                        newCharArrayRight = Arrays.copyOfRange(tempNewCharArray, n, tempNewCharArray.length);
                    }
                }
            }
        }
        if (currentCommonSonOriginArray == null){
            return;
        }

        if (excludeSonCharArray != null && passFlag){
            // 将两个数组中被替换为（元素互不相同的）随机内容恢复
            originCharArray = tempOriginCharArray;
            newCharArray = tempNewCharArray;
        }
        /// 2.6、判断该 最长公共子串 的合法性，合法则采用分治法向下级子串求最长公共子串，并将该信息构建到list中；不合法，则剔除该子串后重新求最长公共子串
        // 2.6.1、当前最长公共子串的（在root字符串中的）索引下标
        CommonSonStrArrayInfo longestCommonSonStrArrayInfo = null;
        int originStartIndex = originCommonSonIndexStart + originIndexStartOffset;
        int originEndIndex = originCommonSonIndexEnd + originIndexStartOffset;
        int newStartIndex = newCommonSonIndexStart + newIndexStartOffset;
        int newEndIndex = newCommonSonIndexEnd + newIndexStartOffset;
        // 2.6.2、获取origin的左与new的右子串的长度大于阈值3的公共子串集合
        List<CommonSonStrArrayInfo> originLeftNewRightSonStrList = new ArrayList<CommonSonStrArrayInfo>();
        buildLongestSonStrArrayInfo(originCharArrayLeft,
                newCharArrayRight, originLeftNewRightSonStrList, minArrayLengthOfLongestCommonStr, null,
                originIndexStartOffset, newEndIndex + 1
                , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        // 2.6.3、获取origin的右与new的左子串的长度大于阈值3的公共子串集合
        List<CommonSonStrArrayInfo> originRightNewLeftSonStrList = new ArrayList<CommonSonStrArrayInfo>();
        buildLongestSonStrArrayInfo(originCharArrayRight,
                newCharArrayLeft, originLeftNewRightSonStrList, minArrayLengthOfLongestCommonStr, null,
                originEndIndex + 1, newIndexStartOffset
                , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        // 2.6.4、判断当前最长公共子串是否合法
        if (originLeftNewRightSonStrList.size() > validateLongestCommonSonStrThreshold ||
                originRightNewLeftSonStrList.size() > validateLongestCommonSonStrThreshold){
            // 求出的最长公共子串不合法，剔除该子串后重新求最长公共子串重新求最长公共子串
            buildLongestSonStrArrayInfo(originCharArray, newCharArray, allSonStrList, 0, currentCommonSonNewArray,
                    originIndexStartOffset, newIndexStartOffset
                    , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        } else if (currentCommonSonNewArray.length >= minArrayLength){
            // 求出的最长公共子串合法,并且长度符合要求，将信息构建到list集合中
            try {
                longestCommonSonStrArrayInfo = CommonSonStrArrayInfo.class.newInstance();
                longestCommonSonStrArrayInfo.setOriginStartIndex(originStartIndex);
                longestCommonSonStrArrayInfo.setOriginEndIndex(originEndIndex);
                longestCommonSonStrArrayInfo.setNewStartIndex(newStartIndex);
                longestCommonSonStrArrayInfo.setNewEndIndex(newEndIndex);
                allSonStrList.add(longestCommonSonStrArrayInfo);
            } catch (InstantiationException e) {
//                LoggerUtil.error(LoggerConstants.COMMON_UTIL, "StringUtilsPy#buildLongestSonStrArrayInfo-error-InstantiationException" + e);
                System.out.println("StringUtilsPy#buildLongestSonStrArrayInfo-error-InstantiationException" + e);
            } catch (IllegalAccessException e) {
//                LoggerUtil.error(LoggerConstants.COMMON_UTIL, "StringUtilsPy#buildLongestSonStrArrayInfo-error-IllegalAccessException" + e);
                System.out.println("StringUtilsPy#buildLongestSonStrArrayInfo-error-IllegalAccessException" + e);
            }
        }

        /// 3、分治法求拆分后的子串的公共子串集合
        if (longestCommonSonStrArrayInfo != null) {
            // 3.1、获取origin的左与new的左子串的公共子串集合
            buildLongestSonStrArrayInfo(originCharArrayLeft,
                    newCharArrayLeft, allSonStrList, 0, null, originIndexStartOffset, newIndexStartOffset
                    , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
            // 3.2、获取origin的右与new的右子串的公共子串集合
            buildLongestSonStrArrayInfo(originCharArrayRight,
                    newCharArrayRight, allSonStrList, 0, null, longestCommonSonStrArrayInfo.getOriginEndIndex() + 1, longestCommonSonStrArrayInfo.getNewEndIndex() + 1
                    , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        }
    }

    /**
     * 比较两个非空且不同的字符串，将字符串中有变动的地方在原字符串中标记出来<br/>
     *      exp: <br/>
     *          当入参 strsMap -> {"originStrKey":"这是一段字符串","newStrKey":"是两段字符串啊"} <br/>
     *                originStrKey -> originStrKey <br/>
     *                newStrKey -> newStrKey <br/>
     *                addSignStart -> $$aStart$$ <br/>
     *                addSignEnd -> $$aEnd$$ <br/>
     *                moveSignStart -> $$aStart$$ <br/>
     *                moveSignEnd -> $$mEnd$$ <br/>
     *          返回 "$$mStart$$这$$mEnd$$是$$mStart$$一$$mEnd$$$$aStart$$两$$aEnd$$段字符串$$aStart$$啊$$aEnd$$"
     * @param originStr 被比较的字符串（初始字符串）
     * @param newStr （可能）有变更的字符串
     * @param addSignStart 新增的起始占位符
     * @param addSignEnd 新增的结束占位符
     * @param moveSignStart 删除的起始占位符
     * @param moveSignEnd 删除的结束占位符
     * @return String 标记变更点后的字符串
     */
    private static String markDiffsAtOriginBetweenUnequalStrs(String originStr, String
            newStr, String addSignStart, String addSignEnd, String moveSignStart, String moveSignEnd
            , int minArrayLengthOfLongestCommonStr, int validateLongestCommonSonStrThreshold){
        // 转换为字符数组。Java的String底层实际就是以char[]存储的，所以转换不会消耗啥资源；同时，转换成char[]后，便于对单个数组元素进行比较
        char[] originCharArray = originStr.toCharArray();
        char[] newCharArray = newStr.toCharArray();
        // 用于组装含增减标识字符串的builder
        StringBuilder mixedStrResultBuilder = new StringBuilder();

        /*
         * 两个字符串的所有公共子串。
         *  LCS（最长公共子串算法）求得两个字符串的最长公共子串，并借助阈值，对比 左-右、右-左 的公共子串数确定该最长公共子串数的合法性
         *  -> 分治法，根据各自的最长公共子串将两个字符串（剔除最长公共子串后）拆成左右两个字符串，并按照 左-左、右-右对比
         *  -> 递归上述两步操作
         */
        List<CommonSonStrArrayInfo> allSonStrList = new ArrayList<CommonSonStrArrayInfo>();
        buildLongestSonStrArrayInfo(originCharArray, newCharArray, allSonStrList, 0, null, 0, 0
                , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
        if (allSonStrList == null || allSonStrList.size() < 1){
            // 1、两个字符串没有公共子串
            mixedStrResultBuilder.append(moveSignStart);
            mixedStrResultBuilder.append(originStr);
            mixedStrResultBuilder.append(moveSignEnd);
            mixedStrResultBuilder.append(addSignStart);
            mixedStrResultBuilder.append(newStr);
            mixedStrResultBuilder.append(addSignEnd);
            return mixedStrResultBuilder.toString();
        }

        // 对 allSonStrList 按照 originStartIndex 由小到大排序（公共子字符串在 origin 和 new 中的顺序是一致的）
        OriginStrComparator originStrComparator = new OriginStrComparator();
        Collections.sort(allSonStrList, originStrComparator);
        int currentOriginStartIndex = 0;
        int currentNewStartIndex = 0;
        // 公共子串数量
        int sonNum = allSonStrList.size();
        // 拼接 mixedStrResultBuilder
        for (CommonSonStrArrayInfo commonSonStrArrayInfo : allSonStrList){
            int originStartIndex = commonSonStrArrayInfo.getOriginStartIndex();
            int originEndIndex = commonSonStrArrayInfo.getOriginEndIndex();
            int newStartIndex = commonSonStrArrayInfo.getNewStartIndex();
            int newEndIndex = commonSonStrArrayInfo.getNewEndIndex();
            sonNum--;
            // 1、拼接标记字符串
            if (currentOriginStartIndex < originStartIndex){
                // 公共子串前标记删除
                mixedStrResultBuilder.append(moveSignStart);
                mixedStrResultBuilder.append(originStr.substring(currentOriginStartIndex, originStartIndex));
                mixedStrResultBuilder.append(moveSignEnd);
            }
            if (currentNewStartIndex < newStartIndex){
                // 公共子串前标记添加
                mixedStrResultBuilder.append(addSignStart);
                mixedStrResultBuilder.append(newStr.substring(currentNewStartIndex, newStartIndex));
                mixedStrResultBuilder.append(addSignEnd);
            }

            // 2、拼接公共子串
            mixedStrResultBuilder.append(originStr.substring(originStartIndex, originEndIndex + 1));

            // 3、移动指针，补齐字符串
            currentOriginStartIndex = originEndIndex + 1;
            if (sonNum == 0 && currentOriginStartIndex < originStr.length()){
                // 公共子串已经遍历完了，但是字符串还没拼接完，需要将后面的补上
                mixedStrResultBuilder.append(moveSignStart);
                mixedStrResultBuilder.append(originStr.substring(currentOriginStartIndex, originStr.length()));
                mixedStrResultBuilder.append(moveSignEnd);
            }
            // 移动指针
            currentNewStartIndex = newEndIndex + 1;
            if (sonNum == 0 && currentNewStartIndex < newStr.length()){
                // 公共子串已经遍历完了，但是字符串还没拼接完，需要将后面的补上
                mixedStrResultBuilder.append(addSignStart);
                mixedStrResultBuilder.append(newStr.substring(currentNewStartIndex, newStr.length()));
                mixedStrResultBuilder.append(addSignEnd);
            }
        }

        // 返回结果
        return mixedStrResultBuilder.toString();
    }

    /**
     * isBlank
     * @param str
     * @return
     */
    public static boolean isBlank(String str){
        return str == null || "".equals(str);
    }

    /**
     * isNotBlank
     * @param str
     * @return
     */
    public static boolean isNotBlank(String str){
        return str != null && !"".equals(str);
    }

    /**
     * equals
     * @param str1
     * @param str2
     * @return
     */
    public static boolean equals(String str1, String str2){
        return (str1 == null && str2 == null) 
                || (str1 != null && str1.equals(str2));
    }
    
    /**
     * 用于存储两个字符串的公共子串信息的类
     */
    static class CommonSonStrArrayInfo{
        /**
         * 公共子串在原始（被对比）字符串中的起始下标
         */
        @Getter
        @Setter
        private int originStartIndex;
        /**
         * 公共子串在原始（被对比）字符串中的结束下标
         */
        @Getter
        @Setter
        private int originEndIndex;
        /**
         * 公共子串在新的字符串中的起始下标
         */
        @Getter
        @Setter
        private int newStartIndex;
        /**
         * 公共子串在新的字符串中的结束下标
         */
        @Getter
        @Setter
        private int newEndIndex;
    }

    /**
     * 用于存储 originStr 的某一行，对应 newStr 的所有行的公共子串映射
     */
    static class StrLineToAnotherStrLinesMapping{
        /**
         * lineStr 在 strLineArr 中的下标
         */
        @Getter
        @Setter
        private int lineIndex;
        /**
         * lineStr 的值（一整行)
         */
        @Getter
        @Setter
        private String lineStr;
        /**
         * 最长公共子串
         */
        @Getter
        @Setter
        private String commonLongestSubStr;
        /**
         * 对应的新字符串的映射关系，按照 commonLongestSubStr 长短，由长到短排序
         */
        @Getter
        @Setter
        private List<StrLineToAnotherStrLinesMapping> newStrMappingWithOrder;
        /**
         * 对应的唯一的新字符串
         */
        @Getter
        @Setter
        private StrLineToAnotherStrLinesMapping newStrMapping;
    }

    /**
     * 针对 originStrInfo 的排序器
     */
    static class OriginStrComparator implements Comparator{
        /**
         * compare
         * @param o1
         * @param o2
         * @return
         */
        @Override
        public int compare(Object o1, Object o2) {
            CommonSonStrArrayInfo obj1 = (CommonSonStrArrayInfo) o1;
            CommonSonStrArrayInfo obj2 = (CommonSonStrArrayInfo) o2;

            return obj1.getOriginStartIndex() > obj2.getOriginStartIndex() ? 1 : -1;
        }
    }

    /**
     * 针对 str length 的排序器
     */
    static class StrLengthComparator implements Comparator{
        /**
         * compare
         * @param o1
         * @param o2
         * @return
         */
        @Override
        public int compare(Object o1, Object o2) {
            CommonSonStrArrayInfo obj1 = (CommonSonStrArrayInfo) o1;
            CommonSonStrArrayInfo obj2 = (CommonSonStrArrayInfo) o2;

            // length 大的排在前面，一样大的话，不改变原顺序
            return (obj1.getOriginEndIndex() - obj1.getOriginStartIndex())
                    > (obj2.getOriginEndIndex() - obj2.getOriginStartIndex())
                    ? -1 : 1;
        }
    }

    /**
     * 行级的最长公共子串比较器
     */
    static class StrLineLongestCommonStrComparator implements Comparator{
        /**
         * compare
         * @param o1
         * @param o2
         * @return
         */
        @Override
        public int compare(Object o1, Object o2) {
            StrLineToAnotherStrLinesMapping obj1 = (StrLineToAnotherStrLinesMapping) o1;
            StrLineToAnotherStrLinesMapping obj2 = (StrLineToAnotherStrLinesMapping) o2;

            // comonLongestSubStr 长的排在前面，一样长的话，不改变原顺序
            return obj1.getCommonLongestSubStr().length()
                    > obj2.getCommonLongestSubStr().length()
                    ? -1 : 1;
        }
    }

    /**
     * 针对 newStrInfo 的排序器
     */
    static class NewStrComparator implements Comparator{
        /**
         * compare
         * @param o1
         * @param o2
         * @return
         */
        @Override
        public int compare(Object o1, Object o2) {
            CommonSonStrArrayInfo obj1 = (CommonSonStrArrayInfo) o1;
            CommonSonStrArrayInfo obj2 = (CommonSonStrArrayInfo) o2;

            return obj1.getNewStartIndex() > obj2.getNewStartIndex() ? 1 : -1;
        }
    }

    /**
     * 获取目标颜色的相反色。因为颜色相反，可用于对比
     * @param hex 目标颜色
     * @return 相反的颜色
     */
    public static String getContrastColor(String hex) {
        int r = Integer.parseInt(hex.substring(1, 3), 16);
        int g = Integer.parseInt(hex.substring(3, 5), 16);
        int b = Integer.parseInt(hex.substring(5, 7), 16);
        double yiq = (r * 299 + g * 587 + b * 114) / 1000.0;
        return yiq >= 128 ? "#000" : "#fff";
    }
}