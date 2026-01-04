package com.adam.rsbfifth.manager.impl;

import com.adam.rsbfifth.manager.StrComparatorManager;
import com.adam.rsbfifth.service.impl.util.StringUtilsPy;
import org.springframework.stereotype.Service;

import java.util.Map;

/**
 * @ClassName StrComparatorManager
 * @Package com.adam.rsbfifth.manager
 * @Description 字符串对比
 * @Author adam
 * @Date 1/4/26 9:57 PM
 * @Version 1.0.0
 **/
@Service
public class StrComparatorManagerImpl implements StrComparatorManager {
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
     *              {@param originStrKey} 对应的是原始字符串的值，其中体现 删除 部分
     *              {@param #newStrKey} 对应的是（可能）变更后的字符串的值，其中体现 新增 部分
     *          - 融合模式下
     *              {@param #resultAtOriginStrKey} 对应的是原始字符串的值，其中体现了 新增、删除 的部分
     */
    public Map<String, String> compare(String originStr, String newStr
            , String addColor, String removeColor
            , Integer minArrayLengthOfLongestCommonStr, Integer validateLongestCommonSonStrThreshold){
        return StringUtilsPy.compare(originStr, newStr, addColor, removeColor
                , minArrayLengthOfLongestCommonStr, validateLongestCommonSonStrThreshold);
    }
}
