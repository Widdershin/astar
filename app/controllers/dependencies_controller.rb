class DependenciesController < ApplicationController
  def create
    dep_params = params.require(:dependency).permit(:dependent_task_id, :resolved_task_id)

    dependency = Dependency.create!(dep_params)

    head :ok
  end
end
