json.array!(@admin_backgrounds) do |admin_background|
  json.extract! admin_background, :id, :title, :status
  json.url admin_background_url(admin_background, format: :json)
end
