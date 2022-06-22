package nhs.digital.eviewerbackend.rest;

import static io.restassured.module.mockmvc.RestAssuredMockMvc.given;
import static org.hamcrest.CoreMatchers.containsString;

import java.util.Arrays;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import io.restassured.http.ContentType;
import io.restassured.module.mockmvc.RestAssuredMockMvc;
import io.restassured.module.mockmvc.response.MockMvcResponse;
import nhs.digital.eviewerbackend.dto.SearchArgs;

@SpringBootTest
public class BookDocSearchControllerTest {

	@Autowired
	BookDocSearchController bookDocSearchController;

	@BeforeEach
	public void setup() {

		RestAssuredMockMvc.standaloneSetup(bookDocSearchController);
		RestAssuredMockMvc.basePath = "/bookdoc";
	}

	@Test
	public void testSearchJsonWithNoResult() {

		String searchContent = "xxxxxxxxxxxxxxxxxxx";

		SearchArgs sa = new SearchArgs(Arrays.asList("OPCS-4.8"), null, searchContent);

		searchBookDocsRestApiCall("/search", sa, 200).then().body("text",
				containsString("No result found: " + searchContent));

	}

	@Test
	public void testSearchJsonWithSingleBook() {

		SearchArgs sa = new SearchArgs(Arrays.asList("OPCS-4.8"), null, "Tissue of");

		searchBookDocsRestApiCall("/search", sa, 200).then().body(containsString("Found:"))
				.body(containsString("matches"));

	}

	private MockMvcResponse searchBookDocsRestApiCall(String path, Object sp, final int statusCode) {

		MockMvcResponse response = given().log().all().contentType(ContentType.JSON).body(sp).post(path);
		response.then().statusCode(statusCode);

		return response;
	}
}
