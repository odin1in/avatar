class Admin::BackgroundsController < Admin::ApplicationController
  before_action :set_admin_background, only: [:show, :edit, :update, :destroy]

  # GET /admin/backgrounds
  # GET /admin/backgrounds.json
  def index
    @admin_backgrounds = current_user.backgrounds.all
  end

  # GET /admin/backgrounds/1
  # GET /admin/backgrounds/1.json
  def show
  end

  # GET /admin/backgrounds/new
  def new
    @admin_background = current_user.backgrounds.new
  end

  # GET /admin/backgrounds/1/edit
  def edit
  end

  # POST /admin/backgrounds
  # POST /admin/backgrounds.json
  def create
    @admin_background = current_user.backgrounds.new(admin_background_params)

    respond_to do |format|
      if @admin_background.save
        format.html { redirect_to [:admin, @admin_background], notice: 'Background was successfully created.' }
        format.json { render :show, status: :created, location: @admin_background }
      else
        format.html { render :new }
        format.json { render json: @admin_background.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /admin/backgrounds/1
  # PATCH/PUT /admin/backgrounds/1.json
  def update
    respond_to do |format|
      if @admin_background.update(admin_background_params)
        format.html { redirect_to [:admin, @admin_background], notice: 'Background was successfully updated.' }
        format.json { render :show, status: :ok, location: @admin_background }
      else
        format.html { render :edit }
        format.json { render json: @admin_background.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /admin/backgrounds/1
  # DELETE /admin/backgrounds/1.json
  def destroy
    @admin_background.destroy
    respond_to do |format|
      format.html { redirect_to admin_backgrounds_url, notice: 'Background was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_admin_background
      @admin_background = current_user.backgrounds.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def admin_background_params
      params.require(:background).permit(:title, :status, :image)
    end
end
