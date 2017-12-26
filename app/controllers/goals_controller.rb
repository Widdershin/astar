class GoalsController < ApplicationController
  def create
    goal = project.goals.create!(:task_id => params[:goal][:task_id])

    render json: goal
  end

  private

  def project
    @project ||= Project.find(params[:project_id])
  end
end
