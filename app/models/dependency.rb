class Dependency < ApplicationRecord
  belongs_to :dependent_task, class_name: 'Task'
  belongs_to :resolved_task, class_name: 'Task'
end
