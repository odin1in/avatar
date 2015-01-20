json.array!(@backgrounds) do |background|
  json.extract! background, :id, :title, :status
  json.url background_url(background, format: :json)
end
