class MusicBoxPlugin extends Layer {
    constructor() {
        super("MusicBox", "fas fa-music", 400);

        this.cookieName = "clatcher_musicbox_videos";
        this.videos = this.loadVideos();

        const body = document.createElement("div");
        body.classList.add("text-center");

        body.innerHTML = `
            <p>MusicBox 🎵 – Wähle ein Video oder füge eins hinzu</p>
            <select id="video-select" class="textfield mb-15"></select>
            <button id="play-video" class="stylish">Abspielen</button>
            <br><br>
            <input id="new-video-url" class="textfield" placeholder="YouTube-URL" />
            <input id="new-video-title" class="textfield mt-5" placeholder="Optionaler Titel" />
            <button id="add-video" class="stylish mt-5">Hinzufügen</button>
            <br><br>
            <div id="video-frame"></div>
        `;

        this.setBody(body);
    }

    build() {
        super.build();

        const select = document.getElementById("video-select");
        const frame = document.getElementById("video-frame");
        const btnPlay = document.getElementById("play-video");
        const btnAdd = document.getElementById("add-video");
        const inputUrl = document.getElementById("new-video-url");
        const inputTitle = document.getElementById("new-video-title");

        const refreshOptions = () => {
            select.innerHTML = "";
            this.videos.forEach(video => {
                const option = document.createElement("option");
                option.value = video.id;
                option.textContent = video.title || video.id;
                select.appendChild(option);
            });
        };

        refreshOptions();

        btnPlay.addEventListener("click", () => {
            const id = select.value;
            frame.innerHTML = `
                <iframe width="340" height="215" src="https://www.youtube.com/embed/${id}" 
                frameborder="0" allowfullscreen></iframe>
            `;
        });

        btnAdd.addEventListener("click", () => {
            const url = inputUrl.value.trim();
            const title = inputTitle.value.trim();
            const id = this.extractVideoId(url);

            if (id) {
                this.videos.push({ id, title: title || id });
                this.saveVideos();
                refreshOptions();
                inputUrl.value = "";
                inputTitle.value = "";
            } else {
                alert("Ungültige YouTube-URL!");
            }
        });
    }

    extractVideoId(url) {
        try {
            const parsed = new URL(url);
            if (parsed.hostname === "youtu.be") return parsed.pathname.substring(1);
            if (parsed.hostname.includes("youtube.com")) return parsed.searchParams.get("v");
        } catch {
            return null;
        }
        return null;
    }

    saveVideos() {
        const json = JSON.stringify(this.videos);
        const expiry = new Date();
        expiry.setFullYear(expiry.getFullYear() + 10); // Gültig für 10 Jahre
        document.cookie = `${this.cookieName}=${encodeURIComponent(json)}; expires=${expiry.toUTCString()}; path=/`;
    }

    loadVideos() {
        const match = document.cookie.match(new RegExp('(^| )' + this.cookieName + '=([^;]+)'));
        if (match) {
            try {
                return JSON.parse(decodeURIComponent(match[2]));
            } catch {
                return [];
            }
        }
        return [
            { id: "dQw4w9WgXcQ", title: "Rick Astley – Never Gonna Give You Up" },
            { id: "ktvTqknDobU", title: "Imagine Dragons – Radioactive" }
        ];
    }
}

// Initialisierung
const musicBox = new MusicBoxPlugin();
musicBox.build();