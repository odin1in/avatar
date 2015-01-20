json.array!(@users) do |user|
  json.extract! user, :id, :email, :sticker, :background, :status
  json.url user_url(user, format: :json)
end
