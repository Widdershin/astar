module Enumerable
  def find_yield(fallback=nil) #:yield:
    each do |member|
      result = yield(member)
      return result if result
    end
    fallback
  end
end

class Task < ApplicationRecord
  has_many :dependencies, :foreign_key => :resolved_task_id
  has_many :dependents, class_name: 'Dependency', :foreign_key => :dependent_task_id

  has_many :dependency_tasks, :through => :dependencies, :source => :dependent_task
  has_many :dependent_tasks, :through => :dependents, :source => :resolved_task

  scope :complete, -> { where(:completed => true) }
  scope :incomplete, -> { where(:completed => false) }

  def next_task
    # find the leaf node of the dependencies
    dependency_tasks.incomplete.find_yield { |task| task.next_task } || self
  end
end
