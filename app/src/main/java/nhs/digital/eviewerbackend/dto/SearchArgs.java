package nhs.digital.eviewerbackend.dto;

import java.util.List;

import javax.validation.constraints.NotEmpty;

import lombok.Data;
import lombok.NoArgsConstructor;
import nhs.digital.eviewerbackend.validators.NotEmptyFields;

@Data
@NoArgsConstructor
public class SearchArgs {
	@NotEmpty(message = "Book with version is mandatory field.")
	@NotEmptyFields(message = "Book with version can not be empty.")
//	@ApiModelProperty(notes = "Book with version", example = "[ICD-10-5th-EDITION]")
	private List<String> releaseVersions;

//	@ApiModelProperty(notes = "branch of book tree navigation", required = false, allowEmptyValue = true, example = "[\"Volume 1 – Tabular list Tabular list of inclusions and four-character subcategories\", "
//			+ "\"Volume 3 – Alphabetical index Alphabetical index to diseases and nature of injury\", "
//			+ "\"Volume 3 – Alphabetical index External causes of injury\", "
//			+ "\"Volume 3 – Alphabetical index Table of drugs and chemicals\"]")
	private List<String> branches;

	@NotEmpty(message = "Search content is mandatory field.")
//	@ApiModelProperty(notes = "Search phrase", required = true, allowEmptyValue = false, example = "Absinthe")
	private String searchContent;

	public SearchArgs(List<String> releaseVersions, List<String> branches, String searchContent) {
		this.releaseVersions = releaseVersions;
		this.branches = branches;
		this.searchContent = searchContent;
	}
}
