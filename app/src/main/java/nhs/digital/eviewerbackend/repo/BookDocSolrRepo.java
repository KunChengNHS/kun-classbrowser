package nhs.digital.eviewerbackend.repo;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.annotation.Resource;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.core.query.Query;
import org.springframework.data.solr.core.query.SimpleQuery;
import org.springframework.data.solr.core.query.SimpleStringCriteria;
import org.springframework.stereotype.Repository;

import nhs.digital.eviewerbackend.dto.SearchArgs;
import nhs.digital.eviewerbackend.models.BookDoc;
import nhs.digital.eviewerbackend.models.SearchResultTreeNode;


@Repository
public class BookDocSolrRepo   {
	@Resource
	private SolrTemplate solrTemplate;

	private static final String OPCS_PERFIX = "OPCS-";
	private static final String ICD10_PERFIX = "ICD-10";
	private static final String DOUBLE_QUOTE = "\"";
	private static final String SPACE = " ";
	private static final String EMPTY = "";
	private static final String SPACE_AND_SPACE = " AND ";
	private static final List<String> KEYWORDS = Arrays.asList("AND", "OR", "NOT", "");
	private static final String OPCS_DEFAULT_BRANCHES = "\"Volume I - Tabular List Part 2 - Tabular List of Four Digit Subcategories\" \"Volume II - Alphabetical Index I. Alphabetical Index of Interventions and Surgical Procedures\"";
	private static final String ICD10_DEFAULT_BRANCHES = "\"Volume 1 – Tabular list Tabular list of inclusions and four-character subcategories\" "
			+ "\"Volume 3 – Alphabetical index Alphabetical index to diseases and nature of injury\" "
			+ "\"Volume 3 – Alphabetical index External causes of injury\" "
			+ "\"Volume 3 – Alphabetical index Table of drugs and chemicals\"";
	private static final String QUERY = "releaseVersion:(%s) AND contextFull:(%s) AND titleContents:(%s)";

	private static final Function<String, String> addQuotes = s -> DOUBLE_QUOTE + s + DOUBLE_QUOTE;

	public SearchResultTreeNode search(SearchArgs searchArgs) {

		Pageable pageable = PageRequest.of(0, 3000, Sort.by(Sort.Direction.ASC, "fileName", "_version_"));

		Query query = new SimpleQuery(new SimpleStringCriteria(buildQuery(searchArgs)))
				.setPageRequest(pageable);

		Page<BookDoc> bookDocs = solrTemplate.queryForPage("book",query, BookDoc.class);

		return covertSearchResultToTree(searchArgs, bookDocs);
	}

	private String buildQuery(SearchArgs searchArgs) {

		String releaseVersions = addQuotes(searchArgs.getReleaseVersions());
		String branches = calcSearchBranches(searchArgs.getReleaseVersions(), searchArgs.getBranches());
		String searchContent = calcSearchContent(searchArgs.getSearchContent());
		return String.format(QUERY, releaseVersions, branches, searchContent);

	}

	private String addQuotes(List<String> list) {
		return list.stream().map(addQuotes).collect(Collectors.joining(SPACE));

	}

	/**
	 * If ending with "AND, OR, NOT" DO not add " AND " with last word If "AND, OR,
	 * NOT" appear in the middle of array, do not add " AND "
	 *
	 * @param content
	 * @return
	 */
	public String calcSearchContent(String content) {
		String[] contentList = content.split(SPACE);
		String str = "";
		if (contentList.length == 1) {
			str = KEYWORDS.contains(content) ? str = EMPTY : content;

		} else {
			Stream<String> stream = Stream.of(contentList);
			List<String> list = stream.filter(p -> !p.equals(EMPTY)).collect(Collectors.toList());

			int listSize = list.size();

			for (int index = 0; index < listSize; index++) {

				String currentWord = list.get(index);

				if (index == 0) {
					str += KEYWORDS.contains(currentWord) ? str = EMPTY : currentWord;
				} else if (index == listSize - 1) {
					String previousWord = list.get(index - 1);
					if (KEYWORDS.contains(previousWord) && !KEYWORDS.contains(currentWord)) {
						// YN
						str += SPACE + currentWord;
					} else {
						str += KEYWORDS.contains(currentWord) ? str = EMPTY : SPACE_AND_SPACE + currentWord;
					}
				} else {

					String previousWord = list.get(index - 1);

					if (KEYWORDS.contains(previousWord) && KEYWORDS.contains(currentWord)) {
						// YY (OR AND)
						str = EMPTY;
						break;

					} else if (!KEYWORDS.contains(previousWord) && !KEYWORDS.contains(currentWord)) {
						// NN
						str += SPACE_AND_SPACE + currentWord;

					} else {
						// NY or YN
						str += SPACE + currentWord;
					}
				}

			}

		}

		return str.trim();
	}

	private String calcSearchBranches(List<String> releases, List<String> branches) {

		if (null == branches || branches.isEmpty()) {
			return releases.get(0).toUpperCase().startsWith(OPCS_PERFIX) ? OPCS_DEFAULT_BRANCHES
					: ICD10_DEFAULT_BRANCHES;
		} else {
			// for tree root check
			if (branches.stream()
					.anyMatch(b -> (b.startsWith(OPCS_PERFIX) || b.startsWith(ICD10_PERFIX)) && !b.contains(SPACE))) {
				return DOUBLE_QUOTE + DOUBLE_QUOTE;
			}
			return addQuotes(branches);
		}
	}

	private SearchResultTreeNode covertSearchResultToTree(SearchArgs searchArgs, Page<BookDoc> pageBookDocs) {

		if (pageBookDocs.getTotalElements() == 0)
			return new SearchResultTreeNode("", "No result found: " + searchArgs.getSearchContent(), true);

		Map<String, Map<String, List<SearchResultTreeNode>>> map = convertToMap(pageBookDocs);

		List<SearchResultTreeNode> firstLevelList = new ArrayList<SearchResultTreeNode>();

		map.forEach((firstLevelKey, firstLevelValue) -> {

			List<SearchResultTreeNode> secondLevelList = new ArrayList<SearchResultTreeNode>();
			firstLevelValue.forEach((secondLevelKey, secondLevelValue) -> {

				SearchResultTreeNode finalNode = new SearchResultTreeNode("", secondLevelKey, true, secondLevelValue);
				secondLevelList.add(finalNode);

			});

			SearchResultTreeNode secondLevelNode = new SearchResultTreeNode("", firstLevelKey, true, secondLevelList);
			firstLevelList.add(secondLevelNode);
		});
		SearchResultTreeNode rootNode = new SearchResultTreeNode("",
				"Found: " + pageBookDocs.getNumberOfElements() + " matches", true, firstLevelList);

		return rootNode;
	}

	Map<String, Map<String, List<SearchResultTreeNode>>> convertToMap(Page<BookDoc> pageBookDocs) {
		List<BookDoc> bookDocs = pageBookDocs.getContent();

		Map<String, Map<String, List<SearchResultTreeNode>>> map = new LinkedHashMap<>();

		bookDocs.forEach(book -> {
			List<String> levels = book.getContext();
			String first = levels.get(0);
			String second = levels.get(1);
			String title = book.getTitle();
			String path = book.getPath();

			SearchResultTreeNode endNode = new SearchResultTreeNode(path, title, false);

			if (!map.containsKey(first)) {
				// Not containing, first element

				Map<String, List<SearchResultTreeNode>> secondLevelMap = new LinkedHashMap<>();
				List<SearchResultTreeNode> nodeList = new ArrayList<>();
				nodeList.add(endNode);
				secondLevelMap.put(second, nodeList);
				map.put(first, secondLevelMap);

			} else {
				// exitsing first element

				Map<String, List<SearchResultTreeNode>> secondLevelMap = map.get(first);
				if (!secondLevelMap.containsKey(second)) {
					// first time
					List<SearchResultTreeNode> nodeList = new ArrayList<>();
					nodeList.add(endNode);
					secondLevelMap.put(second, nodeList);
				} else {
					// existing
					secondLevelMap.get(second).add(endNode);
				}
			}

		});

		return map;
	}
}
