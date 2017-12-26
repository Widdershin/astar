class RemoveGoalTaskRelationship < ActiveRecord::Migration[5.1]
  def change
    remove_column :goals, :task_id
  end
end
