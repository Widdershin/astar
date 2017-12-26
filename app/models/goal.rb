class Goal < ApplicationRecord
  belongs_to :task
  belongs_to :project
end
