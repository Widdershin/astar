Rails.application.routes.draw do
  resources :projects do
    resources :goals
  end
  devise_for :users
  root to: "projects#index"
  get 'dependencies/create'

  get '/tasks/search', to: 'tasks#search'
  post '/tasks/:id/complete', to: 'tasks#complete', as: 'complete_task'
  resources :tasks
  resource :dependencies
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
