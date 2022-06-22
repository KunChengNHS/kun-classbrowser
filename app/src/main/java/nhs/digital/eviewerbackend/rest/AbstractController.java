package nhs.digital.eviewerbackend.rest;

import org.springframework.data.solr.UncategorizedSolrException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.fasterxml.jackson.databind.exc.InvalidFormatException;

import lombok.extern.slf4j.Slf4j;
import nhs.digital.eviewerbackend.dto.ErrorResponse;

/**
 * This class is handling exceptions
 * 
 * @author Kun Cheng
 *
 */
@Slf4j
public class AbstractController {

	@ExceptionHandler({ HttpMessageNotReadableException.class, InvalidFormatException.class })
	public ResponseEntity<ErrorResponse> httpMessageNotReadableExceptionHandler(
			final HttpMessageNotReadableException iae) {

		log.error(iae.getMessage(), iae);
		return new ResponseEntity<>(new ErrorResponse(iae.getMessage()), HttpStatus.BAD_REQUEST);
	}

	@ExceptionHandler({ org.springframework.data.solr.UncategorizedSolrException.class })
	public ResponseEntity<ErrorResponse> solrUncategorizedSolrException(final UncategorizedSolrException iae) {

		log.error(iae.getMessage(), iae);
		return new ResponseEntity<>(new ErrorResponse("Bad Query"), HttpStatus.INTERNAL_SERVER_ERROR);
	}
}
