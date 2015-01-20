# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/

$ ->
  $('.carousel').carousel()

$(document).on "click", ".showModel", ->
    $('#myModalIntroduce').modal()

$(document).on "click", ".random_image", ->
  background = gon.backgrounds[Math.floor(Math.random()*gon.backgrounds.length)]
  $("#backgroundImg").attr("src", background)