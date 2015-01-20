class ActivityController < ApplicationController
  before_action :set_user

  def show
    gon.backgrounds = ["/background/CYCU1.jpg",
                       "/background/CYCU2.jpg",
                       "/background/CYCU3.JPG",
                       "/background/CYCU4.JPG",
                       "/background/CYCU5.JPG",
                       "/background/CYCU6.JPG",
                       "/background/CYCU7.JPG"]
  end

  private
    def set_user
      @user = User.find(params[:id])
    end
end
