package nhs.digital.eviewerbackend.conf;

import org.apache.solr.client.solrj.SolrClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.solr.core.SolrOperations;
import org.springframework.data.solr.core.SolrTemplate;
import org.springframework.data.solr.server.support.HttpSolrClientFactoryBean;

/**
 * configuration for solr: loading solr configuration from properties file
 * @author KUCH1
 */
@Configuration
public class SolrConfiguration {

	@Value("${spring.data.solr.host}")
	String solrHost;

	@Bean
	public HttpSolrClientFactoryBean solrServerFactoryBean() {
		HttpSolrClientFactoryBean factory = new HttpSolrClientFactoryBean();
		factory.setUrl(solrHost);
		return factory;
	}

	@Bean
	public SolrOperations solrTemplate() throws Exception {

		return new SolrTemplate(solrClient());
	}

	@Bean
	public SolrClient solrClient() throws Exception {
		return solrServerFactoryBean().getObject();
	}
}