window.onload = function () {


    function $(selector) {
        return document.querySelector(selector);
    }

    var musicList = [];
    var currentIndex = 0;
    var audioObj = new Audio();
    audioObj.autoplay = true;

    getMusicList(function (list) {
        musicList = list;
        loadMusic(list[currentIndex]);
        getAllList(musicList);
    });

    audioObj.ontimeupdate = function () {
        $('.progress').style.width = (this.currentTime/this.duration)*80 + '%';
        var minute = Math.floor(this.currentTime/60) + '';
        var sec = Math.floor(this.currentTime%60) + '';
        minute= minute.length < 2 ? '0' + minute : minute;
        sec= sec.length < 2 ? '0' + sec : sec;
        currentTime =  minute +':' + sec;

        var minute1 = Math.floor(this.duration/60) + '';
        var sec1 = Math.floor(this.duration%60) + '';
        minute1 = minute1.length < 2 ? '0' + minute1 : minute;
        sec1 = sec1.length < 2 ? '0' + sec1 : sec1;
        duration = minute1 +':' + sec1;

        $('.time').innerText = currentTime + '/' + duration;
    };

    audioObj.onended = function () {
        currentIndex = (++currentIndex)%musicList.length;
        loadMusic(musicList[currentIndex]);
    };

    $('.ctr-btn .play').onclick = function () {
        if (audioObj.paused) {
            audioObj.play();
            this.querySelector('.fa').classList.remove('fa-play');
            this.querySelector('.fa').classList.add('fa-pause');
        }else {
            audioObj.pause();
            this.querySelector('.fa').classList.remove('fa-pause');
            this.querySelector('.fa').classList.add('fa-play');
        }
    };

    $('.forward').onclick = function () {
        currentIndex = (++currentIndex)%musicList.length;
        loadMusic(musicList[currentIndex]);
    };

    $('.back').onclick = function () {
        currentIndex = (musicList.length + --currentIndex)%musicList.length;
        loadMusic(musicList[currentIndex]);
    };

    $('.bar').onclick = function (e) {
        var percent = e.offsetX / parseInt(getComputedStyle(this).width);
        audioObj.currentTime = audioObj.duration * percent ;
        $('.progress').style.width = percent * 80 + "%";
    };

    function getMusicList(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open('GET','./test.json',true);
        xhr.onload = function () {
            if((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
                callback(JSON.parse(this.responseText));
            }else {
                console.log("网络连接失败");
            }
        };
        xhr.onerror = function (){
            console.log("连接超时");
        };
        xhr.send();
    }

    function loadMusic(musicObj) {
        $('.song').innerText = musicObj.song;
        $('.singer').innerText = musicObj.singer;
        $('.cover').style.backgroundImage = 'url(' + musicObj.img + ')';
        $('.music-info .image').src = musicObj.img;
        $('.music-info-small .image').src = musicObj.img;
        audioObj.src = musicObj.src;
        $('.song-info').innerText = musicObj.song + '--' + musicObj.singer;
    }

    function getAllList (list) {
        for (var i = 0; i < list.length; i++) {
            var li = $('.song-row-list').cloneNode(true);
            li.firstChild.nextSibling.children[1].innerText = list[i].song;
            li.firstChild.nextSibling.children[2].innerText = list[i].singer;
            li.firstChild.nextSibling.children[3].innerText = list[i].type;
            $('.list-row').appendChild(li);

        }
    }
};

