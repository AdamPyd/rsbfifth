package com.adam.rsbfifth.integration.impl;

import com.adam.rsbfifth.integration.TestIntergration;
import org.springframework.stereotype.Service;

/**
 * @ClassName TestIntegrationImpl
 * @Package com.adam.rsbfifth.integration.impl
 * @Description TODO
 * @Author adam
 * @Date 2020/5/26 21:05
 * @Version 1.0.0
 **/
@Service
public class TestIntegrationImpl implements TestIntergration {
    @Override
    public void testIntegration() {
        System.out.println("TestIntegration~");
    }

}
