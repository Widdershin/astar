class CreateTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :tasks do |t|
      t.text :name, null: false
      t.text :description, null: false
      t.boolean :completed, null: false, default: false
      t.boolean :archived, null: false, default: false

      t.timestamps
    end
  end
end
