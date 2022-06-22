package nhs.digital.eviewerbackend.rest;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import nhs.digital.eviewerbackend.dto.SearchArgs;
import nhs.digital.eviewerbackend.models.SearchResultTreeNode;
import nhs.digital.eviewerbackend.services.BookDocSolrService;

@Slf4j
@RestController
@RequestMapping("/bookdoc")
public class BookDocSearchController extends AbstractController {

	@Autowired
	BookDocSolrService bookSolrService;

//	@ApiOperation(value = "Search books contents", notes = "This can only be done by the unregister user.", response = Page.class)
//	@ApiResponses(value = { @ApiResponse(code = 200, message = "Successfully retrieved list"),
//			@ApiResponse(code = 404, message = "The resource you were trying to reach is not found") })

	@PostMapping(path = "/search", consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
	public ResponseEntity<SearchResultTreeNode> searchBookDoc(@Valid @RequestBody final SearchArgs searchArgs) {

		log.info("searchBookDoc: " + searchArgs);
		return new ResponseEntity<SearchResultTreeNode>(bookSolrService.searchBookDocs(searchArgs), HttpStatus.OK);

	}

}
