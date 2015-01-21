class ActivityController < ApplicationController
  before_action :set_user

  def show
    @no_panel = true
    @backgrounds = current_user.backgrounds.map{|b| b.image.url}
    gon.backgrounds = @backgrounds
  end

  private
    def set_user
      @user = User.find(params[:id])
    end
end
