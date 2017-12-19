class Task < ApplicationRecord
  has_many :dependencies, :foreign_key => :resolved_task_id
  has_many :dependents, class_name: 'Dependency', :foreign_key => :dependent_task_id

  has_many :dependency_tasks, :through => :dependencies, :source => :dependent_task
  has_many :dependent_tasks, :through => :dependents, :source => :resolved_task
end
