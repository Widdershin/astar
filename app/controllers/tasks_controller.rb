class TasksController < ApplicationController
  include TasksHelper

  def index
  end

  def show
  end

  def edit
  end

  def update
    task.update!(task_params)

    redirect_to(task)
  end

  def create
    task = Task.create!(task_params)

    redirect_to(task)
  end

  def complete
    task.update!(:completed => !task.completed)

    redirect_back(fallback_location: task_path(task))
  end

  def search
    query = "%#{params[:q]}%"
    name = Task.arel_table[:name]
    description = Task.arel_table[:description]

    tasks = Task.where(name.matches(query)).or(Task.where(description.matches(query)))

    render json: tasks.map { |task| {html: render_to_string(task), json: render_to_string(json: task)} }
  end

  private

  def task_params
    params.require(:task).permit(:name, :description, :completed, :archived)
  end
end
