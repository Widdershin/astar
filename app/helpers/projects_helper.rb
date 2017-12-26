module ProjectsHelper
  def project
    @project ||= Project.find(params[:id])
  end
end
