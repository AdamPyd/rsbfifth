package com.adam.rsbfifth.manager.impl;

import com.adam.rsbfifth.manager.TestManager;
import com.adam.rsbfifth.service.TestCoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @ClassName TestManagerImpl
 * @Package com.adam.rsbfifth.manager.impl
 * @Description TODO
 * @Author adam
 * @Date 2020/5/26 21:02
 * @Version 1.0.0
 **/
@Service
public class TestManagerImpl implements TestManager {

    @Autowired
    private TestCoreService testCoreService;
    @Override
    public void testManager() {
        testCoreService.testCoreService();
        System.out.println("testManager");
    }
}
