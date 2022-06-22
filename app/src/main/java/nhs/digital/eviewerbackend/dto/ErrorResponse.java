package nhs.digital.eviewerbackend.dto;


import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

/**
 * Customised ErrorResponse to handle error from Rest webservice layer.
 *
 * @author kuch1
 */
public final class ErrorResponse implements Serializable {

    /**
	 * 
	 */
	private static final long serialVersionUID = 1646717586036615200L;
	private List<String> messages;

    /**
     * Default constructor method
     */
    public ErrorResponse() {
        messages = new ArrayList<String>();
    }

    /**
     * Constructor method to initialise messages property
     *
     * @param messages single error message
     */
    public ErrorResponse(final String messages) {

        this();

        this.messages.add(messages);
    }

    /**
     * Constructor method to initialise messages property
     *
     * @param messages error messages
     */
    public ErrorResponse(final List<String> messages) {

        this.messages = messages;
    }

    /**
     * Setter for property messages
     *
     * @param messages error messages
     */
    public void setMessages(final List<String> messages) {
        this.messages = messages;
    }

    /**
     * Getter for property messages
     *
     * @return List of error messages
     */
    public List<String> getMessages() {

        return messages;
    }
}