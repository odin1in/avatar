class Image < ActiveRecord::Base

  before_validation :set_image

  has_attached_file :image, styles: { thumb: "x100>" }
  validates_attachment :image, presence: true, content_type: { content_type: ["image/jpeg", "image/jpg"] }
  # validates_attachment_content_type :avatar, :content_type => /\Aimage\/.*\Z/
  attr_accessor :image_json
  def set_image
    StringIO.open(Base64.decode64(image_json)) do |data|
      data.class.class_eval { attr_accessor :original_filename, :content_type }
      data.original_filename = "file.jpg"
      data.content_type = "image/jpeg"
      self.image = data
    end
  end
end
