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
  has_many :requirements
  has_many :goals, through: :requirements

  has_many :dependencies, :foreign_key => :resolved_task_id
  has_many :dependents, class_name: 'Dependency', :foreign_key => :dependent_task_id

  has_many :dependency_tasks, :through => :dependencies, :source => :dependent_task
  has_many :dependent_tasks, :through => :dependents, :source => :resolved_task

  scope :complete, -> { where(:completed => true) }
  scope :incomplete, -> { where(:completed => false) }

  scope :active, -> { incomplete.where(:archived => false) }

  def next_task
    # find the leaf node of the dependencies
    dependency_tasks.active.find_yield { |task| task.next_task } || self
  end

  def next_tasks
    # find the leaf node of the dependencies
    result = dependency_tasks.active.flat_map { |task| task.next_tasks } || self

    if result.length > 0
      result
    else
      [self]
    end
  end

  def as_json(*args)
    super(*args).merge({dependency_count: dependency_count})
  end

  def graph
    {
      :nodes => nodes,
      :edges => edges
    }
  end

  def edges
    [
      dependencies.map { |d| { from: d.dependent_task_id, to: d.resolved_task_id } },
      dependency_tasks.map(&:edges),
    ].flatten.uniq
  end

  def nodes
    if dependency_count == 0
      [self]
    end

    ([self] + dependency_tasks.flat_map(&:nodes)).uniq
  end

  def dependency_count
    if dependency_tasks.incomplete.empty?
      0
    else
      1 + dependency_tasks.incomplete.sum(&:dependency_count)
    end
  end
end
