class CreateRequirements < ActiveRecord::Migration[5.1]
  def change
    create_table :requirements do |t|
      t.belongs_to :task
      t.belongs_to :goal

      t.timestamps
    end
  end
end
