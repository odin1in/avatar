# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://coffeescript.org/
$(".activity.show").ready ->
  $('#myModalIntroduce').modal('show')
$(document).on 'click', '.show-examples', ->
  $('#myModalIntroduce').modal('hide')
  $('#myModalSample').modal('show')