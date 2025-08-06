package com.adam.rsbfifth.web.home.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
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
        registry.addMapping("/api/**")
                // 允许前端开发服务器
                .allowedOrigins(
                        "http://localhost:3000"
                        , "http://localhost:80"
                        , "http://localhost",
                        "http://127.0.0.1:3000"
                        , "http://127.0.0.1:80"
                        , "http://127.0.0.1"
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true)
                .maxAge(3600);
    }

    /**
     * 添加全局路由回退配置，将所有前端路由请求指向index.html，
     * 防止非 {host}:{port}/ 请求映射不到前端 index.html 文件，造成url 路由失效
     * @param registry
     */
    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // 匹配所有前端路由路径
        registry.addViewController("/{path:[^\\.]*}")
                .setViewName("forward:/index.html");
    }
}