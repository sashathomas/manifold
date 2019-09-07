require "rails_helper"

RSpec.describe "My Reading Groups API", type: :request do

  include_context("authenticated request")
  include_context("param helpers")

  let(:another_user) { FactoryBot.create(:user) }

  describe "sends my reading groups" do

    let(:path) { api_v1_me_relationships_reading_groups_path }

    context "when the user is not authenticated" do
      before(:each) { get path }
      it "has a 401 status code" do
        expect(response).to have_http_status(401)
      end
    end

    context "when the user is a reader" do

      before(:each) {
        get path, headers: reader_headers
      }
      let(:api_response) { JSON.parse(response.body) }

      describe "the response" do

        it "includes an array of data" do
          expect(api_response["data"]).to be_instance_of Array
        end

        it "has a 200 status code" do
          expect(response).to have_http_status(200)
        end

      end
    end
  end

end
