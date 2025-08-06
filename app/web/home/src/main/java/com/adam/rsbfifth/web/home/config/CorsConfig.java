package com.adam.rsbfifth.web.home.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * @ClassName CorsConfig
 * @Package com.adam.backend.web.config
 * @Description 处理前端跨域问题
 * @Author adam
 * @Date 6/7/25 7:34 PM
 * @Version 1.0.0
 **/
@Configuration
public class CorsConfig implements WebMvcConfigurer {
    /**
     * 处理前端请求时的 uri 跨域问题
     * @param registry
     */
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                // 允许前端开发服务器
                .allowedOrigins(
                        "http://localhost:3000"
                        , "http://localhost:80"
                        , "http://localhost",
                        "http://**:3000"
                        , "http://**:80"
                        , "http://**"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

//    /**
//     * 处理打包后，web-home bundle 找不到父 Bundle 中的静态资源的问题。故这里要扫描静态资源
//     * @param registry
//     */
//    @Override
//    public void addResourceHandlers(ResourceHandlerRegistry registry) {
//        // 添加父模块资源路径
//        registry.addResourceHandler("/**")
//                .addResourceLocations(
//                        "classpath:/static/",
//                        "file:../parent-module/src/main/resources/static/" // 相对路径
//                );
//    }
}