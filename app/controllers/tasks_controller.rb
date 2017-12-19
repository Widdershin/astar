class TasksController < ApplicationController
  include TasksHelper

  def index
  end

  def show
  end

  def create
    task = Task.create!(task_params)

    redirect_to(task)
  end

  private

  def task_params
    params.require(:task).permit(:name, :description)
  end
end
