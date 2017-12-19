Rails.application.routes.draw do
  resources :goals
  get 'dependencies/create'

  root 'tasks#index'
  get '/tasks/search', to: 'tasks#search'
  post '/tasks/:id/complete', to: 'tasks#complete', as: 'complete_task'
  resources :tasks
  resource :dependencies
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
