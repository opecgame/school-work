(function ($) {

    var memoryGame = {};
    memoryGame.savingObject = {};

    memoryGame.savingObject.pack = [];

    memoryGame.savingObject.removedCards = [];

    memoryGame.savingObject.currentElapsedTime = 0;
    memoryGame.savingObject.score = 0;

    memoryGame.pack = [
        'image1', 'image1',
        'image2', 'image2',
        'image3', 'image3',
        'image4', 'image4',
        'image5', 'image5',
        'image6', 'image6',
        'image7', 'image7',
        'image8', 'image8',
        'image9', 'image9',
        'image10', 'image10',
    ];

    function shuffle() {
        return 0.5 - Math.random();
    }

    function selectCard() {
        if ($(".card-flipped").size() > 1) {
            return;
        }
        $(this).addClass("card-flipped");
        if ($(".card-flipped").size() === 2) {
            setTimeout(checkPattern, 500);
        }
    }

    function isMatchPattern() {
        var cards = $(".card-flipped");
        var pattern = $(cards[0]).data("pattern");
        var anotherPattern = $(cards[1]).data("pattern");
        return (pattern === anotherPattern);
    }

    function checkPattern() {
        if (isMatchPattern()) {
            let cards = $(".card-flipped")
            let a = $(cards[0]).data("pattern");
            Swal.fire({
                icon: 'question',
                title: 'รูปภาพที่เลือกคือภาษาท่าใด',
                // html: '<div class="face back image4"></div>',
                input: 'text',
                inputAttributes: {
                    autocapitalize: 'off'
                },
                showCancelButton: false,
                confirmButtonText: 'ยืนยันคำตอบ',
                showloaderOnConfirm: true,
                allowOutsideClick: false
            }).then((result) => {
                if (result.value.match(/superidol/)) {
                    Swal.fire({
                        imageUrl: 'https://i.kym-cdn.com/entries/icons/original/000/027/195/cover10.jpg',
                        imageWidth: 400,
                        imageHeight: 200,
                    })
                    memoryGame.savingObject.score += 15
                    $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
                    $(".card-removed").bind("transitionend", removeTookCards);
                    playAudio("mp3/getscore.mp3")
                    return
                }

                let settings = {
                    "url": "/apiV1/checkAns",
                    "method": "post",
                    "timeout": 0,
                    "async": true,
                    "crossDomain": true,
                    "headers": {
                        "Content-Type": "application/json",
                    },
                    "data": JSON.stringify({
                        "answers": result.value,
                        "pattern": a
                    }),
                };
                $.ajax(settings).done(function (response) {
                    if (response.status == true) {
                        memoryGame.savingObject.score += 2
                        $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
                        $(".card-removed").bind("transitionend", removeTookCards);
                        playAudio("mp3/getscore.mp3")
                        document.getElementById("score").innerHTML = `${memoryGame.savingObject.score} คะแนน`
                        return Swal.fire({
                            "icon": 'success',
                            "title": "ถูกต้อง",
                            "text": response.msg,
                        })
                    } else {
                        memoryGame.savingObject.score += 1
                        $(".card-flipped").removeClass("card-flipped").addClass("card-removed");
                        $(".card-removed").bind("transitionend", removeTookCards);
                        playAudio("mp3/getscore.mp3");
                        document.getElementById("score").innerHTML = `${memoryGame.savingObject.score} คะแนน`
                        return Swal.fire({
                            "icon": 'error',
                            "title": "ผิด",
                            "text": response.msg
                        })
                    }

                });
            })

        } else {
            $(".card-flipped").removeClass('card-flipped');
        }
    }

    function playAudio(sAudio) {
        var audioElement = document.getElementById('audioEngine');
        if (audioElement !== null) {
            audioElement.src = sAudio;
            audioElement.play();
        }
    }


    function removeTookCards() {
        $(".card-removed").each(function () {
            memoryGame.savingObject.removedCards.push($(this).data("card-index"));
            $(this).remove();
        });
        if ($(".card").length === 0) {
            gameover();
        }
    }

    function saveSavingObject() {
        localStorage["savingObject"] = JSON.stringify(memoryGame.savingObject);
    }


    function gameover() {
        clearInterval(memoryGame.timer);
        saveSavingObject();
        data = memoryGame.savingObject
        let settings = {
            "url": "/apiV1/postScore",
            "method": "post",
            "timeout": 0,
            "async": true,
            "crossDomain": true,
            "headers": {
                "Content-Type": "application/json",
            },
            "data": JSON.stringify({
                "score": memoryGame.savingObject.score,
                "time": memoryGame.elapsedTime
            }),
        };
        $.ajax(settings).done(function (response) {
            Swal.fire({
                "icon": 'success',
                "title": "ยินดีด้วย !",
                "html": `คุณใช้เวลาไป ${format(memoryGame.elapsedTime)} และได้คะแนน ${memoryGame.savingObject.score}`,
                "confirmButtonColor": '#FF3B44',
                "confirmButtonText": 'ไปดูตารางคะแนนกันเถอะ !',
                allowOutsideClick: false
            }).then(() => {
                localStorage.removeItem("savingObject");
                window.location.replace(`/leaderboard`);
            })

        });
        return;
    }

    function timeout() {
        clearInterval(memoryGame.timer);
        data = memoryGame.savingObject
        console.log(data)
        return Swal.fire({
            "icon": 'warning',
            "title": "หมดเวลาแล้ว",
            "html": "เธอคงต้องไป แต่สิ่งที่เหลือในใจยังอยู่ คือความคิดถึง ที่เธอนั้นไม่รู้ พูดไม่ได้ ทำได้เพียงแค่คิดถึงเธอ",
            "confirmButtonColor": '#FF3B44',
            "confirmButtonText": 'ไปดูตารางคะแนนกันเถอะ !',
            allowOutsideClick: false
        }).then(() => window.location.replace(`/leaderboard`))
    }

    function countTimer() {
        memoryGame.elapsedTime++;
        memoryGame.savingObject.currentElapsedTime = memoryGame.elapsedTime;
        document.getElementById("score").innerHTML = `${memoryGame.savingObject.score} คะแนน`
        document.getElementById("time").innerHTML = `${format(300 - memoryGame.elapsedTime)}`
        if (memoryGame.elapsedTime == 300) return timeout();
        saveSavingObject();
    }


    $(document).ready(function () {
        memoryGame.elapsedTime = 0;
        memoryGame.timer = setInterval(countTimer, 1000);
        memoryGame.pack.sort(shuffle);
        memoryGame.elapsedTime = 0;
        memoryGame.savingObject.pack = memoryGame.pack.slice();
        for (var i = 0; i < memoryGame.pack.length - 1; i++) {
            $(".card:first-child").clone().appendTo("#cards");
        }

        $("#cards").children().each(function (index) {
            var x = ($(this).width() + 20) * (index % 4);
            var y = ($(this).height() + 20) * Math.floor(index / 4);
            $(this).css("transform", "translateX(" + x + "px) translateY(" + y + "px)");
            var pattern = memoryGame.pack.pop();
            $(this).find(".back").addClass(pattern);
            $(this).attr("data-pattern", pattern);
            $(this).attr("data-card-index", index);
            $(this).click(selectCard);
        });
    });
    if ($(window).width() > 1024 && $(window).height() > 1024) document.body.style.zoom = "50%";

    function format(time) {
        try {
            let hrs = ~~(time / 3600);
            let mins = ~~((time % 3600) / 60);
            let secs = ~~time % 60;
            let ret = "";
            if (hrs > 0) {
                ret += "" + hrs + ":" + (mins < 10 ? "0" : "");
            }
            ret += "" + mins + ":" + (secs < 10 ? "0" : "");
            ret += "" + secs;
            return `${ret}`;
        } catch (e) {
            console.log(String(e.stack).bgRed)
        }
    }
})(jQuery);