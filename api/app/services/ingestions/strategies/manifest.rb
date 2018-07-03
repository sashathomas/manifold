module Ingestions
  module Strategies
    class Manifest < Ingestions::Strategies::AbstractStrategy

      def perform
        fetch_external

        preprocess

        manifest
      end

      def determine_ingestibility
        context.source_path_for_file("manifest", %w(yml yaml)).present?
      end

      private

      def fetch_external
        inspector.external_sources.each do |source|
          fetched = compose Ingestions::Fetcher, url: source["source_path"]
          next unless fetched.present?
          title, file = fetched.values_at :title, :file
          inspector.update_sources_and_toc source["source_path"],
                                           "#{title.delete(' ')}.html"
          context.update_working_dirs file.path
        end
      end

      # NB: The output path is important here.  We need to preserve the
      # entire relative path to the file for cases where nested items have
      # the same file name.  The only thing that changes in the output
      # dir is the extension.
      def preprocess
        inspector.convertible_sources.each do |source|
          raw_html = compose Ingestions::Converter,
                             source_path: source
          path_without_ext = context.rel(context.abs(source), context.source_root)
                                    .split(".")
                                    .first
          context.write_build_file "#{path_without_ext}.html", raw_html
        end
      end

      def manifest
        {}.with_indifferent_access.tap do |hash|
          hash[:attributes] = attributes
          hash[:relationships] = relationships
          hash[:start_section_identifier] = inspector.start_section_identifier
        end
      end

      def attributes
        {}.with_indifferent_access.tap do |hash|
          hash[:publication_date] = inspector.date
          hash[:description] = inspector.description
          hash[:metadata] = metadata
          hash[:toc] = inspector.toc
          hash[:landmarks] = []
          hash[:page_list] = []
        end
      end

      def relationships
        {}.with_indifferent_access.tap do |hash|
          hash[:text_titles] = [title]
          hash[:creators] = creators || []
          hash[:contributors] = contributors || []
          hash[:ingestion_sources] = ingestion_sources
          hash[:stylesheets] = stylesheets
          hash[:text_sections] = text_sections
        end
      end

      def metadata
        {}.with_indifferent_access.tap do |hash|
          hash[:unique_identifier] = inspector.unique_id
          hash[:language] = inspector.language
          hash[:rights] = inspector.rights
        end
      end

      def title
        {
          value: inspector.title,
          position: 1,
          kind: ::TextTitle::KIND_MAIN
        }
      end

      def creators
        inspector.creators
      end

      def contributors
        inspector.contributors
      end

      def ingestion_sources
        context.sources.map do |source|
          Strategy::Manifest::IngestionSource.new(self, source).attributes
        end
      end

      def text_sections
        inspector.source_map.map.with_index do |source, index|
          examiner = Strategy::Manifest::TextSection.new self,
                                                         source,
                                                         ingestion_sources,
                                                         index
          attributes = examiner.attributes
          build_path = context.write_build_file "#{examiner.source_identifier}.html",
                                                examiner.body_parsed
          attributes.merge(build: build_path)
        end
      end

      def stylesheets
        inspector.style_nodes.map.with_index do |source, index|
          examiner = Strategy::Document::Stylesheet.new self, source, index
          attributes = examiner.attributes
          path = context.write_build_file "#{attributes[:name]}.css",
                                          examiner.raw_styles
          attributes.merge(build: path)
        end
      end
    end
  end
end
