// ===== 상수 및 상태 =====
const API_KEY = "9172b236";
const FAVORITE_KEY = "savedFavorite";
const RECENT_KEY = "recentKeywords";
const RECENT_MAX = 8;

// 첫 화면 "오늘의 추천"에 사용할 키워드 풀
const RECOMMEND_KEYWORDS = [
    "avengers",
    "harry potter",
    "mission impossible",
    "spider man",
    "star wars",
    "jurassic",
    "batman",
    "lord of the rings",
];

// 포스터가 없거나 로드에 실패했을 때 보여줄 대체 이미지 (외부 파일 불필요)
const PLACEHOLDER_POSTER =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" width="210" height="300">' +
        '<rect width="100%" height="100%" fill="#1a1a1a"/>' +
        '<text x="50%" y="50%" fill="#555" font-size="16" text-anchor="middle" dominant-baseline="middle">No Poster</text>' +
        "</svg>"
    );

// 현재 검색 상태값 저장
const state = {
    nowPage: 1,
    inputValue: "",
    totalPage: 0,
    isProcessing: false, // 무한스크롤 중복 요청 방지
    type: "", // 타입 필터 (movie | series | episode)
    year: "", // 연도 필터
};

// 검색 요청 시퀀스: 실시간 검색에서 늦게 도착한 이전 응답이 최신 결과를 덮지 않도록 함
let searchSeq = 0;

// 자주 쓰는 DOM 요소 (script가 defer라 DOM 준비 후 실행됨)
const $movies = document.querySelector(".movies");
const $favorites = document.querySelector(".favorites");
const $errMsg = document.querySelector(".errMsg");
const $sectionTitle = document.querySelector(".sectionTitle");
const $favBtn = document.querySelector(".favBtn");
const $searchBtn = document.querySelector(".searchBtn");
const $searchBar = document.querySelector(".mvSearch");
const $searchInput = document.querySelector("#searchKey");
const $typeFilter = document.querySelector("#typeFilter");
const $yearFilter = document.querySelector("#yearFilter");
const $recentWrap = document.querySelector(".recentKeywords");
const $sentinel = document.querySelector(".sentinel");
const $topBtn = document.querySelector(".topBtn");
const $modalOverlay = document.querySelector(".modalOverlay");
const $modal = document.querySelector(".modal");
const $toast = document.querySelector(".toast");

// ===== API =====
// 같은 검색(키워드+필터+페이지)은 다시 호출하지 않도록 메모리에 캐싱 (무료 키 일일 한도 절약)
const searchCache = new Map();

const fetchMovies = async (keyword, page = 1) => {
    const cacheKey = `${keyword}|${state.type}|${state.year}|${page}`;
    if (searchCache.has(cacheKey)) {
        return searchCache.get(cacheKey);
    }

    const params = new URLSearchParams({ apikey: API_KEY, s: keyword, page });
    if (state.type) params.set("type", state.type);
    if (state.year) params.set("y", state.year);

    const response = await fetch(`https://www.omdbapi.com/?${params}`);
    const data = await response.json();
    if (data.Response === "True") {
        searchCache.set(cacheKey, data); // 성공한 응답만 캐싱
    }
    return data;
};

const fetchMovieDetail = async (imdbID) => {
    const url = `https://www.omdbapi.com/?apikey=${API_KEY}&i=${imdbID}&plot=full`;
    const response = await fetch(url);
    return response.json();
};

// ===== 토스트 알림 =====
let toastTimer;
const showToast = (message) => {
    $toast.innerText = message;
    $toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => $toast.classList.remove("show"), 2500);
};

// ===== 스켈레톤 로딩 =====
const showSkeletons = (count) => {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
        const card = document.createElement("div");
        card.classList.add("mvContent", "skeleton", "show"); // show: 등장 애니메이션 없이 바로 표시
        const box = document.createElement("div");
        box.classList.add("mvImage", "skeletonBox");
        card.appendChild(box);
        fragment.appendChild(card);
    }
    $movies.appendChild(fragment);
};

const clearSkeletons = () => {
    $movies.querySelectorAll(".skeleton").forEach((el) => el.remove());
};

// ===== 로컬스토리지 헬퍼 =====
const loadList = (key) => {
    try {
        const data = JSON.parse(localStorage.getItem(key));
        return Array.isArray(data) ? data : [];
    } catch {
        return [];
    }
};

const loadFavorites = () => loadList(FAVORITE_KEY);
const saveFavorites = (favorites) => {
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(favorites));
};
const isFavorited = (imdbID) => loadFavorites().some((favorite) => favorite.imdbID === imdbID);
const getFavoriteById = (imdbID) => loadFavorites().find((favorite) => favorite.imdbID === imdbID);

// 즐겨찾기 항목의 내 기록(별점/감상/봤어요) 부분 수정
const updateFavorite = (imdbID, patch) => {
    const favorites = loadFavorites().map((movie) =>
        movie.imdbID === imdbID ? { ...movie, ...patch } : movie
    );
    saveFavorites(favorites);
    if (!$favorites.classList.contains("hide")) {
        renderFavorites(); // 즐겨찾기 화면이 열려 있으면 즉시 반영
    }
};

// 즐겨찾기 버튼에 저장 개수 뱃지 표시 (즐겨찾기 화면에서는 '돌아가기'이므로 갱신 안 함)
const refreshFavBtn = () => {
    if ($favorites.classList.contains("hide")) {
        $favBtn.innerText = `즐겨찾기 (${loadFavorites().length})`;
    }
};

// ===== 최근 검색어 =====
const saveRecentKeyword = (keyword) => {
    const list = [keyword, ...loadList(RECENT_KEY).filter((k) => k !== keyword)].slice(0, RECENT_MAX);
    localStorage.setItem(RECENT_KEY, JSON.stringify(list));
};

const renderRecentKeywords = () => {
    const list = loadList(RECENT_KEY);
    const searchOpen = !$searchBar.classList.contains("hide");
    $recentWrap.innerHTML = "";

    if (!searchOpen || list.length === 0) {
        $recentWrap.classList.add("hide");
        return;
    }
    $recentWrap.classList.remove("hide");

    list.forEach((keyword) => {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.classList.add("chip");
        chip.innerText = keyword;
        chip.onclick = () => {
            $searchInput.value = keyword;
            onSearch();
        };
        $recentWrap.appendChild(chip);
    });

    const clearBtn = document.createElement("button");
    clearBtn.type = "button";
    clearBtn.classList.add("chip", "chipClear");
    clearBtn.innerText = "전체 삭제";
    clearBtn.onclick = () => {
        localStorage.removeItem(RECENT_KEY);
        renderRecentKeywords();
    };
    $recentWrap.appendChild(clearBtn);
};

// ===== 공유 =====
const shareMovie = async (detail) => {
    // 상세 페이지 URL은 없으므로 해당 제목의 검색 결과 링크를 공유
    const url = `${location.origin}${location.pathname}?s=${encodeURIComponent(detail.Title)}`;

    if (navigator.share) {
        try {
            await navigator.share({ title: `HWANFLIX - ${detail.Title}`, url });
        } catch {
            // 사용자가 공유 시트를 닫은 경우 — 무시
        }
        return;
    }
    try {
        await navigator.clipboard.writeText(url);
        showToast("링크가 클립보드에 복사되었습니다.");
    } catch {
        showToast("링크 복사에 실패했습니다.");
    }
};

// ===== 상세 정보 모달 =====
const openModal = async (imdbID) => {
    $modalOverlay.classList.remove("hide");
    document.body.style.overflow = "hidden"; // 모달이 열린 동안 배경 스크롤 잠금
    $modal.innerHTML = '<p class="modalMessage">로딩 중...</p>';

    try {
        const detail = await fetchMovieDetail(imdbID);
        if (detail.Response === "False") {
            throw new Error(detail.Error);
        }
        renderModal(detail);
    } catch (error) {
        console.error("상세 정보 로드 실패:", error);
        $modal.innerHTML = '<p class="modalMessage">상세 정보를 불러오지 못했습니다.</p>';
    }
};

const closeModal = () => {
    $modalOverlay.classList.add("hide");
    document.body.style.overflow = "";
};

const renderModal = (detail) => {
    const poster = detail.Poster && detail.Poster !== "N/A" ? detail.Poster : PLACEHOLDER_POSTER;
    const rating = detail.imdbRating !== "N/A" ? `⭐ ${detail.imdbRating} / 10` : "평점 정보 없음";

    $modal.innerHTML = `
        <button type="button" class="modalClose" aria-label="닫기">&times;</button>
        <div class="modalPoster">
            <img src="${poster}" alt="${detail.Title}">
        </div>
        <div class="modalInfo">
            <h2>${detail.Title}</h2>
            <p class="modalMeta">${detail.Year} · ${detail.Runtime} · ${detail.Genre}</p>
            <p class="modalRating">${rating}</p>
            <div class="modalBtns">
                <button type="button" class="btn modalFavBtn"></button>
                <button type="button" class="btn btnGhost modalShareBtn">공유하기</button>
            </div>
            <div class="myRecord hide">
                <p class="myRecordTitle">📝 내 기록</p>
                <div class="recordRow">
                    <span class="starRow"></span>
                    <button type="button" class="chip watchedToggle"></button>
                </div>
                <div class="memoRow">
                    <input type="text" class="memoInput" placeholder="한 줄 감상을 남겨보세요." maxlength="60">
                    <button type="button" class="chip memoSave">저장</button>
                </div>
            </div>
            <dl>
                <dt>감독</dt><dd>${detail.Director}</dd>
                <dt>출연</dt><dd>${detail.Actors}</dd>
            </dl>
            <p class="modalPlot">${detail.Plot}</p>
        </div>`;

    $modal.querySelector(".modalClose").onclick = closeModal;
    $modal.querySelector(".modalShareBtn").onclick = () => shareMovie(detail);

    // 모달 안에서 즐겨찾기 추가/해제 토글
    const $modalFavBtn = $modal.querySelector(".modalFavBtn");
    const movieSummary = {
        Title: detail.Title,
        Year: detail.Year,
        imdbID: detail.imdbID,
        Type: detail.Type,
        Poster: detail.Poster,
    };
    const syncFavLabel = () => {
        const favorited = isFavorited(detail.imdbID);
        $modalFavBtn.innerText = favorited ? "✕ CANCEL" : "♥ LOVE IT!";
        $modalFavBtn.classList.toggle("btnCancel", favorited);
    };

    // 내 기록 섹션: 즐겨찾기한 영화만 별점/봤어요/한 줄 감상 편집 가능
    const $record = $modal.querySelector(".myRecord");
    const $starRow = $modal.querySelector(".starRow");
    const $watchedToggle = $modal.querySelector(".watchedToggle");
    const $memoInput = $modal.querySelector(".memoInput");

    const renderRecord = () => {
        const favorite = getFavoriteById(detail.imdbID);
        if (!favorite) {
            $record.classList.add("hide");
            return;
        }
        $record.classList.remove("hide");

        // 별점: 같은 별을 다시 누르면 취소
        $starRow.innerHTML = "";
        const rating = favorite.myRating || 0;
        for (let i = 1; i <= 5; i++) {
            const star = document.createElement("button");
            star.type = "button";
            star.classList.add("starBtn");
            star.innerText = i <= rating ? "★" : "☆";
            star.onclick = () => {
                updateFavorite(detail.imdbID, { myRating: i === rating ? 0 : i });
                renderRecord();
            };
            $starRow.appendChild(star);
        }

        $watchedToggle.innerText = favorite.watched ? "✔ 본 영화" : "👁 볼 영화";
        $watchedToggle.classList.toggle("chipActive", Boolean(favorite.watched));
        $memoInput.value = favorite.memo || "";
    };

    $watchedToggle.onclick = () => {
        const favorite = getFavoriteById(detail.imdbID);
        if (!favorite) return;
        updateFavorite(detail.imdbID, { watched: !favorite.watched });
        renderRecord();
    };
    $modal.querySelector(".memoSave").onclick = () => {
        if (!getFavoriteById(detail.imdbID)) return;
        updateFavorite(detail.imdbID, { memo: $memoInput.value.trim() });
        showToast("한 줄 감상이 저장되었습니다.");
    };

    syncFavLabel();
    renderRecord();
    $modalFavBtn.onclick = () => {
        if (isFavorited(detail.imdbID)) {
            cancelClicked(movieSummary);
        } else {
            loveClicked(movieSummary);
        }
        syncFavLabel();
        renderRecord(); // 즐겨찾기 여부에 따라 기록 섹션 표시/숨김
    };
};

// ===== 카드 등장 애니메이션 =====
const cardObserver = new IntersectionObserver(
    (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show");
                observer.unobserve(entry.target); // 한 번 나타난 카드는 관찰 종료
            }
        });
    },
    { threshold: 0.1 }
);

// ===== 카드 렌더링 (검색 결과 / 즐겨찾기 공용) =====
const createMovieCard = (movie, isFavorite) => {
    const card = document.createElement("div");
    card.classList.add("mvContent");

    const imageBox = document.createElement("div");
    imageBox.classList.add("mvImage");
    const img = document.createElement("img");
    img.src = movie.Poster && movie.Poster !== "N/A" ? movie.Poster : PLACEHOLDER_POSTER;
    img.alt = movie.Title;
    img.loading = "lazy"; // 화면 밖 포스터는 스크롤 시점에 로드
    img.onerror = () => {
        img.onerror = null; // 대체 이미지도 실패할 경우 무한 루프 방지
        img.src = PLACEHOLDER_POSTER;
    };
    imageBox.appendChild(img);

    const titleBox = document.createElement("div");
    titleBox.classList.add("mvTitle");
    const span = document.createElement("span");
    const titleP = document.createElement("p");
    titleP.classList.add("title");
    titleP.innerText = movie.Title;
    const typeP = document.createElement("p");
    typeP.classList.add("type");
    typeP.innerText = movie.Type;

    const btn = document.createElement("button");
    btn.classList.add("btn");
    btn.type = "button";
    if (isFavorite) {
        btn.innerText = "✕ CANCEL";
        btn.classList.add("btnCancel");
        btn.onclick = () => cancelClicked(movie);
    } else {
        btn.innerText = "♥ LOVE IT!";
        btn.onclick = () => loveClicked(movie);
    }

    span.append(titleP, typeP);

    // 즐겨찾기 카드에는 내 기록(봤어요 뱃지 / 별점 / 한 줄 감상) 표시
    if (isFavorite) {
        if (movie.watched) {
            const badge = document.createElement("span");
            badge.classList.add("watchedBadge");
            badge.innerText = "본 영화";
            imageBox.appendChild(badge);
        }
        if (movie.myRating) {
            const stars = document.createElement("p");
            stars.classList.add("cardStars");
            stars.innerText = "★".repeat(movie.myRating) + "☆".repeat(5 - movie.myRating);
            span.appendChild(stars);
        }
        if (movie.memo) {
            const memo = document.createElement("p");
            memo.classList.add("cardMemo");
            memo.innerText = `"${movie.memo}"`;
            span.appendChild(memo);
        }
    }

    span.appendChild(btn);
    titleBox.appendChild(span);
    card.append(imageBox, titleBox);

    // 카드 클릭 시 상세 모달 (즐겨찾기/삭제 버튼 클릭은 제외)
    card.addEventListener("click", (e) => {
        if (e.target.closest(".btn")) return;
        openModal(movie.imdbID);
    });

    cardObserver.observe(card); // 화면에 들어올 때 등장 애니메이션
    return card;
};

const renderMovies = (movies) => {
    movies.forEach((movie) => $movies.appendChild(createMovieCard(movie, false)));
};

const clearMovies = () => {
    $movies.querySelectorAll(".mvContent").forEach((el) => el.remove());
};

// 즐겨찾기 탭 상태 (all | towatch | watched)
let favTab = "all";

const renderFavorites = () => {
    $favorites.innerHTML = "";
    const favorites = loadFavorites();

    // 전체 / 볼 영화 / 본 영화 탭
    const tabs = document.createElement("div");
    tabs.classList.add("favTabs");
    const tabDefs = [
        { key: "all", label: `전체 (${favorites.length})` },
        { key: "towatch", label: `볼 영화 (${favorites.filter((m) => !m.watched).length})` },
        { key: "watched", label: `본 영화 (${favorites.filter((m) => m.watched).length})` },
    ];
    tabDefs.forEach(({ key, label }) => {
        const tab = document.createElement("button");
        tab.type = "button";
        tab.classList.add("chip");
        if (favTab === key) tab.classList.add("chipActive");
        tab.innerText = label;
        tab.onclick = () => {
            favTab = key;
            renderFavorites();
        };
        tabs.appendChild(tab);
    });
    $favorites.appendChild(tabs);

    const filtered = favorites.filter((movie) => {
        if (favTab === "watched") return movie.watched;
        if (favTab === "towatch") return !movie.watched;
        return true;
    });

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.classList.add("favEmpty");
        empty.innerText = "여기에 표시할 영화가 없습니다.";
        $favorites.appendChild(empty);
        return;
    }
    filtered.forEach((movie) => $favorites.appendChild(createMovieCard(movie, true)));
};

// ===== 화면 전환 =====
const showMoviesView = () => {
    $movies.classList.remove("hide");
    $favorites.classList.add("hide");
    refreshFavBtn();
};

// 즐겨찾기 버튼 클릭 시 검색 결과 <-> 즐겨찾기 화면 전환
const favorClicked = () => {
    const willShowFavorites = $favorites.classList.contains("hide");
    if (willShowFavorites) {
        renderFavorites();
        $movies.classList.add("hide");
        $favorites.classList.remove("hide");
        $favBtn.innerText = "돌아가기";
    } else {
        showMoviesView();
    }
};

// 검색 버튼 클릭 시 검색창 표시
const searchBtnClicked = () => {
    $searchBtn.classList.toggle("hide");
    $searchBar.classList.toggle("hide");
    renderRecentKeywords();
    $searchInput.focus();
};

// ===== 즐겨찾기 추가/삭제 =====
const loveClicked = (movie) => {
    const favorites = loadFavorites();

    // imdbID로 중복 확인 (동명 영화 구분 가능)
    if (favorites.some((favorite) => favorite.imdbID === movie.imdbID)) {
        showToast("이미 등록된 영화입니다.");
        return;
    }

    favorites.push(movie);
    saveFavorites(favorites);
    refreshFavBtn();
    showToast(`'${movie.Title}' 영화가 즐겨찾기에 추가되었습니다.`);
};

const cancelClicked = (movie) => {
    const favorites = loadFavorites().filter((favorite) => favorite.imdbID !== movie.imdbID);
    saveFavorites(favorites);
    refreshFavBtn();
    showToast(`'${movie.Title}'을(를) 즐겨찾기에서 삭제하였습니다.`);
    if (!$favorites.classList.contains("hide")) {
        renderFavorites();
    }
};

// ===== 검색 (사용자 검색 / 실시간 검색 / 홈 추천 공용) =====
const startSearch = async (keyword, makeTitle) => {
    const seq = ++searchSeq; // 이 검색보다 늦게 시작된 검색이 있으면 이 결과는 버림
    state.type = $typeFilter.value;
    state.year = $yearFilter.value;

    clearMovies();
    $errMsg.classList.add("hide");
    $sectionTitle.classList.add("hide");
    showSkeletons(8);
    showMoviesView(); // 즐겨찾기 화면이었다면 검색 결과 화면으로 전환

    try {
        const result = await fetchMovies(keyword);
        if (seq !== searchSeq) return; // 더 최신 검색이 진행 중 → 이 응답 폐기

        clearSkeletons();
        state.inputValue = keyword;
        state.nowPage = 1;

        // OMDb는 결과가 없어도 200 응답에 Response: "False"를 반환함
        if (result.Response === "False" || !Array.isArray(result.Search)) {
            state.totalPage = 0;
            $errMsg.classList.remove("hide");
            return;
        }

        state.totalPage = Math.ceil(Number(result.totalResults) / 10);
        $sectionTitle.innerText = makeTitle(result.totalResults);
        $sectionTitle.classList.remove("hide");
        renderMovies(result.Search);
    } catch (error) {
        if (seq !== searchSeq) return;
        console.error("검색 실패:", error);
        clearSkeletons();
        $errMsg.classList.remove("hide");
    }
};

// 검색 상태를 URL 쿼리에 반영 (새로고침·뒤로가기·링크 공유 가능)
const syncURL = (keyword, { replace = false } = {}) => {
    const params = new URLSearchParams();
    params.set("s", keyword);
    if ($typeFilter.value) params.set("type", $typeFilter.value);
    if ($yearFilter.value) params.set("y", $yearFilter.value);

    const url = `?${params.toString()}`;
    if (replace) {
        history.replaceState(null, "", url); // 실시간 검색: 히스토리를 쌓지 않음
    } else {
        history.pushState(null, "", url);
    }
};

// 확정 검색 (Enter / Search 버튼 / 칩 클릭 / 필터 변경): 최근 검색어 저장 + 히스토리 추가
const onSearch = () => {
    const keyword = $searchInput.value.trim();
    if (!keyword) return;

    saveRecentKeyword(keyword);
    renderRecentKeywords();
    syncURL(keyword);
    startSearch(keyword, (total) => `'${keyword}' 검색 결과 (${total}편)`);
};

// 실시간 검색: 타이핑 멈추면 자동 검색 (2글자 이상, 히스토리는 교체만)
const onLiveSearch = () => {
    const keyword = $searchInput.value.trim();
    if (keyword.length < 2) return;

    syncURL(keyword, { replace: true });
    startSearch(keyword, (total) => `'${keyword}' 검색 결과 (${total}편)`);
};

// 첫 화면: 랜덤 키워드로 "오늘의 추천" 채우기
const showRecommendation = () => {
    const keyword = RECOMMEND_KEYWORDS[Math.floor(Math.random() * RECOMMEND_KEYWORDS.length)];
    startSearch(keyword, () => "오늘의 추천 🎬");
};

// ===== 무한 스크롤 (IntersectionObserver 기반) =====
const loadMore = async () => {
    const canLoadMore =
        state.inputValue &&
        state.nowPage < state.totalPage &&
        !$movies.classList.contains("hide"); // 즐겨찾기 화면에서는 동작하지 않음

    if (!canLoadMore || state.isProcessing) return;

    state.isProcessing = true;
    const seq = searchSeq;
    showSkeletons(4);
    try {
        const result = await fetchMovies(state.inputValue, state.nowPage + 1);
        if (seq !== searchSeq) return; // 로드 중 새 검색이 시작됨 → 이 결과 폐기

        clearSkeletons();
        if (result.Response === "True" && Array.isArray(result.Search)) {
            state.nowPage += 1;
            renderMovies(result.Search);
        }
    } catch (error) {
        console.error("추가 로드 실패:", error); // 다음 스크롤에서 자연스럽게 재시도됨
        if (seq === searchSeq) clearSkeletons();
    } finally {
        state.isProcessing = false;
    }
};

// 센티널이 화면 하단 근처에 들어오면 다음 페이지 로드 (200px 앞서 미리 로드)
const scrollObserver = new IntersectionObserver(
    (entries) => {
        if (entries[0].isIntersecting) loadMore();
    },
    { rootMargin: "200px" }
);
scrollObserver.observe($sentinel);

// ===== 맨 위로 버튼 =====
const debounce = (callback, delay = 120) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => callback(...args), delay);
    };
};

window.addEventListener(
    "scroll",
    debounce(() => {
        $topBtn.classList.toggle("show", window.scrollY > 600);
    }, 100)
);
$topBtn.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

// ===== 이벤트 바인딩 =====
$searchBtn.addEventListener("click", searchBtnClicked);
$favBtn.addEventListener("click", favorClicked);
document.querySelector(".mvSearch button").addEventListener("click", onSearch);
$searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        onSearch();
    }
});
$searchInput.addEventListener("input", debounce(onLiveSearch, 400));
$modalOverlay.addEventListener("click", (e) => {
    if (e.target === $modalOverlay) closeModal(); // 바깥 영역 클릭 시 닫기
});
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !$modalOverlay.classList.contains("hide")) closeModal();
});

// 필터 변경 시 현재 검색어로 즉시 재검색
[$typeFilter, $yearFilter].forEach((select) =>
    select.addEventListener("change", () => {
        if ($searchInput.value.trim()) onSearch();
    })
);

// ===== 초기 화면 =====
// 연도 필터 옵션 채우기 (올해 ~ 1970)
const thisYear = new Date().getFullYear();
for (let year = thisYear; year >= 1970; year--) {
    const option = document.createElement("option");
    option.value = year;
    option.innerText = year;
    $yearFilter.appendChild(option);
}

// URL 쿼리(?s=키워드&type=...&y=...)가 있으면 해당 검색 복원, 없으면 오늘의 추천
const initFromURL = () => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get("s");
    $typeFilter.value = params.get("type") || "";
    $yearFilter.value = params.get("y") || "";

    if (keyword) {
        $searchInput.value = keyword;
        startSearch(keyword, (total) => `'${keyword}' 검색 결과 (${total}편)`);
    } else {
        $searchInput.value = "";
        showRecommendation();
    }
};

window.addEventListener("popstate", initFromURL); // 뒤로가기/앞으로가기 시 검색 상태 복원
refreshFavBtn();
initFromURL();
