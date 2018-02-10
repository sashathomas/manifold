require "rails_helper"

RSpec.describe Permissions::Destroy do
  let(:user) { FactoryBot.create(:user) }
  let(:project) { FactoryBot.create(:project) }
  let(:permission) { Permission.new(user_id: user.id,
                                    resource_id: project.id,
                                    resource_type: project.class.name,
                                    role_names: %w(author))
  }

  it "correctly removes roles" do
    user.add_role :author, project
    Permissions::Destroy.run permission: permission
    expect(user.roles).to_not include 'owner', 'author'
  end
end
