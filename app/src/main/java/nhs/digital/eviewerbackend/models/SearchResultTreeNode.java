package nhs.digital.eviewerbackend.models;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class SearchResultTreeNode {

	@JsonProperty("id")
	private String id;
	@JsonProperty("text")
	private String text;
	@JsonProperty("children")
	private List<SearchResultTreeNode> children;
	@JsonProperty("state")
	private TreeNodeState state;

	public SearchResultTreeNode(String id, String text, boolean state) {
		super();
		this.id = id;
		this.text = text;
		this.state = new TreeNodeState(state);

	}

	public SearchResultTreeNode(String id, String text, boolean state, List<SearchResultTreeNode> children) {
		super();
		this.id = id;
		this.text = text;
		this.state = new TreeNodeState(state);
		this.children = children;

	}

}
