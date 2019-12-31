module ApiDocs
  module Definitions
    module Resources
      class Favorite

        REQUIRED_CREATE_RELATIONSHIPS = [:favoritable].freeze

        class << self
          include Resource

          def create_relationships
            {
              favoritable: Types::Hash.schema(
                data: Types::Hash.schema(
                  id: Types::Serializer::ID,
                  type: Types::String.meta(example: "comment")
                )
              )
            }
          end
        end
      end
    end
  end
end
