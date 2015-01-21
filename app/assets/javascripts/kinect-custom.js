$(".activity.show").ready(function() {
  //設定串流解析度
  var streamImageWidth = 640;
  var streamImageHeight = 480;
  var streamImageResolution = streamImageWidth.toString() + "x" + streamImageHeight.toString();
  //偵測感應器-布林
  var isSensorConnected = false;
  //活躍使用者-物件
  var engagedUser = null;
  //手勢-物件
  var cursor = null;
  //使用者瀏覽器Canvas-物件
  var userViewerCanvasElement = null;
  //去背瀏覽器Canvas-物件
  var backgroundRemovalCanvasElement = null;
  //逾時計時-物件
  var delayedConfigTimeoutId = null;
  //自動隱藏面板計時-物件
  var hidePanelTimeoutId = null;
  //面板按鈕文字-字串
  var showPanelLabel = "更換背景";
  var hidePanelLabel = "隱藏面板";
  //預設圖片群組-整數
  var group = 1;
  //初始化感應器-物件
  var sensor = Kinect.sensor(Kinect.DEFAULT_SENSOR_NAME, function (sensorToConfig, isConnected) {
      if (isConnected) {
          sensorToConfig.getConfig(function (data) {
              var engagedUserId = findEngagedUser(data[Kinect.INTERACTION_STREAM_NAME].userStates);
              updateUserState(true, engagedUserId, sensorToConfig);
          });
      } else {
          updateUserState(false, engagedUser, sensorToConfig);
      }
  });
  //初始化介面感應器 - 物件
  var uiAdapter = KinectUI.createAdapter(sensor);
  uiAdapter.promoteButtons();
  cursor = uiAdapter.createDefaultCursor();
  //套用使用者瀏覽器Canvas
  userViewerCanvasElement = document.getElementById("userViewerCanvas");
  //套用去背瀏覽器Canvas
  backgroundRemovalCanvasElement = document.getElementById("backgroundRemovalCanvas");
  //開始介面感應器串流
  uiAdapter.bindStreamToCanvas(Kinect.USERVIEWER_STREAM_NAME, userViewerCanvasElement);
  uiAdapter.bindStreamToCanvas(Kinect.BACKGROUNDREMOVAL_STREAM_NAME, backgroundRemovalCanvasElement);
  //初始化感應器處理事件
  sensor.addEventHandler(function (event) {
      switch (event.category) {
          case Kinect.USERSTATE_EVENT_CATEGORY:
              switch (event.eventType) {
                  case Kinect.USERSTATESCHANGED_EVENT_TYPE:
                      onUserStatesChanged(event.userStates);
                      break;
              }
              break;
      }
  });
  //隱藏背景面板
  setChoosePanelVisibility(false);
  //錯誤日誌 - 函式
  function configError(statusText, errorData) {
      console.log((errorData != null) ? JSON.stringify(errorData) : statusText);
  }
  //處理空物件 - 函式
  function isEmptyObject(obj) {
      if (obj == null) {
          return true;
      }
      var numProperties = 0;
      for (var prop in obj) {
          if (obj.hasOwnProperty(prop)) {
              ++numProperties;
          }
      }
      return numProperties <= 0;
  }
  //手勢可見性 - 函式
  function setCursorVisibility(isVisible) {
      if (cursor == null) {
          return;
      }
      if (isVisible) {
          cursor.show();
      } else {
          cursor.hide();
      }
  }
  //畫布可見性 - 函式
  function setCanvasVisibility(canvasElement, isVisible) {
      if (canvasElement == null) {
          return;
      }
      var canvasQuery = $(canvasElement);
      if (isVisible) {
          if (!canvasQuery.hasClass("showing")) {
              var canvasContext = canvasElement.getContext("2d");
              canvasContext.clearRect(0, 0, streamImageWidth, streamImageHeight);
          }
          canvasQuery.addClass("showing");
      } else {
          canvasQuery.removeClass("showing");
      }
  }
  //背景面板可見性 - 函式
  function setChoosePanelVisibility(isVisible) {
      var togglePanelElement = document.getElementById("togglePanelButton");
      var spanQuery = $("#toggleText");

      if (isVisible) {
          $("#choosePanel").addClass("showing");
          spanQuery.html(hidePanelLabel);
      } else {
          $("#choosePanel").removeClass("showing");
          spanQuery.html(showPanelLabel);
      }
  }
  //偵測背景面板可見性CSS樣式 - 函式
  function isChoosePanelVisible() {
      return $("#choosePanel").hasClass("showing");
  }
  //自動隱藏面板 - 函式
  function resetHidePanelTimeout() {
      if (hidePanelTimeoutId != null) {
          clearTimeout(hidePanelTimeoutId);
          hidePanelTimeoutId = null;
      }
      if (!isSensorConnected || (engagedUser == null)) {
          hidePanelTimeoutId = setTimeout(function () {
              setChoosePanelVisibility(false);
              hidePanelTimeoutId = null;
          }, 10000);
      }
  }
  //更新使用者狀態 - 函式
  function updateUserState(newIsSensorConnected, newEngagedUser, sensorToConfig) {
      var hasEngagedUser = engagedUser != null;
      var newHasEngagedUser = newEngagedUser != null;
      if (delayedConfigTimeoutId != null) {
          clearTimeout(delayedConfigTimeoutId);
          delayedConfigTimeoutId = null;
      }
      if ((isSensorConnected != newIsSensorConnected) || (engagedUser != newEngagedUser)) {
          if (newIsSensorConnected) {
              var immediateConfig = {};
              var delayedConfig = {};
              immediateConfig[Kinect.INTERACTION_STREAM_NAME] = { "enabled": true };
              immediateConfig[Kinect.USERVIEWER_STREAM_NAME] = { "resolution": streamImageResolution };
              immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME] = { "resolution": streamImageResolution };
              setCursorVisibility(newHasEngagedUser);
              setCanvasVisibility(userViewerCanvasElement, !newHasEngagedUser);
              setCanvasVisibility(backgroundRemovalCanvasElement, newHasEngagedUser);
              if (newHasEngagedUser) {
                  immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME].enabled = true;
                  immediateConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME].trackingId = newEngagedUser;
                  delayedConfig[Kinect.USERVIEWER_STREAM_NAME] = { "enabled": false };
              } else {
                  immediateConfig[Kinect.USERVIEWER_STREAM_NAME].enabled = true;
                  if (hasEngagedUser) {
                      delayedConfig[Kinect.BACKGROUNDREMOVAL_STREAM_NAME] = { "enabled": false };
                  }
              }
              sensorToConfig.postConfig(immediateConfig, configError);
              if (!isEmptyObject(delayedConfig)) {
                  delayedConfigTimeoutId = setTimeout(function () {
                      sensorToConfig.postConfig(delayedConfig, configError);
                      delayedConfigTimeoutId = null;
                  }, 2000);
              }
          } else {
              setCursorVisibility(false);
              setCanvasVisibility(userViewerCanvasElement, false);
              setCanvasVisibility(backgroundRemovalCanvasElement, false);
          }
      }
      isSensorConnected = newIsSensorConnected;
      engagedUser = newEngagedUser;
      resetHidePanelTimeout();
  }
  //搜尋活躍使用者 - 函式
  function findEngagedUser(userStates) {
      var engagedUserId = null;
      for (var i = 0; i < userStates.length; ++i) {
          var entry = userStates[i];
          if (entry.userState == "engaged") {
              engagedUserId = entry.id;
              break;
          }
      }
      return engagedUserId;
  }
  //更改使用者狀態 - 函式
  function onUserStatesChanged(newUserStates) {
      var newEngagedUser = findEngagedUser(newUserStates);
      updateUserState(isSensorConnected, newEngagedUser, sensor);
  }
  //載入圖片 - 函式
  function setImage(group) {
      $(".imgButton").fadeOut(100, function() {
          var i;
          for(i = 1; i <= 5; i++){
              $(".img" + i + " img").attr("src", "img/CYCU" + (group+i) + ".jpg");
          }
          $(".imgButton").fadeIn(100);
      });
  }
  //背景面板按鈕點擊 - jquery函式
  $("#togglePanelButton").click(function (event) {
      if (isChoosePanelVisible()) {
          setChoosePanelVisibility(false);
      } else {
          setChoosePanelVisibility(true);
          resetHidePanelTimeout();
      }
  });
  //圖片按鈕點擊 - jquery函式
  $(".imgButton").click(function (event) {
      var imgElement = $("img", event.currentTarget)[0];
      document.getElementById("backgroundImg").src = imgElement.src;
      resetHidePanelTimeout();
  });
  //螢幕擷取按鈕點擊 - jquery函式
  $("#printScreenButton").click(function() {
    // console.log("ggyy")
      //隱藏背景面板
      setChoosePanelVisibility(false);
      //清除背景面板計時器
      hidePanelTimeoutId = null;
      //遮色片淡入
      $("#opaqueTable").fadeIn();
      //控制按鈕區塊淡出
      $(".commandButtonContainer").fadeOut();
      //倒數計時數 - 整數
      var i = 5;
      //初始化倒數計時文字
      $('#counter').html(i);
      //初始化倒數計時器
      var counter = setInterval(function() {
          i--;
          $('#counter').html(i);
          if(i < 1) {
              //清除倒數計時器
              clearInterval(counter);
              //移除倒數計時器區塊
              $('#counter').remove();
              //遮色片透明度漸變動畫
              $("#opaqueTable").animate({opacity:'0.8'}, 300, function() {
                  //將背景容器之html內容轉換為canvas
                  html2canvas($("#backgroundContainer"), {
                      //渲染函式
                      onrendered: function(canvas) {
                          //canvas轉換為jpeg資料
                          var dataURL = canvas.toDataURL("image/jpeg");
                          console.log(dataURL)
                          //設定結果圖片為jpeg資料來源
                          $("#resultImg").attr("src", dataURL);
                          //設定背景容器為jpeg資料來源
                          $("#backgroundContainer").html(canvas);
                          //遮色片透明度漸變動畫
                          $("#opaqueTable").animate({opacity:'0.2'}, 300, function() {
                              //讀取圖示動畫淡入
                              $("#loadImg").fadeIn();
                              // $.ajax({
                              //   type: "post",
                              //   url: '/images',
                              //   dataType: "json",
                              //   data: {
                              //     image_json: dataURL
                              //   },
                              //   success: function(response){
                              //     console.log(response)
                              //   }
                              // })
                              //Ajax函式開始，虛擬機佈署好Server端檔案後填入網址即可取消註解
                              $.ajax({
                                  type: "POST",
                                  url: "http://54.65.237.102/get.php",
                                  dataType: 'html',
                                  data: {
                                      img: dataURL
                                  },
                                  success: function(response) {
                                      var remoteDataURL = "http://54.65.237.102/index.php?img=" + response;
                                      // console.log(remoteDataURL)
                                      // $("#qrcodeContainer").qrcode({
                                      //     "render": "image",
                                      //     "background": "white",
                                      //     "text": remoteDataURL
                                      // });
                                      $("#opaqueTable").fadeOut(1000);
                                      $("#uiContainer").fadeOut(1000, function() {
                                          $("#resultImg").fadeIn(800);
                                          $(".restoreButtonContainer").fadeIn(800);
                                          $(".restoreButtonContainerFromPage").fadeIn(800);
                                          $("#qrcodeContainer").fadeIn(800);
                                          $("#loadImg").fadeOut();
                                      });
                                  }
                              });
                              //預覽函式開始，Ajax函式取消註解後可移除此段

                              //qrcode容器初始化內容
                              // $("#qrcodeContainer").qrcode({
                              //     "render": "image",
                              //     "background": "white",
                              //     "text": "預覽函式"
                              // });
                              //遮色片淡出
                              $("#opaqueTable").fadeOut(1000);
                              //介面容器淡出
                              $("#uiContainer").fadeOut(1000, function() {
                                  //結果圖片淡入
                                  $("#result_container").fadeIn(800);
                                  //重新開始容器淡入
                                  $(".restoreButtonContainer").fadeIn(800);
                                  $(".restoreButtonContainerFromPage").fadeIn(800);
                                  //qrcode容器淡入
                                  $("#qrcodeContainer").fadeIn(800);
                                  //讀取圖示動畫淡出
                                  $("#loadImg").fadeOut();
                              });
                              //預覽函式結束
                          });
                      }
                  });
              });
          }
      }, 1000);//以1000毫秒(1秒)為單位做為倒數計時週期
  });
  //重新開始按鈕點擊 - jquery函式
  $("#restoreButton").click(function() {
      location.reload();
  });

  $("#restoreButtonFrompage").click(function() {
      location.href="https://www.facebook.com/pages/%E5%A4%A7%E9%A0%AD%E8%B2%BC%E6%94%B6%E9%9B%86%E6%A9%9F/1553535211560180";
  });
  //上一圖片群組按鈕點擊 - jquery函式
  $(".prev").click(function() {
      if(group == 1){
          setImage(10);
          group = 3;
      }
      else if(group == 2){
          setImage(0);
          group = 1;
      }
      else if(group == 3){
          setImage(5);
          group = 2;
      }
  });
  //下一圖片群組按鈕點擊 - jquery函式
  $(".next").click(function() {
      if(group == 1){
          setImage(5);
          group = 2;
      }
      else if(group == 2){
          setImage(10);
          group = 3;
      }
      else if(group == 3){
          setImage(0);
          group = 1;
      }
  });
  });