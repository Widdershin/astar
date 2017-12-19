class CreateDependencies < ActiveRecord::Migration[5.1]
  def change
    create_table :dependencies do |t|
      t.integer :dependent_task_id, null: false
      t.integer :resolved_task_id, null: false

      t.timestamps
    end
  end
end
