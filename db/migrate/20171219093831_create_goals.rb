class CreateGoals < ActiveRecord::Migration[5.1]
  def change
    create_table :goals do |t|
      t.belongs_to :task, null: false

      t.timestamps
    end
  end
end
