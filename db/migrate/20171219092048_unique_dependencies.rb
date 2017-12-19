class UniqueDependencies < ActiveRecord::Migration[5.1]
  def up
    execute "ALTER TABLE dependencies ADD UNIQUE (dependent_task_id, resolved_task_id);"
  end

  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
