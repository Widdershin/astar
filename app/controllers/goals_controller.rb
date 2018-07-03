class GoalsController < ApplicationController
  def create
    goal = project.goals.create!(goal_params)

    redirect_to project
  end

  def graph
    render json: goal.tasks.map(&:graph).reduce(&:merge)
  end

  private

  def goal_params
    params.require(:goal).permit(:name)
  end

  def goal
    @goal ||= Goal.find(params[:goal_id])
  end

  def project
    @project ||= Project.find(params[:project_id])
  end
end
