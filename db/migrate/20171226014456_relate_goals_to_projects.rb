class RelateGoalsToProjects < ActiveRecord::Migration[5.1]
  def up
    add_column :goals, :project_id, :integer, null: false
  end
end
