class AddUserIdToBackground < ActiveRecord::Migration
  def change
    add_column :backgrounds, :user_id, :integer
    add_index :backgrounds, :user_id
  end
end
