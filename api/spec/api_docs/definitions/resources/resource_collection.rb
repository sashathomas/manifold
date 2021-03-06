module ApiDocs
  module Definitions
    module Resources
      class ResourceCollection

        REQUEST_ATTRIBUTES = {
          thumbnail: Types::Serializer::Upload,
          remove_thumbnail: Types::Bool
        }

        class << self

          include ApiDocs::Definitions::Resource

          def create_attributes
            request_attributes.except(:remove_thumbnail)
          end

        end
      end
    end
  end
end
