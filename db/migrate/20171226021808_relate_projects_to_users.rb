class RelateProjectsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :projects, :user_id, :integer, null: false
  end
end
