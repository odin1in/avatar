class WelcomeController < ApplicationController
  def index
    gon.backgrounds = ["CYCU1.jpg",
                       "CYCU2.jpg",
                       "CYCU3.JPG",
                       "CYCU4.JPG",
                       "CYCU5.JPG",
                       "CYCU6.JPG",
                       "CYCU7.JPG"]
  end

  def index2

  end
end
