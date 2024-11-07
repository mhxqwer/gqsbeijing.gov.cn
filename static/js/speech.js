(function () {

    let btnStatus = "UNDEFINED"; // "UNDEFINED" "CONNECTING" "OPEN" "CLOSING" "CLOSED"

    const btnControl = document.getElementById("btn_control");

    //根据网站搜索框id替换该值
    var inputId = '#zdbinput'
	//请求后台接口参数,需要修改为本站地址
     var authUrl = 'https://zdb.beijing.gov.cn/so/voice/auth/'
    
	const recorder = new RecorderManager("/bjzdxmb/xhtml/images/speech");
    recorder.onStart = () => {
        changeBtnStatus("OPEN");
    }
    let iatWS;
    let resultText = "";
    let resultTextTemp = "";
    let countdownInterval;

    /**
     * 获取websocket url
     * 该接口需要后端提供，这里为了方便前端处理
     */
    function getWebSocketUrl() {
        var resData = ''
        $.ajax({
            
            url: authUrl,
            type: 'GET',
            async: false, // 设置为同步请求
            success: function (data) {
                // 请求成功时的回调函数
                resData = data
            },
            error: function (xhr, status, error) {
                // 请求失败时的回调函数
                console.error('error:', status, error);
            }
        });

        return resData.data;

    }

    function toBase64(buffer) {
        var binary = "";
        var bytes = new Uint8Array(buffer);
        var len = bytes.byteLength;
        for (var i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function resultDataTxt() {
        $(".init-txt .voice-tips-time").text("(" + 10 + "s)")
        // 录音结束判断是否有语音录入
        var resTxt = $("#voice-search-result").text().length;
        if (resTxt > 0) {
            //存在文字
            $(".init-txt").css("display", "block")
            $(".init-txt .voice-tips-time").text("(" + 10 + "s)")
            var tt = $("#voice-search-result").text()

            $("#voice-search-result").text('');
            $(".voice-draw").css("display", "none")
            $(inputId).val()
            var qt = tt.replace(/,?，?。?？?/g, '')
            $(inputId).val(qt)

            //文字录入输入框后 触发搜索按钮点击事件
            //此处绑定为 搜索按钮 选择器
            var $dom = $(".search-all-btn")
            $dom.click()
        } else {
            // 不存在文字
            //初始化10S未监听到语音 (文本替换)
            $(".init-txt").css("display", "none")
            $(".noIdentify-txt").css("display", "block")
            //初始化10S未监听到语音 (按钮替换)
            $(".voice-button-gif").css("display", "none")
            $(".voice-button-png").css("display", "inline-block")
            $(inputId).val()
        }
    }

    function countdown() {
        let seconds = 10;
        countdownInterval = setInterval(() => {
            seconds = seconds - 1;
            //录音秒数展示
            $(".init-txt .voice-tips-time").text("(" + seconds + "s)")
            if (seconds <= 0) {
                clearInterval(countdownInterval);
                resultDataTxt()
                recorder.stop();
            } else {
                console.log("录音中" + seconds + 's')
            }
        }, 1000);
    }

    function changeBtnStatus(status) {
        btnStatus = status;
        if (status === "CONNECTING") {
            document.getElementById("voice-search-result").innerText = "";
            resultText = "";
            resultTextTemp = "";
        } else if (status === "OPEN") {
            countdown();
        } else if (status === "CLOSING") {
            console.log("关闭连接中")

        } else if (status === "CLOSED") {
            console.log("结束录音")
        }
    }

    function renderResult(resultData) {
        // 识别结束
        let jsonData = JSON.parse(resultData);
        if (jsonData.data && jsonData.data.result) {
            let data = jsonData.data.result;
            let str = "";
            let ws = data.ws;
            for (let i = 0; i < ws.length; i++) {
                str = str + ws[i].cw[0].w;
            }
            // 开启wpgs会有此字段(前提：在控制台开通动态修正功能)
            // 取值为 "apd"时表示该片结果是追加到前面的最终结果；取值为"rpl" 时表示替换前面的部分结果，替换范围为rg字段
            if (data.pgs) {
                if (data.pgs === "apd") {
                    // 将resultTextTemp同步给resultText
                    resultText = resultTextTemp;
                }
                // 将结果存储在resultTextTemp中
                resultTextTemp = resultText + str;
            } else {
                resultText = resultText + str;
            }
            if (resultTextTemp.length > 0 || resultText.length > 0) {
                $(".init-txt").css("display", "none")
            }
            document.getElementById("voice-search-result").innerText =
                resultTextTemp || resultText || "";
        }
        if (jsonData.code === 0 && jsonData.data.status === 2) {
            // 判断文字输入
            resultDataTxt()
            iatWS.close();
        }
        if (jsonData.code !== 0) {
            iatWS.close();
            console.error(jsonData);
        }
    }

    function connectWebSocket() {
        const websocket = getWebSocketUrl();
        if ("WebSocket" in window) {
            iatWS = new WebSocket(websocket.url);
        } else if ("MozWebSocket" in window) {
            iatWS = new MozWebSocket(websocket.url);
        } else {
            alert("浏览器不支持WebSocket");
            return;
        }
        changeBtnStatus("CONNECTING");
        iatWS.onopen = (e) => {
            // 开始录音
            recorder.start({
                sampleRate: 16000,
                frameSize: 1280,
            });
            var params = {
                common: {
                    app_id: websocket.appId,
                },
                business: {
                    language: "zh_cn",
                    domain: "iat",
                    accent: "mandarin",
                    vad_eos: 5000,
                    dwa: "wpgs",
                },
                data: {
                    status: 0,
                    format: "audio/L16;rate=16000",
                    encoding: "raw",
                },
            };
            iatWS.send(JSON.stringify(params));
        };
        iatWS.onmessage = (e) => {
            console.log("语音反馈", e.data)
            renderResult(e.data);
        };
        iatWS.onerror = (e) => {
            recorder.stop();
            changeBtnStatus("CLOSED");
        };
        iatWS.onclose = (e) => {
            recorder.stop();
            changeBtnStatus("CLOSED");
        };
    }

    recorder.onFrameRecorded = ({isLastFrame, frameBuffer}) => {
        if (iatWS.readyState === iatWS.OPEN) {
            iatWS.send(
                JSON.stringify({
                    data: {
                        status: isLastFrame ? 2 : 1,
                        format: "audio/L16;rate=16000",
                        encoding: "raw",
                        audio: toBase64(frameBuffer),
                    },
                })
            );
            if (isLastFrame) {
                changeBtnStatus("CLOSING");
            }
        }
    };
    recorder.onStop = () => {
        clearInterval(countdownInterval);
    };

    // html页面按钮点击开始进行语音录入
    $(".voiceBtn").click(function () {
        $(".voice-draw").css("display", "block")
        if (btnStatus === "UNDEFINED" || btnStatus === "CLOSED") {
            connectWebSocket();
        } else if (btnStatus === "CONNECTING" || btnStatus === "OPEN") {
            // 结束录音
            recorder.stop();
        }
    })

    // 重新开始进行语音录入
    $(".voice-button-png").click(function () {
        $(".init-txt").css("display", "block")
        $(".noIdentify-txt").css("display", "none")
        //初始化10S未监听到语音 (按钮替换)
        $(".voice-button-gif").css("display", "inline-block")
        $(".voice-button-png").css("display", "none")

        if (btnStatus === "UNDEFINED" || btnStatus === "CLOSED") {
            connectWebSocket();
        } else if (btnStatus === "CONNECTING" || btnStatus === "OPEN") {
            // 结束录音
            recorder.stop();
        }
    })

//     关闭弹窗按钮
    $(".voice-close").click(function () {
        recorder.stop();
        // 文本展示
        $(".init-txt").css("display", "block")
        $(".noIdentify-txt").css("display", "none")
        //(按钮替换)
        $(".voice-button-gif").css("display", "inline-block")
        $(".voice-button-png").css("display", "none")
        // 语音倒计时数字还原
        $(".init-txt .voice-tips-time").text("(10s)")
        // 弹框隐藏
        $(".voice-draw").css("display", "none")

    })

})();
