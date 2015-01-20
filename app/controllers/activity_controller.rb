class ActivityController < ApplicationController
  before_action :set_user

  def show
    gon.backgrounds = ["CYCU1.jpg",
                       "CYCU2.jpg",
                       "CYCU3.JPG",
                       "CYCU4.JPG",
                       "CYCU5.JPG",
                       "CYCU6.JPG",
                       "CYCU7.JPG"]
  end

  private
    def set_user
      @user = User.find(params[:id])
    end
end
