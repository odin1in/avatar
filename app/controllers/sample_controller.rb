class SampleController < ApplicationController
  before_action :set_user

  def edit
  end

  def update
    if @admin_user.update(admin_user_params)
      redirect_to sample_edit_path, notice: 'Sample was successfully updated.'
    else
      render :edit
    end
  end

  private
    def set_user
      @admin_user = Admin::User.find(current_user.id)
    end

    def admin_user_params
      params.require(:admin_user).permit(:sample)
    end
end
