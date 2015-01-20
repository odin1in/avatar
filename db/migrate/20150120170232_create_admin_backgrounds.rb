class CreateAdminBackgrounds < ActiveRecord::Migration
  def change
    create_table :admin_backgrounds do |t|
      t.string :title
      t.integer :status

      t.timestamps null: false
    end
    add_index :admin_backgrounds, :status
  end
end
