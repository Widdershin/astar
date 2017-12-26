class Goal < ApplicationRecord
  belongs_to :project

  has_many :requirements
  has_many :tasks, through: :requirements

  def next_tasks
    tasks.map(&:next_tasks).uniq
  end
end
