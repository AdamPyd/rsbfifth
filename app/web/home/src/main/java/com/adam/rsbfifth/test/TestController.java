package com.adam.rsbfifth.test;

import com.adam.rsbfifth.TestUtil;
import com.adam.rsbfifth.manager.TestManager;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import java.util.HashMap;

/**
 * @ClassName TestController
 * @Package com.adam.rsbfifth.test
 * @Description TODO
 * @Author adam
 * @Date 2020/5/26 20:59
 * @Version 1.0.0
 **/
@Controller
@RequestMapping("api")
public class TestController {
    @Autowired
    private TestManager testManager;

    @GetMapping("hello.json")
    @ResponseBody
    private String testController(){
        TestUtil.testUtil();
        testManager.testManager();
        System.out.println("testController");
        HashMap<String, Object> resultMap = new HashMap<>();
        HashMap<String, String> dataMap = new HashMap<>();
        dataMap.put("message", "Hello World~");
        dataMap.put("timestamp", System.currentTimeMillis() + "");
        resultMap.put("data", dataMap);
        return JSONObject.toJSONString(resultMap);
    }
}