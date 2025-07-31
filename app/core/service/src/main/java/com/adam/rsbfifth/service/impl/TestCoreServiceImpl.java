package com.adam.rsbfifth.service.impl;

import com.adam.rsbfifth.TestModel;
import com.adam.rsbfifth.dao.TestDao;
import com.adam.rsbfifth.integration.TestIntergration;
import com.adam.rsbfifth.service.TestCoreService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 * @ClassName TestCoreServiceImpl
 * @Package com.adam.rsbfifth.service.impl
 * @Description TODO
 * @Author adam
 * @Date 2020/5/26 21:03
 * @Version 1.0.0
 **/
@Service
public class TestCoreServiceImpl implements TestCoreService {
    @Autowired
    private TestIntergration testIntergration;
    @Autowired
    private TestDao testDao;
    @Override
    public void testCoreService() {
        testDao.testDao();
        testIntergration.testIntegration();
        TestModel testModel = new TestModel();
        testModel.setTestElement("element is a");
        System.out.println("testCoreService,testModel: " + testModel);
    }
}
