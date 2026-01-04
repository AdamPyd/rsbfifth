package com.adam.rsbfifth.web.home.compare;

import com.adam.rsbfifth.manager.StrComparatorManager;
import com.adam.rsbfifth.service.impl.util.StringUtilsPy;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;
import java.util.Map;

/**
 * @ClassName StrComparatorCotroller
 * @Package com.adam.rsbfifth.web.home.compare
 * @Description 文本对比
 * @Author adam
 * @Date 1/4/26 9:54 PM
 * @Version 1.0.0
 **/
@Controller
@RequestMapping("api/diff")
public class StrComparatorCotroller {
    /**
     * 字符串对比
     */
    @Autowired
    private StrComparatorManager strComparatorManager;
    /**
     * 错误信息-{@value}
     */
    private static final String ERROR_MSG = "errorMsg";
    /**
     * 字符串对比
     * @param originStr
     * @param newStr
     * @param addColor
     * @param removeColor
     * @param minLongestCommonStrArrayLength
     * @param validateLongestCommonSonStrThreshold
     * @return
     */
    @GetMapping("strCompare.json")
    @ResponseBody
    private Map<String, String> strCompare(@RequestParam(value = "originStr", required = false) String originStr
            , @RequestParam(value = "newStr", required = false) String newStr
            , @RequestParam(value = "addColor", required = false) String addColor
            , @RequestParam(value = "removeColor", required = false) String removeColor
            , @RequestParam(value = "minLongestCommonStrArrayLength", required = false) String minLongestCommonStrArrayLength
            , @RequestParam(value = "validateLongestCommonSonStrThreshold", required = false) String validateLongestCommonSonStrThreshold){
        Map<String, String> resultMap = new HashMap<>();
        if (StringUtilsPy.isBlank(originStr)){
            resultMap.put(ERROR_MSG, "originStr 不能为空");
            return resultMap;
        }
        if (StringUtilsPy.isBlank(newStr)){
            resultMap.put(ERROR_MSG, "newStr 不能为空");
            return resultMap;
        }
        Integer minLongestCommonStrArrayLengthInt = null;
        if (StringUtilsPy.isNotBlank(minLongestCommonStrArrayLength)){
            try {
                minLongestCommonStrArrayLengthInt = Integer.parseInt(minLongestCommonStrArrayLength);
            } catch (NumberFormatException e) {
                resultMap.put(ERROR_MSG, String.format("minLongestCommonStrArrayLength(%s) 不合法，要求为数字字符串,e:%s"
                        , minLongestCommonStrArrayLength, e.getMessage()));
                return resultMap;
            }
        }
        Integer validateLongestCommonSonStrThresholdInt = null;
        if (StringUtilsPy.isNotBlank(validateLongestCommonSonStrThreshold)){
            try {
                validateLongestCommonSonStrThresholdInt = Integer.parseInt(validateLongestCommonSonStrThreshold);
            } catch (NumberFormatException e) {
                resultMap.put(ERROR_MSG, String.format("validateLongestCommonSonStrThreshold(%s) 不合法，要求为数字字符串,e:%s"
                        , validateLongestCommonSonStrThreshold, e.getMessage()));
                return resultMap;
            }
        }
        return strComparatorManager.compare(originStr, newStr, addColor, removeColor
                , minLongestCommonStrArrayLengthInt, validateLongestCommonSonStrThresholdInt);
    }
}
