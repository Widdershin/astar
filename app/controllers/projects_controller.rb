class ProjectsController < ApplicationController
  include ProjectsHelper

  def index
  end

  def new
  end

  def create
    redirect_to current_user.projects.create!(project_params)
  end

  def show
  end

  private

  def project_params
    params.require(:project).permit(:name)
  end
end
