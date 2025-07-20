import songs from "./songs.js";

document.addEventListener("DOMContentLoaded", () => {
    const menu = document.querySelector(".header button");
    const sidebar = document.querySelector("#sidebar");
    const screenSrc = document.querySelector(".screen img");
    const title = document.querySelector(".title p");
    const progressBar = document.querySelector(".progress-bar");
    const progress = document.querySelector(".progress");
    const songsList = document.querySelector(".song-list");
    const playTime = document.querySelector(".time #current-time");
    const audioDuration = document.querySelector(".time #duration");
    const playBtn = document.querySelector("#play-pause-btn");
    const prevBtn = document.querySelector("#prev-btn");
    const nextBtn = document.querySelector("#next-btn");
    const audio = new Audio();
    var isPlaying = false;
    var startIndex = 0;
    var lastIndex = songs.length - 1;

    const formatTime = seconds => {
        const minutes = Math.floor(seconds / 60);
        seconds = Math.floor(seconds % 60);
        return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    };
    const setProgress = e => {
        const width = progressBar.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
        /*
        console.log("Width - ", width);
        console.log("Clix - ", clickX);
        console.log("Duration - ", duration);
        console.log("Current Time : ", audio.currentTime);
        */
    };
    const updateProgress = () => {
        const { currentTime, duration } = audio;
        if (duration) {
            const progressPercent = (currentTime / duration) * 100;
            progress.style.width = `${progressPercent}%`;
            playTime.textContent = formatTime(currentTime);
            audioDuration.textContent = formatTime(duration);
        }
    };

    const playPause = () => {
        if (isPlaying) {
            audio.pause();
            playBtn.innerHTML = '<i class="fas fa-play"></i>';
            isPlaying = false;
        } else {
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
        }
    };

    const parseTitle = title => {
        return title.slice(8, title.length);
    };

    const loadSongs = () => {
        songs.forEach((song, idx) => {
            let li = document.createElement("li");
            let img = document.createElement("img");
            let p = document.createElement("p");
            img.src = song.img;
            p.textContent = parseTitle(song.title);
            li.appendChild(img);
            li.appendChild(p);
            li.onclick = () => {
                if (startIndex !== idx) {
                    startIndex = idx;
                    loadAudio(0, startIndex);
                    audio.play();
                    playBtn.innerHTML = '<i class="fas fa-pause"></i>';
                    isPlaying = true;
                    songsList
                        .querySelectorAll("li")
                        .forEach(prevLi => prevLi.classList.remove("playing"));
                    li.classList.add("playing");
                    sidebar.classList.remove("sidebar");
                } else {
                    sidebar.classList.remove("sidebar");
                }
            };
            songsList.appendChild(li);
        });
        songsList.firstElementChild.classList.add("playing");
    };
    const loadAudio = (startTime = 0, index = 0) => {
        audio.src = songs[index].title;
        title.textContent = parseTitle(songs[index].title);
        screenSrc.src = songs[index].img;
        audio.currentTime = 0;
        audio.load();
        audio.addEventListener("loadedmetadata", function onLoaded() {
            audio.removeEventListener("loadedmetadata", onLoaded); // prevent multiple bindings
            if (startTime < audio.duration) {
                audio.currentTime = startTime;
            }
            playTime.textContent = formatTime(audio.currentTime);
            audioDuration.textContent = formatTime(audio.duration);
        });
    };

    nextBtn.onclick = () => {
        if (startIndex <= lastIndex) {
            startIndex += 1;
            loadAudio(0, startIndex);
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            isPlaying = true;
            songsList
                .querySelector(".playing")
                .nextElementSibling.classList.add("playing");
            songsList.querySelector(".playing").removeAttribute("class");
        }
    };
    prevBtn.onclick = () => {
        if (startIndex !== 0) {
            startIndex -= 1;
            loadAudio(0, startIndex);
            isPlaying = true;
            audio.play();
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            songsList
                .querySelector(".playing")
                .previousElementSibling.classList.add("playing");
            songsList.querySelector(".playing").removeAttribute("class");
        }
    };
    playBtn.addEventListener("click", playPause);
    progressBar.addEventListener("click", setProgress);
    audio.addEventListener("timeupdate", updateProgress);
    menu.onclick = () => {
        sidebar.classList.toggle("sidebar");
    };

    loadSongs();
    loadAudio();
});
