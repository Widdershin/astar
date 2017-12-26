class AddNameAndDescriptionToGoal < ActiveRecord::Migration[5.1]
  def change
    add_column :goals, :name, :string, null: false
    add_column :goals, :description, :string, null: false, default: ''
  end
end
