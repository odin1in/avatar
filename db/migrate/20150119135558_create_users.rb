class CreateUsers < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string :sticker
      t.string :background
      t.integer :status, null: false, default: 0

      t.timestamps null: false
    end
    add_index :users, :status
  end
end
