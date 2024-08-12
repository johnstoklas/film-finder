<script type='text/javascript' src='config.js'></script>

var apiKey = config.apiKey;

const apiPopMovies = `https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}`;
const popMoviesContainer = document.getElementById("pop-movies-overhead");

const apiRatedMovies = `https://api.themoviedb.org/3/movie/top_rated?api_key=${apiKey}`;
const ratedMoviesContainer = document.getElementById("rated-movies-overhead");

const apiSoonMovies = `https://api.themoviedb.org/3/movie/upcoming?api_key=${apiKey}`;
const soonMoviesContainer = document.getElementById("soon-movies-overhead");

const apiNowMovies = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}`;
const nowMoviesContainer = document.getElementById("now-movies-overhead");

const apiPopTV = `https://api.themoviedb.org/3/tv/popular?api_key=${apiKey}`;
const popTVContainter = document.getElementById("pop-tv-overhead");

const apiRatedTV = `https://api.themoviedb.org/3/tv/top_rated?api_key=${apiKey}`;
const ratedTVContainer = document.getElementById("rated-tv-overhead");

const apiGenre = `https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`;

const genreList = [
    {"id": 28,"name": "Action"},
    {"id": 12,"name": "Adventure"},
    {"id": 16,"name": "Animation"},
    {"id": 35,"name": "Comedy"},
    {"id": 80,"name": "Crime"},
    {"id": 99,"name": "Documentary"},
    {"id": 18,"name": "Drama"},
    {"id": 10751,"name": "Family"},
    {"id": 14,"name": "Fantasy"},
    {"id": 36,"name": "History"},
    {"id": 27,"name": "Horror"},
    {"id": 10402,"name": "Music"},
    {"id": 9648,"name": "Mystery"},
    {"id": 10749,"name": "Romance"},
    {"id": 878,"name": "Science Fiction"},
    {"id": 10770,"name": "TV Movie"},
    {"id": 53,"name": "Thriller"},
    {"id": 10752,"name": "War"},
    {"id": 37,"name": "Western"},
    {"id": 10759, "name": "Action & Adventure"},
    {"id": 10762, "name": "Kids"},
    {"id": 10763,"name": "News"},
    {"id": 10764,"name": "Reality"},
    {"id": 10765,"name": "Sci-Fi & Fantasy"},
    {"id": 10766,"name": "Soap"},
    {"id": 10767,"name": "Talk"},
    {"id": 10768,"name": "War & Politics"},
]

function genreConvert(genre_id, genreList) {
    for(let i = 0; i<genreList.length; i++) {
        if(genreList[i]["id"] === genre_id) {
            return " " + genreList[i]["name"];
        }
    }
}

class apiFetch {
    constructor(api, container, identifier) {
        this.api = api;
        this.container = container;
        this.identifier = identifier;
        this.index = 0;
    }
    async fetch(load) {
        try {
            const response = await fetch(this.api);
            const data = await response.json();
    
            data.results.forEach(media => {
                const card = createCard(media, this.identifier);
                this.container.appendChild(card);
            });

            if(load == true) {
                shift(0, this.identifier);
            }
            
        }
        catch (error) {
            console.error("error", error);
        }
    }
    indexReturn() {
        return this.index;
    }
    updateIndex(n) {
        this.index+=n;
    }
}

function createCard(media, identifier) {
    const { poster_path, vote_average, id, title, overview, genre_ids, name, release_date } = media;

    const card = document.createElement("div");
    card.style.display = "inline-block";
    card.classList.add(identifier);
    card.classList.add("item");

    const color = scoreColor(vote_average);
    let score = Math.floor(vote_average * 10) / 10;

    if(score == 0) {
        score = "-"
    }

    const genre_words = new Array();
    for(let i = 0; i<genre_ids.length; i++) {
        genre_words.push(genreConvert(genre_ids[i], genreList));
    }

    let idFinal = idDeclare(identifier, id);

    card.innerHTML = `
        <img src="https://image.tmdb.org/t/p/w500/${poster_path}" class="poster" onmouseenter="displayInfo(${idFinal})" onmouseout="resetPoster(${idFinal})">
        <div class="pop-up" id=${idFinal}>
            <ul class="pop-up-header">
                <li class="pop-up-title"> ${title || name || "N/A"}</li>
                <li class="pop-up-score" style="color:${color}"> ${score}/10</li>
            </ul>
            <p class="pop-up-overview"> ${overview || "N/A"} </p>
            <p class="pop-up-genre"> ${genre_words || "N/A"} </p>
        <div>
    `;
    return card;
}

function indexSearch(identifier) {
    if(identifier.includes("movie")) {
        if(identifier === "pop-movies") {
            return popMovies.indexReturn();
        }
        else if(identifier === "rated-movies") {
            return ratedMovies.indexReturn();
        }
        else if(identifier === "soon-movies") {
            return soonMovies.indexReturn();
        }
        else if(identifier === "now-movies") {
            return nowMovies.indexReturn();
        }
    }
    else if(identifier.includes("tv")) {
        if(identifier === "pop-tv") {
            return popTV.indexReturn();
        }
        else if(identifier === "rated-tv") {
            return ratedTV.indexReturn();
        }
    }
}

function indexUpdate(identifier, n) {
    if(identifier.includes("movie")) {
        if(identifier === "pop-movies") {
            popMovies.updateIndex(n);
        }
        else if(identifier === "rated-movies") {
            ratedMovies.updateIndex(n);
        }
        else if(identifier === "soon-movies") {
            soonMovies.updateIndex(n);
        }
        else if(identifier === "now-movies") {
            nowMovies.updateIndex(n);
        }
    }
    else if(identifier.includes("tv")) {
        if(identifier === "pop-tv") {
            popTV.updateIndex(n);
        }
        else if(identifier === "rated-tv") {
            ratedTV.updateIndex(n);
        }
    }
}

function idDeclare(identifier, id) {
    if(identifier.includes("movie")) {
        if(identifier === "pop-movies") {
            return id + "1";
        }
        else if(identifier === "rated-movies") {
            return id + "2";
        }
        else if(identifier === "soon-movies") {
            return id + "3";
        }
        else if(identifier === "now-movies") {
            return id + "4";
        }
    }
    else if(identifier.includes("tv")) {
        if(identifier === "pop-tv") {
            return id + "1";
        }
        else if(identifier === "rated-tv") {
            return id + "2";
        }
    }
}

function scoreColor (vote_average) {
    if(vote_average >= 7) {
        return "green";
    }
    else if(vote_average<7 && vote_average>=4) {
        return "yellow";
    }
    else if(vote_average == 0) {
        return "black";
    }
    else if(vote_average<4) {
        return "red";
    }
}

function shift(n, identifier) {
    let index = indexSearch(identifier);
    indexUpdate(identifier, n);
    change(index+=n, identifier);
}

function change(n, identifier) { 
    let items = document.getElementsByClassName(identifier);
    if (n > items.length-7) {
        n = items.length-7;
        indexUpdate(identifier, -1);
    }
    if (n < 1) {
        n = 0;
        indexUpdate(identifier, 1);
    }
    for(let i = 0; i < items.length; i++) {
        items[i].style.display = "none";
    }
    for(let i = n; i<n+7; i++) {
        items[i].style.display = "inline-block";
    }
}

async function contentExpand(overhead, identifier, section) {
    let key = "";
    if(identifier.includes("movie")) {
        key = "movie";
    }
    else if(identifier.includes("tv")) {
        key = "tv";
    }
    const container = document.getElementById(overhead);
    content = new apiFetch("api", container, identifier);
    for(let i = 1; i<=50; i++) {
        content.api = `https://api.themoviedb.org/3/${key}/${section}?api_key=${apiKey}&page=${i}`;
        console.log(content.api)
        content.fetch(false);
    }
}

function indexLoad() {
    const load = true;
    popMovies = new apiFetch(apiPopMovies, popMoviesContainer, "pop-movies");
    popMovies.fetch(load);

    ratedMovies = new apiFetch(apiRatedMovies, ratedMoviesContainer, "rated-movies");
    ratedMovies.fetch(load);

    soonMovies = new apiFetch(apiSoonMovies, soonMoviesContainer, "soon-movies");
    soonMovies.fetch(load);

    nowMovies = new apiFetch(apiNowMovies, nowMoviesContainer, "now-movies");
    nowMovies.fetch(load);  
}

function tvLoad() {
    popTV = new apiFetch(apiPopTV, popTVContainter, "pop-tv");
    popTV.fetch(true);

    ratedTV = new apiFetch(apiRatedTV, ratedTVContainer, "rated-tv");
    ratedTV.fetch(true);
}

function displayInfo(id) {
    const popUp = document.getElementById(id);
    popUp.style.display = "inline-block";
    if(popUp.offsetLeft > 800) {
        popUp.style.marginLeft = "-550px";
    }
    else {
        popUp.style.marginRight = "10px";
    }   
}   

function resetPoster(id) {
    const popUp = document.getElementById(id);
    popUp.style.display = "none";
    popUp.style.marginRight = "0";
    popUp.style.marginLeft = "0";
}
