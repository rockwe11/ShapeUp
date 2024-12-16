import React, { useState, useEffect } from "react";

import './style.css'

const images = [
    'images/gym1.jpg',
    'images/gym2.jpg',
    'images/gym3.jpg',
]

const texts = [
    'Скидка для студентов! Получите 20% скидку на все абонементы.',
    'Скидка при переходе из другого зала! Присоединяйтесь к нам и получите 30% скидку.',
    'Трудоустройство тренером! Присоединяйтесь к нашей команде профессионалов.',
];

const Main = () => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    // Функция для перехода к предыдущему изображению
    const prevImage = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };
    // Автоматическое переключение изображений через 5 секунд
    useEffect(() => {
        const interval = setInterval(nextImage, 5000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mainpage">
            {/* Секция с акциями */}
            <div className="carousel-container">
                <div className="carousel">
                    <div className="carousel-image-container">
                        <img
                            src={images[currentIndex]}
                            alt={`Image ${currentIndex + 1}`}
                            className="carousel-image"
                        />
                        <div className="carousel-text">{texts[currentIndex]}</div>
                    </div>
                    <div className="carousel-buttons">
                        <button className="carousel-button prev" onClick={prevImage}>
                            &#10094;
                        </button>
                        <button className="carousel-button next" onClick={nextImage}>
                            &#10095;
                        </button>
                    </div>
                </div>
            </div>
            {/* Описание зала */}
            <div className="gym-description">
                <div className="description-cards">
                    <div className="card">
                        <h3 className="c1">Тренажерный зал</h3>
                        <p>
                            Новейшие технологии гарантируют доступ к лучшему оборудованию для тренировок.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="c2">Групповые тренировки</h3>
                        <p>
                            Большой выбор групповых тренировок, созданные для любого уровня подготовки.
                        </p>
                    </div>
                    <div className="card">
                        <h3 className="c3">Бассейн и SPA-зона</h3>
                        <p>
                            Наслаждайтесь плаванием в просторном бассейне и погрузитесь в атмосферу полного расслабления в SPA-зоне.
                        </p>
                    </div>
                </div>
            </div>


            {/* Блоки с абонементами */}
            <div className="memberships">
                <h2>Выбери свой абонемент</h2>
                <div className="membership-cards">
                    <div className="membership-card">
                        <h3>Basic</h3>
                        <p>Доступ в тренажерный зал</p>
                        <p>Price: 1500/month</p>
                        <button>Choose Basic</button>
                    </div>
                    <div className="membership-card">
                        <h3>Standard</h3>
                        <p>Access to equipment + group classes</p>
                        <p>Price: $50/month</p>
                        <button>Choose Standard</button>
                    </div>
                    <div className="membership-card">
                        <h3>Premium</h3>
                        <p>All benefits + personal training</p>
                        <p>Price: $80/month</p>
                        <button>Choose Premium</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Main
