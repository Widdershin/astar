class GoalsController < ApplicationController
  def create
    Goal.create!(:task_id => params[:task_id])

    redirect_to tasks_path
  end
end
