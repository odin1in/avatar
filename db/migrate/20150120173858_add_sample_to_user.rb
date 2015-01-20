class AddSampleToUser < ActiveRecord::Migration
  def change
    add_column :users, :sample, :text
    add_column :users, :introduce, :text
  end
end
