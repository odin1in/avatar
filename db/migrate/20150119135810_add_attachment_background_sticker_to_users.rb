class AddAttachmentBackgroundStickerToUsers < ActiveRecord::Migration
  def self.up
    change_table :users do |t|
      t.attachment :background
      t.attachment :sticker
    end
  end

  def self.down
    remove_attachment :users, :background
    remove_attachment :users, :sticker
  end
end
