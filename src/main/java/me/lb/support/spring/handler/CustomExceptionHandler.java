package me.lb.support.spring.handler;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

/**
 * 自定义异常处理器
 */
@RestControllerAdvice
public class CustomExceptionHandler {

	@ExceptionHandler(Exception.class)
	@ResponseStatus(HttpStatus.INTERNAL_SERVER_ERROR)
	public Map<String, Object> resolveException(Exception ex) {
		Map<String, Object> result = new HashMap<>();
		result.put("ex", ex.getMessage());
		result.put("msg", "错误，请联系管理员！");
		return result;
	}

}