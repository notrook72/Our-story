
// ПЕРЕКЛЮЧЕНИЕ ЭКРАНОВ

function goToScreen(number) {
    const screens = document.querySelectorAll(".screen");

    screens.forEach((screen) => {
        screen.classList.remove("active");
    });

    let target;

    if (number === 5) {
        target = document.querySelector(".final-screen");
    } else {
        target = document.getElementById(`screen-${number}`);
    }

    if (!target) return;

    target.classList.add("active");

    // Обновляем номер страницы
    const pageNumber = document.getElementById("page-number");

    if (pageNumber) {
        pageNumber.textContent = `0${number} / 05`;
    }

    // Меняем цвет верхней панели на светлых страницах
    const topbar = document.querySelector(".topbar");

    if (topbar) {
        const isPaper = target.classList.contains("paper");

        topbar.classList.toggle("dark", isPaper);
    }

    // Возвращаемся к началу страницы
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}

// ОТКРЫТИЕ КОНВЕРТА И ЗАПУСК МУЗЫКИ

async function openLetter() {
    const envelope = document.getElementById("envelope");
    const hint = document.getElementById("envelope-hint");
    const continueButton = document.getElementById("continue-letter");

    const music = document.getElementById("background-music");

    if (!envelope || envelope.classList.contains("open")) {
        return;
    }

    // Открываем конверт
    envelope.classList.add("open");

    hint.textContent = "Это письмо я написал специально для тебя ♡";

    // Устанавливаем негромкую громкость
    music.volume = 0.18;

    // Пытаемся включить музыку
    try {
        await music.play();
    } catch (error) {
        console.log(
            "Не удалось автоматически запустить музыку. " +
            "Можно включить её кнопкой в плеере.",
            error
        );
    }

    // Показываем кнопку перехода к письму
    setTimeout(() => {
        continueButton.classList.remove("hidden");
    }, 800);
}

// СОЗДАЁМ НЕБОЛЬШОЕ МЕРЦАНИЕ

function createStars() {
    const starsContainer = document.querySelector(".stars");

    if (!starsContainer) return;

    for (let i = 0; i < 35; i++) {
        const star = document.createElement("span");

        star.textContent = "✦";

        star.style.position = "fixed";
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.fontSize = `${Math.random() * 7 + 4}px`;
        star.style.opacity = `${Math.random() * 0.5 + 0.1}`;
        star.style.color = "#fff4e6";
        star.style.pointerEvents = "none";
        star.style.zIndex = "0";
        star.style.animation = `twinkle ${Math.random() * 4 + 2}s infinite alternate`;

        starsContainer.appendChild(star);
    }
}

// ДОБАВЛЯЕМ АНИМАЦИЮ ЗВЁЗД

const style = document.createElement("style");

style.textContent = `
    @keyframes twinkle {
        from {
            opacity: 0.15;
            transform: scale(0.8);
        }

        to {
            opacity: 0.8;
            transform: scale(1.2);
        }
    }
`;

document.head.appendChild(style);

// ЗАПУСКАЕМ ЭФФЕКТЫ

document.addEventListener("DOMContentLoaded", () => {
    createStars();
});

// ===============================
// МУЗЫКАЛЬНЫЙ ПЛЕЕР
// ===============================

const music = document.getElementById("background-music");
const musicToggle = document.getElementById("music-toggle");
const musicIcon = document.getElementById("music-icon");
const musicStatus = document.getElementById("music-status");
const vinyl = document.getElementById("vinyl");
const musicPlayer = document.querySelector(".music-player");

// Проверяем наличие основных элементов
if (!music) {
    console.error("Не найден элемент background-music в index.html");
}

if (!musicToggle) {
    console.error("Не найдена кнопка music-toggle в index.html");
}

// Громкость музыки
if (music) {
    music.volume = 0.18;

    music.addEventListener("error", () => {
        console.error("Ошибка загрузки музыки:", music.error);

        if (musicStatus) {
            musicStatus.textContent = "Не удалось загрузить песню";
        }
    });
}

// Обновление внешнего вида плеера
function updateMusicPlayer(isPlaying) {
    if (musicIcon) {
        musicIcon.textContent = isPlaying ? "Ⅱ" : "♫";
    }

    if (musicToggle) {
        musicToggle.setAttribute(
            "aria-label",
            isPlaying ? "Приостановить музыку" : "Включить музыку"
        );

        musicToggle.setAttribute(
            "aria-pressed",
            String(isPlaying)
        );
    }

    if (musicStatus) {
        musicStatus.textContent = isPlaying
            ? "Сейчас играет ♡"
            : "Нажми, чтобы услышать ♡";
    }

    if (vinyl) {
        vinyl.classList.toggle("playing", isPlaying);
    }
}

// Кнопка включения и остановки музыки
if (music && musicToggle) {
    musicToggle.addEventListener("click", async () => {
        if (music.paused) {
            try {
                await music.play();
                updateMusicPlayer(true);
                console.log("Музыка успешно запущена!");
            } catch (error) {
                console.error("Ошибка воспроизведения:", error);

                if (musicStatus) {
                    musicStatus.textContent =
                        "Проверь файл песни и попробуй ещё раз";
                }
            }
        } else {
            music.pause();
            updateMusicPlayer(false);
        }
    });

    music.addEventListener("pause", () => {
        updateMusicPlayer(false);
    });

    music.addEventListener("play", () => {
        updateMusicPlayer(true);
    });
}

// Светлая или тёмная тема плеера
function updateMusicTheme() {
    const activeScreen = document.querySelector(".screen.active");

    if (!activeScreen || !musicPlayer) {
        return;
    }

    const isPaper = activeScreen.classList.contains("paper");

    musicPlayer.classList.toggle("light-theme", isPaper);
}

// Не изменяем goToScreen, если функции нет
if (typeof goToScreen === "function") {
    const originalGoToScreen = goToScreen;

    goToScreen = function(number) {
        originalGoToScreen(number);
        updateMusicTheme();
    };
}

updateMusicTheme();
updateMusicPlayer(false);