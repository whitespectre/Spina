Spina::Engine.routes.draw do
  # Backend
  namespace :admin, path: Spina.config.backend_path do
    root to: "pages#index"

    unless Spina.config.disable_account_edit
      resource :account, only: %i[edit update] do
        get :style, :analytics, :social, on: :member
      end
    end

    get "/settings/:plugin", to: "settings#edit", as: :edit_settings
    patch "/settings/:plugin", to: "settings#update", as: :settings

    unless Spina.config.current_user_method
      resources :users

      # Sessions
      resources :sessions
      get "login" => "sessions#new"
      get "logout" => "sessions#destroy"

      # Passwords
      resources :password_resets
    end

    # Media library
    get 'media_library' => 'images#index', as: "media_library"

    resources :pages do
      get :children, on: :member
      post :sort, on: :collection
    end

    resources :resources, only: [:show, :edit, :update]

    resources :navigations do
      post :sort, on: :member
    end

    resources :attachments do
      collection do
        get 'select/:page_part_id' => 'attachments#select', as: :select
        post 'insert/:page_part_id' => 'attachments#insert', as: :insert
        get 'select_collection/:page_part_id' => 'attachments#select_collection', as: :select_collection
        post 'insert_collection/:page_part_id' => 'attachments#insert_collection', as: :insert_collection
      end
    end

    resources :media_folders

    resources :images do
      collection do
        get 'folder/:id' => 'images#media_folder', as: :media_folder
        put 'folder/:id' => 'images#add_to_media_folder', as: :add_to_media_folder
      end
    end
    get :media_picker, to: 'media_picker#show'
    post :media_picker, to: 'media_picker#select'
  end

  unless Spina.config.disable_frontend_routes
    # Sitemap
    resource :sitemap

    # Robots.txt
    get '/robots', to: 'pages#robots', constraints: { format: 'txt' }

    # Frontend
    root to: "pages#homepage"

    # Pages
    get '/:locale/*id' => 'pages#show', constraints: {locale: /#{Spina.config.locales.join('|')}/ }
    get '/:locale/' => 'pages#homepage', constraints: {locale: /#{Spina.config.locales.join('|')}/ }
    get '/*id' => 'pages#show', as: "page", controller: 'pages', constraints: lambda { |request|
      (!(Rails.env.development? && request.env['PATH_INFO'].starts_with?('/rails/') || request.env['PATH_INFO'].starts_with?("/#{Spina.config.backend_path}") || request.env['PATH_INFO'].starts_with?('/attachments/'))) && request.path.exclude?("rails/active_storage")
    }
  end
end
