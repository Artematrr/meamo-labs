const header = document.querySelector('.js-header')
if (header) {
	const toggle = header.querySelector('.js-menu-toggle')
	const menu = header.querySelector('.js-menu')
	const compact = window.matchMedia('(max-width: 1280px)')
	const search = header.querySelector('.js-search-input')
	const updateSearch = () => {
		search.placeholder = compact.matches
			? 'Поиск по каталогу'
			: 'Поиск по каталогу: название товара или бренда'
	}
	updateSearch()

	const closeMenu = (returnFocus = true) => {
		header.classList.remove('header--menu-open')
		toggle.setAttribute('aria-expanded', 'false')
		if (returnFocus) toggle.focus()
	}

	toggle.addEventListener('click', () => {
		if (toggle.getAttribute('aria-expanded') === 'true') {
			closeMenu()
		} else {
			header.classList.add('header--menu-open')
			toggle.setAttribute('aria-expanded', 'true')
			menu.querySelector('.js-menu-link').focus()
		}
	})
	menu
		.querySelector('.js-menu-close')
		.addEventListener('click', () => closeMenu())
	menu.addEventListener('click', event => {
		if (event.target.closest('.js-menu-link') && compact.matches) closeMenu()
	})
	header.addEventListener('keydown', event => {
		if (
			event.key === 'Escape' &&
			toggle.getAttribute('aria-expanded') === 'true'
		) {
			event.preventDefault()
			closeMenu()
		}
	})
	header.addEventListener('focusout', event => {
		if (!header.contains(event.relatedTarget)) closeMenu(false)
	})
	compact.addEventListener('change', () => {
		updateSearch()
		const focusInMenu = menu.contains(document.activeElement)
		closeMenu(compact.matches && focusInMenu)
	})
}

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
const hero = document.querySelector('.js-home-hero')
if (hero) {
	const numbers = [...hero.querySelectorAll('.js-hero-slide')]
	const status = hero.querySelector('.js-hero-status')
	const updateHero = function () {
		numbers.forEach((button, index) =>
			button.setAttribute('aria-pressed', String(index === this.realIndex)),
		)
		this.slides.forEach(slide => {
			const inactive = Number(slide.dataset.swiperSlideIndex) !== this.realIndex
			slide.inert = inactive
			slide.setAttribute('aria-hidden', String(inactive))
		})
		status.textContent = `Слайд ${this.realIndex + 1} из ${numbers.length}`
	}
	const slider = new Swiper(hero.querySelector('.js-hero-slider'), {
		loop: true,
		speed: reducedMotion.matches ? 0 : 350,
		navigation: {
			prevEl: hero.querySelector('.js-hero-prev'),
			nextEl: hero.querySelector('.js-hero-next'),
		},
		a11y: {
			prevSlideMessage: 'Предыдущий слайд',
			nextSlideMessage: 'Следующий слайд',
			slideLabelMessage: 'Слайд {{index}} из {{slidesLength}}',
		},
		on: { init: updateHero, slideChange: updateHero },
	})
	numbers.forEach((button, index) =>
		button.addEventListener('click', () => slider.slideToLoop(index)),
	)
	reducedMotion.addEventListener('change', () => {
		slider.params.speed = reducedMotion.matches ? 0 : 350
	})
}

document.querySelectorAll('.js-products-carousel').forEach(list => {
	const slider = new Swiper(list.querySelector('.js-products-slider'), {
		slidesPerView: 'auto',
		spaceBetween: 16,
		speed: reducedMotion.matches ? 0 : 350,
		watchOverflow: true,
		breakpoints: {
			769: { slidesPerView: 3, spaceBetween: 24 },
			1025: { slidesPerView: 4, spaceBetween: 24 },
		},
		navigation: {
			prevEl: list.querySelector('.js-products-prev'),
			nextEl: list.querySelector('.js-products-next'),
			lockClass: 'products-list__arrow--locked',
		},
		keyboard: { enabled: true, onlyInViewport: true, pageUpDown: false },
		a11y: {
			prevSlideMessage: 'Предыдущие товары',
			nextSlideMessage: 'Следующие товары',
			slideLabelMessage: 'Товар {{index}} из {{slidesLength}}',
		},
	})
	reducedMotion.addEventListener('change', () => {
		slider.params.speed = reducedMotion.matches ? 0 : 350
	})
})

document.querySelectorAll('.js-faq').forEach(faq => {
	faq.addEventListener('click', event => {
		const button = event.target.closest('.js-faq-toggle')
		if (!button) return
		const expanded = button.getAttribute('aria-expanded') === 'true'
		faq.querySelectorAll('.js-faq-toggle').forEach(toggle => {
			const open = toggle === button && !expanded
			const answer = toggle
				.closest('.js-faq-item')
				.querySelector('.js-faq-answer')
			if (!open && answer.contains(document.activeElement)) button.focus()
			toggle.setAttribute('aria-expanded', String(open))
			answer.inert = !open
			answer.setAttribute('aria-hidden', String(!open))
		})
	})
})

const request = document.querySelector('.js-request')
if (request) {
	const form = request.querySelector('.js-request-form')
	const fileInput = form.querySelector('.js-request-file')
	const fileLabel = form.querySelector('.js-request-file-label')
	const removeFile = form.querySelector('.js-request-remove-file')
	const fileStatus = form.querySelector('.js-request-file-status')
	const status = form.querySelector('.js-request-status')
	const contextLabel = request.querySelector('.js-request-context')
	const defaultContext = contextLabel.textContent
	if (request.classList.contains('js-wholesale-request')) {
		const requestedContext = new URLSearchParams(window.location.search).get(
			'request',
		)
		let context
		switch (requestedContext) {
			case 'other-product':
				context = 'Информация о другом товаре'
				break
			case 'brochures':
				context = 'Брошюры Jeunetique HA Dermal Filler / Jeunetique Exo'
				break
			case 'documents':
				context = 'Документы по выбранной позиции'
				break
			case 'supply':
				context = 'Вопрос по поставке'
				break
		}
		if (context) {
			contextLabel.textContent = context
			form.elements.namedItem('context').value = context
		}
	}

	document.querySelectorAll('.js-request-link').forEach(link => {
		link.addEventListener('click', () => {
			const context = link.dataset.requestContext || defaultContext
			contextLabel.textContent = context
			form.elements.namedItem('context').value = context
		})
	})

	form.noValidate = true
	const demo = new URLSearchParams(location.search).get('ui-demo') === '1'
	const controls = [...form.querySelectorAll('.js-request-control')]
	const submit = form.querySelector('.js-request-submit')
	const attachment = form.querySelector('.js-request-attachment')
	const fileDescription = form.querySelector('.js-request-upload-description')
	status.setAttribute('aria-live', 'off')
	const success = request.querySelector('.js-request-success')
	let selectedFile = null
	let fileError = ''
	let submitted = false
	let sending = false
	const messages = new Map()
	controls.forEach(input => {
		const message = document.createElement('p')
		message.className = 'form__message'
		message.id = `${input.id}-message`
		message.hidden = true
		input.setAttribute('aria-describedby', message.id)
		input.parentElement.append(message)
		messages.set(input, message)
	})
	const setField = (input, error = '', valid = false) => {
		input.setAttribute('aria-invalid', String(Boolean(error)))
		input.classList.toggle('form__input--success', valid && !error)
		const message = messages.get(input)
		message.textContent = error || (valid ? (input.name === 'message' ? 'Комментарий добавлен' : 'Данные заполнены корректно') : '')
		message.classList.toggle('form__message--success', valid && !error)
		message.hidden = !message.textContent
	}
	const phoneValid = value => /^\+[1-9]\d{1,14}$/.test(value.replace(/[\s()\-]/g, ''))
	const emailValid = value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
	const validate = () => {
		const fields = form.elements
		const name = fields.namedItem('name')
		const contact = fields.namedItem('contact')
		const email = fields.namedItem('email')
		const phone = fields.namedItem('phone')
		const consent = fields.namedItem('consent')
		setField(name, name.value.trim() ? '' : 'Укажите имя.')
		if (contact) {
			if (/^[+\d\s()\-]+$/.test(contact.value)) maskPhone(contact)
			const value = contact.value.trim()
			setField(contact, !value ? 'Укажите email или телефон для ответа.' :
				!(value.includes('@') ? emailValid(value) : phoneValid(value)) ? 'Проверьте email или номер с кодом страны.' : '')
		} else {
			const missing = !email.value.trim() && !phone.value.trim()
			setField(email, missing ? 'Укажите email или телефон для ответа.' :
				email.value.trim() && !emailValid(email.value.trim()) ? 'Проверьте email: например, name@company.ru' : '')
			setField(phone, phone.value.trim() && !phoneValid(phone.value) ? 'Укажите номер с кодом страны.' : '')
		}
		setField(consent, consent.checked ? '' : 'Подтвердите согласие, чтобы отправить запрос')
		return controls.find(input => input.getAttribute('aria-invalid') === 'true') || (fileError ? fileInput : null)
	}
	const maskPhone = input => {
		const value = input.value
		const cursor = input.selectionStart
		const digits = value.replace(/\D/g, '').slice(0, 15)
		input.value = digits ? `+${digits}` : value === '+' ? '+' : ''
		const position = Math.min(input.value.length, value.slice(0, cursor).replace(/\D/g, '').length + (input.value ? 1 : 0))
		input.setSelectionRange(position, position)
	}
	controls.forEach(input => {
		input.addEventListener('input', () => {
			if (input.type === 'tel' || (input.name === 'contact' && /^\+[\d\s()\-]*$/.test(input.value))) maskPhone(input)
			if (submitted) validate()
			else setField(input)
		})
		if (input.name === 'contact') input.addEventListener('blur', () => {
			if (/^[+\d\s()\-]+$/.test(input.value)) maskPhone(input)
			if (submitted) validate()
		})
	})

	const showFile = (state = selectedFile ? 'attached' : 'default') => {
		const errors = {
			error: 'Не удалось загрузить файл. Повторите попытку.',
			unsupported: 'Формат не поддерживается. PDF, XLSX, XLS, CSV, JPG, JPEG или PNG.',
			oversize: 'Файл больше 10 МБ. Уменьшите размер или выберите другой.',
			tooMany: 'Можно прикрепить один файл. Выберите нужный.',
		}
		fileError = errors[state] || ''
		attachment.classList.toggle('form__attachment--error', Boolean(fileError))
		attachment.classList.toggle('form__attachment--attached', state === 'attached')
		fileInput.setAttribute('aria-invalid', String(Boolean(fileError)))
		fileDescription.textContent = fileError ? 'Попробуйте ещё раз или выберите другой файл' : 'Список продукции или фото упаковки'
		const info = selectedFile ? `${selectedFile.name} · ${Math.max(1, Math.round(selectedFile.size / 1024))} КБ` : 'Список продукции.xlsx · 24 КБ'
		fileLabel.textContent = fileError || (state === 'default' ? 'Прикрепить файл или фото' : info)
		fileStatus.textContent = state === 'uploading' ? 'Загружаем…' : fileError || (state === 'attached' ? 'Файл прикреплён' : '')
		fileStatus.classList.toggle('visually-hidden', state !== 'uploading')
		removeFile.hidden = state === 'default'
	}
	fileInput.addEventListener('change', () => {
		if (!fileInput.files.length) return
		const file = fileInput.files[0]
		const state = fileInput.files.length > 1 ? 'tooMany' : file.size > 10 * 1024 * 1024 ? 'oversize' :
			!/\.(pdf|xlsx|xls|csv|jpe?g|png)$/i.test(file.name) ? 'unsupported' : 'attached'
		if (state === 'attached') selectedFile = file
		else {
			const retained = new DataTransfer()
			if (selectedFile) retained.items.add(selectedFile)
			fileInput.files = retained.files
		}
		showFile(state)
	})
	removeFile.addEventListener('click', () => {
		selectedFile = null
		fileInput.value = ''
		showFile('default')
		fileStatus.textContent = 'Выбранный файл удалён.'
		fileInput.focus()
	})

	const feedback = document.createElement('aside')
	feedback.className = 'form-feedback'
	feedback.hidden = true
	feedback.setAttribute('aria-label', 'Результат отправки запроса')
	feedback.innerHTML = `<div class="form-feedback__message js-feedback-message" role="status" aria-live="polite" aria-atomic="true"><strong class="form-feedback__title js-feedback-title"></strong><p class="js-feedback-text"></p></div><button class="form-feedback__close js-feedback-close" type="button" aria-label="Закрыть уведомление">×</button><button class="button button--secondary js-feedback-retry" type="button" hidden>Повторить отправку</button>`
	document.body.append(feedback)
	const feedbackTitle = feedback.querySelector('.js-feedback-title')
	const feedbackText = feedback.querySelector('.js-feedback-text')
	const retry = feedback.querySelector('.js-feedback-retry')
	const showFeedback = state => {
		if (state !== 'success') {
			form.hidden = false
			success.hidden = true
		}
		sending = state === 'sending'
		form.setAttribute('aria-busy', String(sending))
		submit.disabled = sending
		submit.textContent = sending ? 'Отправляем запрос…' : 'Отправить запрос менеджеру'
		feedback.hidden = false
		feedback.classList.toggle('form-feedback--error', state === 'error')
		feedbackTitle.textContent = state === 'sending' ? 'Отправляем запрос…' : state === 'success' ? 'Запрос отправлен' : 'Не удалось отправить запрос'
		feedbackText.textContent = state === 'sending' ? 'Пожалуйста, дождитесь завершения отправки.' : state === 'success' ?
			'Спасибо! Мы получили ваш запрос. Менеджер свяжется с вами по указанному контакту.' : demo ?
			'Введённые данные сохранены. Попробуйте ещё раз.' : 'Отправка пока не подключена. Введённые данные и выбранный файл сохранены.'
		retry.hidden = state !== 'error'
		status.textContent = feedbackText.textContent
		status.hidden = false
		status.classList.add('visually-hidden')
		if (state === 'success') {
			form.hidden = true
			success.hidden = false
			success.focus()
		}
	}
	feedback.querySelector('.js-feedback-close').addEventListener('click', () => {
		feedback.hidden = true
		if (success.hidden) (sending && demo ? demoPanel : submit).focus()
		else success.focus()
	})
	retry.addEventListener('click', () => form.requestSubmit())
	form.addEventListener('submit', event => {
		event.preventDefault()
		if (sending) return
		submitted = true
		const invalid = validate()
		if (invalid) {
			invalid.focus()
			return
		}
		showFeedback(demo ? 'sending' : 'error')
	})

	let demoPanel
	if (demo) {
		demoPanel = document.createElement('div')
		demoPanel.className = 'form__demo'
		demoPanel.tabIndex = -1
		demoPanel.innerHTML = `<strong>Демонстрация состояний — данные не отправляются</strong>
			<p>Заполните форму и нажмите отправку. Состояние отправки сохраняется до выбора результата ниже.</p>
			<div class="form__row">
			<label class="form__field js-select-label">Поля<select class="js-select js-demo-fields"><option value="default">Исходное состояние</option><option value="filled">Заполнены</option><option value="error">Ошибка</option><option value="success">Корректно заполнены</option></select></label>
			<label class="form__field js-select-label">Согласие<select class="js-select js-demo-consent"><option value="default">Не отмечено</option><option value="checked">Отмечено</option><option value="error">Ошибка</option></select></label>
			<label class="form__field js-select-label">Вложение<select class="js-select js-demo-upload"><option value="default">Не выбрано</option><option value="uploading">Загружается</option><option value="attached">Прикреплено</option><option value="error">Ошибка загрузки</option><option value="unsupported">Неподдерживаемый формат</option><option value="oversize">Больше 10 МБ</option><option value="tooMany">Больше одного файла</option></select></label>
			<label class="form__field js-select-label">Вид вложения<select class="js-select js-demo-upload-view"><option value="compact">Компактный</option><option value="full">Полный Upload</option></select></label>
			</div><div class="form__demo-actions"><button class="button js-demo-feedback" data-state="sending" type="button">Отправка</button><button class="button button--secondary js-demo-feedback" data-state="error" type="button">Ошибка отправки</button><button class="button button--secondary js-demo-feedback" data-state="success" type="button">Успех</button><button class="button button--link js-demo-reset" type="button">Вернуться к форме / сбросить</button></div>
			<details><summary>Состояния кнопок и селекта</summary><div class="form__demo-actions">${['', ' button--secondary', ' button--link'].map(mod => `<button type="button" class="button${mod}">Запросить условия</button><button type="button" class="button${mod}" disabled>Запросить условия</button>`).join('')}</div><label class="form__field js-select-label">Недоступный селект<select class="js-select" disabled><option>Все категории</option></select></label></details>`
		form.before(demoPanel)
		demoPanel.querySelector('.js-demo-fields').addEventListener('change', event => {
			const state = event.target.value
			controls.filter(input => input.type !== 'checkbox').forEach(input => {
				input.value = state === 'default' ? '' : input.name === 'name' ? 'Анна' : input.name === 'email' || input.name === 'contact' ? 'buyer@example.com' : input.type === 'tel' ? '+821028416857' : 'Пример для просмотра состояния'
				setField(input, state === 'error' ? 'Проверьте введённые данные' : '', state === 'success')
			})
		})
		demoPanel.querySelector('.js-demo-consent').addEventListener('change', event => {
			const consent = form.elements.namedItem('consent')
			consent.checked = event.target.value === 'checked'
			setField(consent, event.target.value === 'error' ? 'Подтвердите согласие, чтобы отправить запрос' : '')
		})
		demoPanel.querySelector('.js-demo-upload').addEventListener('change', event => showFile(event.target.value))
		demoPanel.querySelector('.js-demo-upload-view').addEventListener('change', event => {
			attachment.classList.toggle('form__attachment--full', event.target.value === 'full')
		})
		demoPanel.querySelectorAll('.js-demo-feedback').forEach(button => button.addEventListener('click', () => showFeedback(button.dataset.state)))
		demoPanel.querySelector('.js-demo-reset').addEventListener('click', () => {
			form.hidden = false
			success.hidden = true
			const context = form.elements.namedItem('context').value
			form.reset()
			form.elements.namedItem('context').value = context
			submitted = false
			sending = false
			form.setAttribute('aria-busy', 'false')
			submit.disabled = false
			submit.textContent = 'Отправить запрос менеджеру'
			controls.forEach(input => setField(input))
			selectedFile = null
			showFile('default')
			attachment.classList.remove('form__attachment--full')
			feedback.hidden = true
			status.hidden = true
			demoPanel.querySelectorAll('.js-select').forEach(select => {
				select.selectedIndex = 0
				select.dispatchEvent(new Event('change'))
			})
			controls[0].focus()
		})
	}
}

const enhanceSelect = select => {
	const wrapper = document.createElement('span')
	wrapper.className = 'select js-select-wrapper'
	select.before(wrapper)
	wrapper.append(select)
	select.hidden = true
	const button = document.createElement('button')
	button.type = 'button'
	button.className = 'select__button js-select-button'
	button.setAttribute('role', 'combobox')
	button.setAttribute('aria-haspopup', 'listbox')
	button.setAttribute('aria-expanded', 'false')
	const list = document.createElement('span')
	list.className = 'select__list js-select-list'
	list.id = `select-options-${document.querySelectorAll('.js-select-wrapper').length}`
	list.setAttribute('role', 'listbox')
	list.addEventListener('pointerdown', event => event.preventDefault())
	list.hidden = true
	button.setAttribute('aria-controls', list.id)
	const label = select.closest('.js-select-label')
	if (label) {
		label.htmlFor = `${list.id}-button`
		button.id = label.htmlFor
		button.setAttribute('aria-label', label.firstChild.textContent.trim())
		list.setAttribute('aria-label', label.firstChild.textContent.trim())
	}
	let active = select.selectedIndex
	const options = [...select.options].map((option, index) => {
		const item = document.createElement('span')
		item.className = 'select__option js-select-option'
		item.id = `${list.id}-${index}`
		item.setAttribute('role', 'option')
		item.textContent = option.textContent
		item.addEventListener('click', event => {
			event.preventDefault()
			choose(index)
		})
		list.append(item)
		return item
	})
	wrapper.append(button, list)
	const highlight = index => {
		active = index
		options.forEach((option, i) => option.classList.toggle('select__option--active', i === active))
		button.setAttribute('aria-activedescendant', options[active].id)
		options[active].scrollIntoView({ block: 'nearest' })
	}
	const close = () => {
		list.hidden = true
		button.setAttribute('aria-expanded', 'false')
		button.removeAttribute('aria-activedescendant')
	}
	const sync = () => {
		button.textContent = select.options[select.selectedIndex].textContent
		button.disabled = select.disabled
		button.classList.toggle('select__button--placeholder', select.selectedIndex === 0)
		options.forEach((option, i) => option.setAttribute('aria-selected', String(i === select.selectedIndex)))
	}
	const choose = index => {
		select.selectedIndex = index
		select.dispatchEvent(new Event('change', { bubbles: true }))
		close()
		button.focus()
	}
	const open = () => {
		list.hidden = false
		button.setAttribute('aria-expanded', 'true')
		highlight(select.selectedIndex)
	}
	button.addEventListener('click', () => list.hidden ? open() : close())
	button.addEventListener('keydown', event => {
		if (event.key === 'Tab' || event.key === 'Escape') {
			close()
			if (event.key === 'Escape') event.preventDefault()
			return
		}
		if (!['ArrowDown', 'ArrowUp', 'Home', 'End', 'Enter', ' '].includes(event.key)) return
		event.preventDefault()
		if (list.hidden) {
			open()
			if (event.key === 'Home' || event.key === 'End') highlight(event.key === 'Home' ? 0 : options.length - 1)
		} else if (event.key === 'Enter' || event.key === ' ') choose(active)
		else highlight(event.key === 'Home' ? 0 : event.key === 'End' ? options.length - 1 : Math.max(0, Math.min(options.length - 1, active + (event.key === 'ArrowDown' ? 1 : -1))))
	})
	document.addEventListener('click', event => {
		if (!wrapper.contains(event.target)) close()
	})
	button.addEventListener('blur', close)
	select.addEventListener('change', sync)
	sync()
}
document.querySelectorAll('.js-select').forEach(enhanceSelect)
const demoSort = document.querySelector('.js-catalog-sort')
if (demoSort && new URLSearchParams(location.search).get('ui-demo') === '1') {
	const label = document.createElement('label')
	label.className = 'catalog-toolbar__demo form__hint'
	label.innerHTML = '<input class="js-demo-sort-disabled" type="checkbox"> Демонстрация: отключить сортировку'
	demoSort.closest('.js-select-label').after(label)
	label.querySelector('.js-demo-sort-disabled').addEventListener('change', event => {
		demoSort.disabled = event.target.checked
		demoSort.dispatchEvent(new Event('change'))
	})
}

const expertCenter = document.querySelector('.js-expert-center')
if (expertCenter) {
	const topics = expertCenter.querySelector('.js-topics')
	const articles = [...expertCenter.querySelectorAll('.js-expert-article')]
	const empty = expertCenter.querySelector('.js-expert-empty')
	const status = expertCenter.querySelector('.js-expert-status')
	const pagination = expertCenter.querySelector('.js-pagination')
	const pageSize = 6
	let selectedTopic = 'all'
	let page = 1
	const updateArticles = () => {
		const matching = articles.filter(
			article =>
				selectedTopic === 'all' || article.dataset.topic === selectedTopic,
		)
		const pages = Math.ceil(matching.length / pageSize)
		articles.forEach(article => {
			const index = matching.indexOf(article)
			article.hidden = index < (page - 1) * pageSize || index >= page * pageSize
		})
		empty.hidden = matching.length > 0
		status.textContent = `Материалов по выбранной теме: ${matching.length}.`
		pagination.hidden = pages <= 1
		pagination.replaceChildren()
		const addPageButton = (text, label, target, disabled = false) => {
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'pagination__button js-pagination-button'
			button.textContent = text
			button.setAttribute('aria-label', label)
			button.dataset.page = target
			button.disabled = disabled
			if (target === page) button.setAttribute('aria-current', 'page')
			pagination.append(button)
		}
		addPageButton('‹', 'Предыдущая страница', 'prev', page === 1)
		for (let number = 1; number <= pages; number++) {
			addPageButton(String(number), `Страница ${number}`, number)
		}
		addPageButton('›', 'Следующая страница', 'next', page >= pages)
	}
	topics.addEventListener('click', event => {
		const button = event.target.closest('.js-topic-button')
		if (!button) return
		selectedTopic = button.dataset.topic
		page = 1
		topics
			.querySelectorAll('.js-topic-button')
			.forEach(topic =>
				topic.setAttribute('aria-pressed', String(topic === button)),
			)
		updateArticles()
	})
	expertCenter
		.querySelector('.js-topics-reset')
		.addEventListener('click', () => {
			const all = topics.querySelector('.js-topic-button[data-topic="all"]')
			all.click()
			all.focus()
		})
	pagination.addEventListener('click', event => {
		const button = event.target.closest('.js-pagination-button')
		if (!button || button.disabled) return
		page =
			button.dataset.page === 'prev'
				? page - 1
				: button.dataset.page === 'next'
					? page + 1
					: Number(button.dataset.page)
		updateArticles()
		pagination.querySelector('.js-pagination-button[aria-current="page"]').focus()
	})
	updateArticles()
}

const catalog = document.querySelector('.js-catalog')
if (catalog) {
	const grid = catalog.querySelector('.js-catalog-grid')
	const cards = [...grid.querySelectorAll('.js-product-card')]
	const panel = catalog.querySelector('.js-catalog-filters')
	const filterForm = panel.querySelector('.js-catalog-filter-form')
	const checkboxes = [...filterForm.querySelectorAll('.js-catalog-filter-input')]
	const drawer = window.matchMedia('(max-width: 1280px)')
	const openFilters = catalog.querySelector('.js-catalog-filters-open')
	const chips = catalog.querySelector('.js-catalog-chips')
	const pagination = catalog.querySelector('.js-pagination')
	const count = catalog.querySelector('.js-catalog-count')
	const sort = catalog.querySelector('.js-catalog-sort')
	const searchForm = header.querySelector('.js-search-form')
	const searchField = searchForm.querySelector('.js-search-input')
	let query = ''
	let page = 1

	const renderCatalog = () => {
		const selected = checkboxes.filter(
			input => input.dataset.applied === 'true',
		)
		const groups = [...new Set(selected.map(input => input.name))]
		const matches = cards.filter(card => {
			const name = card.querySelector('.js-product-title').textContent
			const searchable =
				`${name} ${card.dataset.brand} ${card.querySelector('.js-product-badge')?.textContent || ''}`.toLocaleLowerCase(
					'ru',
				)
			return (
				searchable.includes(query) &&
				groups.every(group =>
					selected.some(
						input =>
							input.name === group && input.value === card.dataset[group],
					),
				)
			)
		})
		if (sort.value !== 'default') {
			matches.sort(
				(a, b) =>
					a
						.querySelector('.js-product-title')
						.textContent.localeCompare(
							b.querySelector('.js-product-title').textContent,
							'ru',
							{ numeric: true },
						) * (sort.value === 'asc' ? 1 : -1),
			)
		}
		const pages = Math.ceil(matches.length / 8)
		page = Math.max(1, Math.min(page, pages))
		cards.forEach(card => {
			card.hidden = true
		})
		matches.forEach((card, index) => {
			grid.append(card)
			card.hidden = index < (page - 1) * 8 || index >= page * 8
		})
		count.textContent = `Найдено товаров: ${matches.length}`
		catalog.querySelector('.js-catalog-empty').hidden = matches.length > 0
		chips.replaceChildren()
		selected.forEach(input => {
			const chip = document.createElement('button')
			chip.type = 'button'
			chip.className = 'filter-chip js-filter-chip'
			chip.textContent = `${input.dataset.groupLabel}: ${input.dataset.label}`
			chip.setAttribute(
				'aria-label',
				`Снять фильтр ${input.dataset.groupLabel}: ${input.dataset.label}`,
			)
			chip.addEventListener('click', () => {
				input.checked = false
				input.dataset.applied = 'false'
				page = 1
				renderCatalog()
				;(chips.querySelector('.js-filter-chip') || count).focus({
					preventScroll: true,
				})
			})
			chips.append(chip)
		})
		chips.hidden = selected.length === 0
		if (selected.length) {
			const reset = document.createElement('button')
			reset.type = 'button'
			reset.className = 'button button--link js-catalog-clear-filters'
			reset.textContent = 'Сбросить всё'
			reset.dataset.clearFilters = ''
			chips.append(reset)
		}
		pagination.replaceChildren()
		pagination.hidden = pages <= 1
		;[
			'prev',
			...Array.from({ length: pages }, (_, index) => index + 1),
			'next',
		].forEach(value => {
			const button = document.createElement('button')
			button.type = 'button'
			button.className = 'pagination__button js-pagination-button'
			button.dataset.page = value
			button.textContent =
				value === 'prev' ? '‹' : value === 'next' ? '›' : value
			if (value === 'prev' || value === 'next') {
				button.setAttribute(
					'aria-label',
					value === 'prev' ? 'Предыдущая страница' : 'Следующая страница',
				)
				button.disabled = value === 'prev' ? page === 1 : page === pages
			} else {
				button.setAttribute('aria-label', `Страница ${value}`)
				if (value === page) button.setAttribute('aria-current', 'page')
			}
			pagination.append(button)
		})
	}
	const applyFilters = () => {
		checkboxes.forEach(input => {
			input.dataset.applied = String(input.checked)
		})
		page = 1
		renderCatalog()
	}
	const restoreFilters = () => {
		checkboxes.forEach(input => {
			input.checked = input.dataset.applied === 'true'
		})
	}
	const closeFilters = () => {
		restoreFilters()
		panel.close()
		openFilters.setAttribute('aria-expanded', 'false')
		openFilters.focus({ preventScroll: true })
	}
	const adaptFilters = () => {
		const focusedInPanel = panel.contains(document.activeElement)
		restoreFilters()
		panel.close()
		openFilters.setAttribute('aria-expanded', 'false')
		panel.removeAttribute('aria-modal')
		if (!drawer.matches) panel.open = true
		if (focusedInPanel)
			(
				drawer.matches
					? openFilters
					: panel.querySelector('.js-catalog-filter-toggle')
			).focus({ preventScroll: true })
	}
	openFilters.addEventListener('click', () => {
		restoreFilters()
		panel.setAttribute('aria-modal', 'true')
		panel.showModal()
		openFilters.setAttribute('aria-expanded', 'true')
		panel.querySelector('.js-catalog-filters-close').focus()
	})
	panel
		.querySelector('.js-catalog-filters-close')
		.addEventListener('click', closeFilters)
	panel.addEventListener('cancel', event => {
		event.preventDefault()
		closeFilters()
	})
	panel.addEventListener('keydown', event => {
		if (event.key !== 'Tab' || !panel.matches('.js-catalog-filters:modal')) return
		const controls = [
			...panel.querySelectorAll('.js-catalog-filter-control'),
		].filter(control => !control.disabled && control.getClientRects().length)
		const first = controls[0]
		const last = controls[controls.length - 1]
		if (event.shiftKey && document.activeElement === first) {
			event.preventDefault()
			last.focus()
		} else if (!event.shiftKey && document.activeElement === last) {
			event.preventDefault()
			first.focus()
		}
	})
	drawer.addEventListener('change', adaptFilters)
	filterForm.addEventListener('change', () => {
		if (!drawer.matches) applyFilters()
	})
	filterForm.addEventListener('submit', event => {
		event.preventDefault()
		applyFilters()
		if (drawer.matches) closeFilters()
	})
	filterForm.addEventListener('reset', event => {
		event.preventDefault()
		checkboxes.forEach(input => {
			input.checked = false
		})
		if (!drawer.matches) applyFilters()
	})
	catalog.addEventListener('click', event => {
		if (!event.target.closest('.js-catalog-clear-filters')) return
		checkboxes.forEach(input => {
			input.checked = false
		})
		applyFilters()
		count.focus({ preventScroll: true })
	})
	sort.addEventListener('change', () => {
		page = 1
		renderCatalog()
	})
	searchForm.addEventListener('submit', event => {
		event.preventDefault()
		query = searchField.value.trim().toLocaleLowerCase('ru')
		page = 1
		renderCatalog()
		catalog
			.querySelector('.js-catalog-results')
			.scrollIntoView({ block: 'start' })
	})
	catalog.querySelectorAll('.js-catalog-view').forEach(button => {
		button.addEventListener('click', () => {
			const list = button.dataset.catalogView === 'list'
			grid.classList.toggle('catalog-grid--list', list)
			cards.forEach(card => card.classList.toggle('product-card--list', list))
			catalog.querySelectorAll('.js-catalog-view').forEach(control => {
				const pressed = control === button
				control.setAttribute('aria-pressed', String(pressed))
				control.classList.toggle('button--secondary', !pressed)
			})
		})
	})
	pagination.addEventListener('click', event => {
		const button = event.target.closest('.js-pagination-button')
		if (!button || button.disabled) return
		page =
			button.dataset.page === 'prev'
				? page - 1
				: button.dataset.page === 'next'
					? page + 1
					: Number(button.dataset.page)
		renderCatalog()
		const results = catalog.querySelector('.js-catalog-results')
		count.focus({ preventScroll: true })
		results.scrollIntoView({ block: 'start' })
	})
	adaptFilters()
	renderCatalog()
}

const productNav = document.querySelector('.js-product-nav')
if (productNav) {
	const links = [...productNav.querySelectorAll('.js-product-nav-link')]
	const updateProductNav = () => {
		const current =
			links.find(link => link.hash === window.location.hash) || links[0]
		links.forEach(link => {
			if (link === current) link.setAttribute('aria-current', 'location')
			else link.removeAttribute('aria-current')
		})
	}
	window.addEventListener('hashchange', updateProductNav)
	updateProductNav()
}

const articleContents = document.querySelector('.js-article-contents')
if (articleContents) {
	const links = [...articleContents.querySelectorAll('.js-article-contents-link')]
	const toggle = articleContents.querySelector('.js-article-contents-toggle')
	const list = articleContents.querySelector('.js-article-contents-list')
	const updateContentsVisibility = () => {
		const collapsed = toggle.getAttribute('aria-expanded') === 'false'
		if (collapsed && list.contains(document.activeElement)) toggle.focus()
		list.hidden = collapsed
	}
	toggle.addEventListener('click', () => {
		const expanded = toggle.getAttribute('aria-expanded') !== 'true'
		toggle.setAttribute('aria-expanded', String(expanded))
		toggle.querySelector('.js-article-contents-indicator').textContent = expanded
			? '−'
			: '+'
		updateContentsVisibility()
	})
	updateContentsVisibility()
	const updateContents = () =>
		links.forEach(link => {
			if (link.hash === (window.location.hash || links[0].hash))
				link.setAttribute('aria-current', 'location')
			else link.removeAttribute('aria-current')
		})
	window.addEventListener('hashchange', updateContents)
	updateContents()
}
