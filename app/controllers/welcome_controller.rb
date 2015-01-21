class WelcomeController < ApplicationController
  def index

    redirect_to backgrounds_path and return if user_signed_in?

    render layout: false
  end

  def index2

  end
end
