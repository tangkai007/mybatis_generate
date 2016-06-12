package web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

@Controller
@RequestMapping("/example")
public class ExampleController {

	/**
	 * 跳转到欢迎页
	 * @return
	 */
    @RequestMapping(value = "/index", method = RequestMethod.GET)
    public String index(){
        return "welcome";
    }
	
}
