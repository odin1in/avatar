class CreateBackgrounds < ActiveRecord::Migration
  def change
    create_table :backgrounds do |t|
      t.string :title
      t.integer :status

      t.timestamps null: false
    end
    add_index :backgrounds, :status
  end
end
