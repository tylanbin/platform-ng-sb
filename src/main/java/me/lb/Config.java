package me.lb;

import me.lb.support.system.filter.PaginationFilter;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.StringHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.filter.HttpPutFormContentFilter;
import org.springframework.web.multipart.commons.CommonsMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.nio.charset.Charset;
import java.util.List;

@EnableWebMvc
@Configuration
public class Config {

	// 静态资源路径映射
	@Bean
	public WebMvcConfigurerAdapter mvcConfigurer() {
		return new WebMvcConfigurerAdapter() {
			@Override
			public void addResourceHandlers(ResourceHandlerRegistry registry) {
				registry.addResourceHandler("/web/**", "/assets/**").addResourceLocations("/web/", "/assets/");
				super.addResourceHandlers(registry);
			}
			@Override
			public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
				converters.add(new StringHttpMessageConverter(Charset.forName("utf-8")));
				converters.add(new MappingJackson2HttpMessageConverter());
				super.configureMessageConverters(converters);
			}
		};
	}

	// 启用上传文件
	@Bean
	public CommonsMultipartResolver multipartResolver() {
		return new CommonsMultipartResolver();
	}

	// 分页过滤器，用于获取分页参数
	@Bean
	public FilterRegistrationBean paginationFilter() {
		FilterRegistrationBean reg = new FilterRegistrationBean();
		reg.setFilter(new PaginationFilter());
		reg.addUrlPatterns("/*");
		return reg;
	}

	// 处理PUT请求的参数
	@Bean
	public FilterRegistrationBean putFormContentFilter() {
		FilterRegistrationBean reg = new FilterRegistrationBean();
		reg.setFilter(new HttpPutFormContentFilter());
		reg.addUrlPatterns("/*");
		return reg;
	}

}
