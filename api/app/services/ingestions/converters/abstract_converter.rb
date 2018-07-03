module Ingestions
  module Converters
    # @abstract
    class AbstractConverter < Ingestions::AbstractInteraction
      define_model_callbacks :convertibility_check, :perform

      string :contents, default: nil
      string :source_path, default: nil

      boolean :test_only, default: false

      def execute
        run_callbacks :convertibility_check do
          @convertible = determine_convertibility
        end

        return convertible? if test_only
        return nil unless convertible?

        run_callbacks :perform do
          @manifest = perform
        end

        manifest
      end

      def convertible?
        @convertible
      end

      attr_reader :manifest

      # @return [Manifest]
      def perform
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      # @abstract
      # @return [Boolean]
      def self.convertible_extensions
        raise NotImplementedError, "Must implement #{self.class}##{__method__}"
      end

      protected

      def determine_convertibility
        self.class.convertible_extensions.include? File.extname(source_path).delete(".")
      end

    end
  end
end
