package me.lb.controller.admin.common;

import java.io.IOException;
import java.io.InputStream;

import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.apache.commons.io.IOUtils;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

import me.lb.model.system.User;
import me.lb.support.jackson.JsonWriter;
import me.lb.utils.UserUtil;

@Controller
public class CommonController {

	@ResponseBody
	@RequestMapping(value = "/getLoginInfo")
	public String getLoginInfo(HttpSession session) {
		try {
			User user = UserUtil.getUserFromSession(session);
			if (user != null) {
				return JsonWriter.getInstance()
						.filter(User.class)
						.getWriter().writeValueAsString(user);
			} else {
				return "{}";
			}
		} catch (Exception e) {
			e.printStackTrace();
			return "{}";
		}
	}
	
	@RequestMapping(value = "/favicon.ico")
	public void getFavicon(HttpServletResponse response) {
		try {
			InputStream input = this.getClass().getClassLoader().getResourceAsStream("favicon.ico");
			response.setContentType("image/x-icon");
			IOUtils.copy(input, response.getOutputStream());
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}