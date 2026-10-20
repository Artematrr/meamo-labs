const header = document.querySelector('.header');

if (header) {
	const toggle = header.querySelector('.header__menu-toggle');
	const menu = header.querySelector('.header__mobile-menu');
	const compact = window.matchMedia('(max-width: 1280px)');
	const search = header.querySelector('.search__field');
	const updateSearch = () => {
		search.placeholder = compact.matches ? 'Поиск по каталогу' : 'Поиск по каталогу: название товара или бренда';
	};
	updateSearch();

	const closeMenu = (returnFocus = true) => {
		header.classList.remove('header--menu-open');
		toggle.setAttribute('aria-expanded', 'false');
		if (returnFocus) toggle.focus();
	};

	toggle.addEventListener('click', () => {
		if (toggle.getAttribute('aria-expanded') === 'true') {
			closeMenu();
		} else {
			header.classList.add('header--menu-open');
			toggle.setAttribute('aria-expanded', 'true');
			menu.querySelector('a').focus();
		}
	});
	menu.querySelector('.header__menu-close').addEventListener('click', () => closeMenu());
	menu.addEventListener('click', (event) => {
		if (event.target.closest('a') && compact.matches) closeMenu();
	});
	header.addEventListener('keydown', (event) => {
		if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
			event.preventDefault();
			closeMenu();
		}
	});
	header.addEventListener('focusout', (event) => {
		if (!header.contains(event.relatedTarget)) closeMenu(false);
	});
	compact.addEventListener('change', () => {
		updateSearch();
		const focusInMenu = menu.contains(document.activeElement);
		closeMenu(compact.matches && focusInMenu);
	});
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const hero = document.querySelector('.hero-split--home');

if (hero) {
	const numbers = [...hero.querySelectorAll('[data-slide]')];
	const status = hero.querySelector('.hero-split__status');
	const updateHero = function () {
		numbers.forEach((button, index) => button.setAttribute('aria-pressed', String(index === this.realIndex)));
		this.slides.forEach((slide) => {
			const inactive = Number(slide.dataset.swiperSlideIndex) !== this.realIndex;
			slide.inert = inactive;
			slide.setAttribute('aria-hidden', String(inactive));
		});
		status.textContent = `Слайд ${this.realIndex + 1} из ${numbers.length}`;
	};
	const slider = new Swiper(hero.querySelector('#home-products'), {
		loop: true,
		speed: reducedMotion.matches ? 0 : 350,
		navigation: {
			prevEl: hero.querySelector('[data-direction="-1"]'),
			nextEl: hero.querySelector('[data-direction="1"]'),
		},
		a11y: {
			prevSlideMessage: 'Предыдущий слайд',
			nextSlideMessage: 'Следующий слайд',
			slideLabelMessage: 'Слайд {{index}} из {{slidesLength}}',
		},
		on: { init: updateHero, slideChange: updateHero },
	});
	numbers.forEach((button, index) => button.addEventListener('click', () => slider.slideToLoop(index)));
	reducedMotion.addEventListener('change', () => { slider.params.speed = reducedMotion.matches ? 0 : 350; });
}

document.querySelectorAll('.products-list--slider').forEach((list) => {
	const slider = new Swiper(list.querySelector('.products-list__track'), {
		slidesPerView: 'auto',
		spaceBetween: 16,
		speed: reducedMotion.matches ? 0 : 350,
		watchOverflow: true,
		breakpoints: {
			769: { slidesPerView: 3, spaceBetween: 24 },
			1025: { slidesPerView: 4, spaceBetween: 24 },
		},
		navigation: {
			prevEl: list.querySelector('[data-product-direction="-1"]'),
			nextEl: list.querySelector('[data-product-direction="1"]'),
			lockClass: 'products-list__arrow--locked',
		},
		keyboard: { enabled: true, onlyInViewport: true, pageUpDown: false },
		a11y: {
			prevSlideMessage: 'Предыдущие товары',
			nextSlideMessage: 'Следующие товары',
			slideLabelMessage: 'Товар {{index}} из {{slidesLength}}',
		},
	});
	reducedMotion.addEventListener('change', () => { slider.params.speed = reducedMotion.matches ? 0 : 350; });
});

document.querySelectorAll('.faq').forEach((faq) => {
	faq.addEventListener('click', (event) => {
		const button = event.target.closest('.faq__toggle');
		if (!button) return;
		const expanded = button.getAttribute('aria-expanded') === 'true';
		faq.querySelectorAll('.faq__toggle').forEach((toggle) => {
			const open = toggle === button && !expanded;
			const answer = document.getElementById(toggle.getAttribute('aria-controls'));
			if (!open && answer.contains(document.activeElement)) button.focus();
			toggle.setAttribute('aria-expanded', String(open));
			answer.inert = !open;
			answer.setAttribute('aria-hidden', String(!open));
		});
	});
});

const request = document.querySelector('.compact-request');

if (request) {
	const form = request.querySelector('.form');
	const fileInput = form.querySelector('.form__file');
	const fileLabel = form.querySelector('.form__file-label span');
	const removeFile = form.querySelector('.form__remove-file');
	const fileStatus = form.querySelector('.form__file-status');
	const status = form.querySelector('.form__status');

	document.querySelectorAll('a[href="#request"]').forEach((link) => {
		link.addEventListener('click', () => {
			const context = link.dataset.requestContext || 'Подбор продукции для вашей практики';
			request.querySelector('.compact-request__context').textContent = context;
			form.elements.namedItem('context').value = context;
		});
	});

	const updateFile = () => {
		const file = fileInput.files[0];
		fileLabel.textContent = file ? file.name : 'Прикрепить файл или фото';
		removeFile.hidden = !file;
		fileStatus.textContent = file ? `Выбран файл: ${file.name}. Он ещё не отправлен.` : 'Выбранный файл удалён.';
	};
	fileInput.addEventListener('change', updateFile);
	removeFile.addEventListener('click', () => {
		fileInput.value = '';
		updateFile();
		fileInput.focus();
	});
	form.addEventListener('submit', (event) => {
		event.preventDefault();
		status.textContent = 'Отправка пока недоступна: обработчик не подключён. Все заполненные поля и выбранный файл сохранены.';
		status.tabIndex = -1;
		status.focus();
	});
}
