module ApiDocs
  module Definitions
    module Resources
      class Comment

        REQUIRED_CREATE_ATTRIBUTES = [:body].freeze

        class << self

          include ApiDocs::Definitions::Resource

          def create_attributes
            request_attributes.except(:deleted)
          end

        end
      end
    end
  end
end
