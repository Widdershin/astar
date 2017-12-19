Rails.application.routes.draw do
  get 'dependencies/create'

  root 'tasks#index'
  get '/tasks/search', to: 'tasks#search'
  resources :tasks
  resource :dependencies
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
