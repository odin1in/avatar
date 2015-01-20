require 'test_helper'

class Admin::BackgroundsControllerTest < ActionController::TestCase
  setup do
    @admin_background = admin_backgrounds(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:admin_backgrounds)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create admin_background" do
    assert_difference('Admin::Background.count') do
      post :create, admin_background: { status: @admin_background.status, title: @admin_background.title }
    end

    assert_redirected_to admin_background_path(assigns(:admin_background))
  end

  test "should show admin_background" do
    get :show, id: @admin_background
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @admin_background
    assert_response :success
  end

  test "should update admin_background" do
    patch :update, id: @admin_background, admin_background: { status: @admin_background.status, title: @admin_background.title }
    assert_redirected_to admin_background_path(assigns(:admin_background))
  end

  test "should destroy admin_background" do
    assert_difference('Admin::Background.count', -1) do
      delete :destroy, id: @admin_background
    end

    assert_redirected_to admin_backgrounds_path
  end
end
