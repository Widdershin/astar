module TasksHelper
  def task
    @task ||= Task.find(params[:id])
  end
end
