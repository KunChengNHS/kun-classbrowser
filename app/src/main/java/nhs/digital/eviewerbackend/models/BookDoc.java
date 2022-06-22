package nhs.digital.eviewerbackend.models;

import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.solr.core.mapping.Indexed;
import org.springframework.data.solr.core.mapping.SolrDocument;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor

@Data
@SolrDocument(collection = "book")
public class BookDoc {
	@Id
	@Indexed(name = "path", type = "string", required = true)
	private String path;
        
	@Indexed(name = "code", type = "string")
	private String code;

	@Indexed(name = "title", type = "string", copyTo = { "titleContents" })
	private String title;

	@Indexed(name = "releaseVersion", type = "string", required = true)
	private String releaseVersion;

	@Indexed(name = "fileName", type = "string", required = true)
	private String fileName;

	@Indexed(name = "context", type = "text_general")
	private List<String> context;
	
	@Indexed(name = "contextFull", type = "text_general")
	private List<String> contextFull;

	@Indexed(name = "contents", type = "string", stored = false, copyTo = { "titleContents" })
	private String contents;

	@Indexed(name = "titleContents", type = "text_general", stored = false)
	private List<String> titleContents;
	
	@Indexed(name = "boostAlphabeticalIndex", type = "plong", stored = false)
	private Long boostAlphabeticalIndex;

	@Override
	public String toString() {
		return "BookDoc [path=" + path + ", title=" + title + ", releaseVersion=" + releaseVersion + ", fileName="
				+ fileName + ", code="+code + ", context=" + context + ", contents=" + contents + ", titleContents=" + titleContents
				+ "]"+"\n";
	}
	
	

}
