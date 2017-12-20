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

  def next_tasks
    # find the leaf node of the dependencies
    result = dependency_tasks.incomplete.flat_map { |task| task.next_tasks } || self

    if result.length > 0
      result
    else
      [self]
    end
  end

  def dependency_count
    if dependency_tasks.incomplete.empty?
      0
    else
      1 + dependency_tasks.incomplete.sum(&:dependency_count)
    end
  end
end
