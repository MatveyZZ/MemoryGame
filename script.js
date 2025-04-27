const cards = document.querySelectorAll(".card"), // Получает все элементы с классом "card" и сохраняет их в переменной cards
timeTag = document.querySelector(".time b"), // Получает элемент <b> внутри элемента с классом "time" для отображения времени
flipsTag = document.querySelector(".flips b"), // Получает элемент <b> внутри элемента с классом "flips" для отображения количества переворотов
refreshBtn = document.querySelector(".details button"); // Получает кнопку внутри элемента с классом "details" для обновления игры

let maxTime = 20; // Устанавливает максимальное время игры на 20 секунд
let timeLeft = maxTime; // Устанавливает оставшееся время на максимальное время
let flips = 0; // Инициализирует счетчик переворотов карточек
let matchedCards = 0; // Инициализирует счетчик совпавших карточек
let disableDeck = false; // Переменная для блокировки взаимодействия с карточками
let isPlaying = false; // Переменная для отслеживания состояния игры
let cardOne, cardTwo, timer; // Объявляет переменные для первой и второй карточек, а также таймера

function initTimer() { // Функция для инициализации таймера
    if (timeLeft <= 0) { // Проверяет, если время закончилось
        return clearInterval(timer); // Останавливает таймер
    }
    timeLeft--; // Уменьшает оставшееся время на 1 секунду
    timeTag.innerText = timeLeft; // Обновляет отображение оставшегося времени
}

function flipCard({ target: clickedCard }) { // Функция для переворота карточки
    if (!isPlaying) { // Проверяет, если игра еще не началась
        isPlaying = true; // Устанавливает состояние игры на "игра идет"
        timer = setInterval(initTimer, 1000); // Запускает таймер, который обновляет каждую секунду
    }
    if (clickedCard !== cardOne && !disableDeck && timeLeft > 0) { // Проверяет, что карточка не была ранее перевернута, колода не заблокирована и время еще не истекло
        flips++; // Увеличивает счетчик переворотов
        flipsTag.innerText = flips; // Обновляет отображение количества переворотов
        clickedCard.classList.add("flip"); // Добавляет класс "flip" к перевернутой карточке
        if (!cardOne) { // Проверяет, если первая карточка еще не выбрана
            return cardOne = clickedCard; // Устанавливает первую карточку
        }
        cardTwo = clickedCard; // Устанавливает вторую карточку
        disableDeck = true; // Блокирует колоду для предотвращения дальнейших кликов
        let cardOneIcon = cardOne.querySelector(".back-view i").classList.value; // Получает класс иконки первой карточки
        cardTwoIcon = cardTwo.querySelector(".back-view i").classList.value; // Получает класс иконки второй карточки
        matchCards(cardOneIcon, cardTwoIcon); // Проверяет совпадение иконок
    }
}

function matchCards(icon1, icon2) { // Функция для проверки совпадения иконок
    if (icon1 === icon2) { // Если иконки совпадают
        matchedCards++; // Увеличивает счетчик совпавших карточек
        if (matchedCards == 6 && timeLeft > 0) { // Проверяет, если все карточки совпали и время еще не истекло
            return clearInterval(timer); // Останавливает таймер
        }
        cardOne.removeEventListener("click", flipCard); // Убирает обработчик клика с первой карточки
        cardTwo.removeEventListener("click", flipCard); // Убирает обработчик клика со второй карточки
        cardOne = cardTwo = ""; // Сбрасывает значения первой и второй карточек
        return disableDeck = false; // Разблокирует колоду
    }

    setTimeout(() => { // Устанавливает таймаут для анимации
        cardOne.classList.add("shake"); // Добавляет класс "shake" к первой карточке
        cardTwo.classList.add("shake"); // Добавляет класс "shake" ко второй карточке
    }, 400); // Задержка 400 миллисекунд

    setTimeout(() => { // Устанавливает таймаут для переворота карточек обратно
        cardOne.classList.remove("shake", "flip"); // Убирает классы "shake" и "flip" с первой карточки
        cardTwo.classList.remove("shake", "flip"); // Убирает классы "shake" и "flip" со второй карточки
        cardOne = cardTwo = ""; // Сбрасывает значения первой и второй карточек
        disableDeck = false; // Разблокирует колоду для дальнейших кликов
    }, 1200); // Задержка 1200 миллисекунд
}

function shuffleCards() { // Функция для перемешивания карточек
    timeLeft = maxTime; // Сбрасывает оставшееся время на максимальное значение
    flips = matchedCards = 0; // Сбрасывает счетчики переворотов и совпавших карточек
    cardOne = cardTwo = ""; // Сбрасывает значения первой и второй карточек
    clearInterval(timer); // Останавливает таймер
    timeTag.innerText = timeLeft; // Обновляет отображение оставшегося времени
    flipsTag.innerText = flips; // Обновляет отображение количества переворотов
    disableDeck = isPlaying = false; // Разблокирует колоду и устанавливает состояние игры на "не играется"

    let arr = ["bxl-tiktok", "bxl-instagram-alt", "bxl-facebook-circle", "bxl-twitter", "bxl-whatsapp", "bxl-youtube", // Массив с классами иконок
               "bxl-tiktok", "bxl-instagram-alt", "bxl-facebook-circle", "bxl-twitter", "bxl-whatsapp", "bxl-youtube"];
    arr.sort(() => Math.random() > 0.5 ? 1 : -1); // Перемешивает массив иконок случайным образом

    cards.forEach((card, index) => { // Проходит по каждой карточке
        card.classList.remove("flip"); // Убирает класс "flip" с карточки
        let iconTag = card.querySelector(".back-view i"); // Получает элемент иконки на задней стороне карточки
        setTimeout(() => { // Устанавливает таймаут для обновления иконки
            iconTag.classList.value = `bx ${arr[index]}`; // Устанавливает класс иконки на основе перемешанного массива
        }, 500); // Задержка 500 миллисекунд
        card.addEventListener("click", flipCard); // Добавляет обработчик клика на карточку
    });
}

shuffleCards(); // Вызывает функцию перемешивания карточек при загрузке страницы

refreshBtn.addEventListener("click", shuffleCards); // Добавляет обработчик клика на кнопку обновления, который вызывает функцию перемешивания карточек

cards.forEach(card => { // Проходит по каждой карточке
    card.addEventListener("click", flipCard); // Добавляет обработчик клика на карточку
});
