package nhs.digital.eviewerbackend.services;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.apache.commons.lang.StringEscapeUtils;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import nhs.digital.eviewerbackend.dto.SearchArgs;
import nhs.digital.eviewerbackend.models.SearchResultTreeNode;
import nhs.digital.eviewerbackend.repo.BookDocSolrRepo;

@Service
public class BookDocSolrService {

	private static String pattern = "style=(\"|\\')(.*?)(\"|\\')";
	@Autowired
	private BookDocSolrRepo bookSolrRepository;

	public SearchResultTreeNode searchBookDocs(SearchArgs searchArgs) {
		removeScriptInjection(searchArgs);
		
		System.out.println(searchArgs);
		return bookSolrRepository.search(searchArgs);
	}

	
	private void removeScriptInjection(SearchArgs searchArgs) {

		String searchContent = searchArgs.getSearchContent();

		Pattern r = Pattern.compile(pattern);
		Matcher m = r.matcher(searchContent);
		searchContent = m.replaceAll("");

		if (StringUtils.containsIgnoreCase(searchContent, "<style>")) {
			searchContent = StringUtils.replace(searchContent.toLowerCase(), "<style>", "");
		}

		String newSearchContent = StringEscapeUtils.escapeHtml(searchContent);
		searchArgs.setSearchContent(newSearchContent);

	}

}
