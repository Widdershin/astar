class RequirementsController < ApplicationController
  def create
    goal.requirements.create!(requirement_params)
  end

  private

  def goal
    @goal ||= Goal.find(params[:goal_id])
  end

  def requirement_params
    params.require(:requirement).permit(:task_id)
  end
end
