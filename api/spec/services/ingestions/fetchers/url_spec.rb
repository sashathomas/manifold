require "rails_helper"

RSpec.describe Ingestions::Fetchers::Url, slow: true do

  before(:all) do
    url = "https://storage.googleapis.com/manifold-assets/spec/e-t-a-hoffmann_master-flea.epub3"
    root = Dir.mktmpdir
    WebMock.allow_net_connect!
    @result = described_class.run! url: url, root: root
    WebMock.disable_net_connect!
  end

  include_examples "a fetcher"

end
