import bindAll from '../utils/bind-all.js';

const Selector = {
  SEARCH_FIELD: '.search-form__field',
  SUBMIT_BUTTON: '.search-form__submit'
};

const ClassName = {
  NO_SCRIPT: 'search-form--nojs',
  SEARCH_FIELD_FOCUSED: 'search-form__field--focused',
  SUBMIT_BUTTON_VISIBLE: 'search-form__submit--visible'
};

const ValidationErrorMessage = {
  TOO_SHORT: 'Текст поискового запроса должен содержать не менее 2-х символов',
  VALUE_MISSING: 'Текст поискового запроса не может быть пустым'
};

export default class SearchForm {
  constructor({element}) {
    this.rootElement = element;
    this.searchFieldElement = element.querySelector(Selector.SEARCH_FIELD);
    this.submitButtonElement = element.querySelector(Selector.SUBMIT_BUTTON);
    this.connect();
  }

  get minLength() {
    return this.searchFieldElement.minLength;
  }

  connect() {
    /**
     * Without javascript, search form is visible, with full keyboard access.
     * Otherwise, it will be hidden initially, but interactive.
     */
    this.rootElement.classList.remove(ClassName.NO_SCRIPT);
    this.bindListeners();
    this.addListeners();
  }

  showSubmitButton() {
    this.submitButtonElement.setAttribute('tabindex', '0');
    this.submitButtonElement.classList.add(ClassName.SUBMIT_BUTTON_VISIBLE);
  }

  hideSubmitButton() {
    this.submitButtonElement.setAttribute('tabindex', '-1');
    this.submitButtonElement.classList.remove(ClassName.SUBMIT_BUTTON_VISIBLE);
  }

  toggleSearchField() {
    this.searchFieldElement.classList.toggle(ClassName.SEARCH_FIELD_FOCUSED);
  }

  bindListeners() {
    bindAll(this, [
      'handleSubmit',
      'handleFocusIn',
      'handleFocusOut',
      'handleSearchFieldInvalid',
      'handleSearchFieldInput'
    ]);
  }

  addListeners() {
    this.rootElement.addEventListener('submit', this.handleSubmit);
    this.rootElement.addEventListener('focusin', this.handleFocusIn);
    this.rootElement.addEventListener('focusout', this.handleFocusOut);
    this.searchFieldElement.addEventListener('invalid', this.handleSearchFieldInvalid);
    this.searchFieldElement.addEventListener('input', this.handleSearchFieldInput);
  }

  handleSubmit(event) {
    this.searchFieldElement.value = this.searchFieldElement.value.trim();
    if (this.searchFieldElement.value < this.minLength) {
      event.preventDefault();
    }
  }

  
  handleFocusIn(event) {
    if (!this.rootElement.contains(event.relatedTarget)) {
      this.toggleSearchField();
      this.showSubmitButton();
    }
  }
  
  handleFocusOut(event) {
    if (!this.rootElement.contains(event.relatedTarget)) {
      this.toggleSearchField();
      this.hideSubmitButton();
    }
  }

  handleSearchFieldInvalid(event) {
    if (event.target.validity.tooShort) {
      event.target.setCustomValidity(ValidationErrorMessage.TOO_SHORT);
    } else if (event.target.validity.valueMissing) {
      event.target.setCustomValidity(ValidationErrorMessage.VALUE_MISSING);
    }
  }

  handleSearchFieldInput(event) {
    if (event.target.validity.tooShort) {
      event.target.setCustomValidity(ValidationErrorMessage.TOO_SHORT);
    } else if (event.target.validity.valueMissing) {
      event.target.setCustomValidity(ValidationErrorMessage.VALUE_MISSING);
    } else {
      event.target.setCustomValidity('');
    }
  }
}