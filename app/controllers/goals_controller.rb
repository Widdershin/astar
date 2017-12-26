class GoalsController < ApplicationController
  def create
    goal = project.goals.create!(goal_params)

    redirect_to project
  end

  private

  def goal_params
    params.require(:goal).permit(:name)
  end

  def project
    @project ||= Project.find(params[:project_id])
  end
end
