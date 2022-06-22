package nhs.digital.eviewerbackend.models;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.Data;

@Data
public class TreeNodeState {
	
	@JsonProperty("disabled")
    private boolean disabled;

    public TreeNodeState(boolean disabled) {
        this.disabled = disabled;
    }
 
}
