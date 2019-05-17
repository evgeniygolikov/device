import isEscapeKey from '../utils/is-escape-key.js';
import isSpaceKey from '../utils/is-space-key.js';
import isEnterKey from '../utils/is-enter-key.js';
import bindAll from '../utils/bind-all.js';

const Selector = {
  TRIGGER: '.catalog-menu__trigger',
  DROPDOWN: '.catalog-menu__dropdown',
  LINK: '.catalog-menu__link'
};

const ClassName = {
  NO_SCRIPT: 'catalog-menu--nojs',
  DROPDOWN_EXPANDED: 'catalog-menu__dropdown--expanded',
  TRIGGER_ACTIVE: 'button--active'
};

export default class CatalogMenu {
  constructor({element}) {
    this.rootElement = element;
    this.triggerElement = element.querySelector(Selector.TRIGGER);
    this.dropdownElement = element.querySelector(Selector.DROPDOWN);
    this.linkElements = element.querySelectorAll(Selector.LINK);
    this.connect();
  }

  get isExpanded() {
    return this.dropdownElement.classList.contains(ClassName.DROPDOWN_EXPANDED);
  }

  connect() {
    /**
     * Without javascript, menu is visible and present in document flow,
     * with full keyboard access. Otherwise, it will be hidden initially,
     * but interactive.
     */
    this.rootElement.classList.remove(ClassName.NO_SCRIPT);
    this.disableFocus();
    this.bindListeners();
    this.addListeners();
  }

  expand() {
    if (!this.isExpanded) {
      this.dropdownElement.classList.add(ClassName.DROPDOWN_EXPANDED);
      this.enableFocus();
      document.addEventListener('click', this.handleDocumentClick);
      document.addEventListener('keydown', this.handleDocumentEscapeKeyDown);
    }
  }

  collapse() {
    if (this.isExpanded) {
      this.dropdownElement.classList.remove(ClassName.DROPDOWN_EXPANDED);
      this.disableFocus();
      document.removeEventListener('click', this.handleDocumentClick);
      document.removeEventListener('keydown', this.handleDocumentEscapeKeyDown);
    }
  }

  enableFocus() {
    this.linkElements.forEach(element => element.removeAttribute('tabindex'));
  }

  disableFocus() {
    this.linkElements.forEach(element => element.setAttribute('tabindex', '-1'));
  }

  activateTrigger() {
    this.triggerElement.classList.add(ClassName.TRIGGER_ACTIVE);
  }

  deactivateTrigger() {
    this.triggerElement.classList.remove(ClassName.TRIGGER_ACTIVE);
  }

  bindListeners() {
    bindAll(this, [
      'handleTriggerClick',
      'handleDocumentClick',
      'handleTriggerSpaceKeyDown',
      'handleTriggerEnterKeyDown',
      'handleTriggerEnterKeyUp',
      'handleDocumentEscapeKeyDown',
      'handleTriggerFocusIn',
      'handleTriggerFocusOut',
      'handleDropdownFocusOut'
    ]);
  }

  addListeners() {
    this.triggerElement.addEventListener('click', this.handleTriggerClick);
    this.triggerElement.addEventListener('keydown', this.handleTriggerSpaceKeyDown);
    this.triggerElement.addEventListener('keydown', this.handleTriggerEnterKeyDown);
    this.triggerElement.addEventListener('keyup', this.handleTriggerEnterKeyUp);
    this.triggerElement.addEventListener('focusin', this.handleTriggerFocusIn);
    this.triggerElement.addEventListener('focusout', this.handleTriggerFocusOut);
    this.dropdownElement.addEventListener('focusout', this.handleDropdownFocusOut);
  }

  handleTriggerClick(event) {
    event.preventDefault();
    this.expand();
  }

  handleDocumentClick(event) {
    // if trigger was clicked, do nothing
    if (this.triggerElement.contains(event.target)) return;
    // if dropdown was clicked, do nothing
    if (this.dropdownElement.contains(event.target)) return;
    this.collapse();
  }

  handleTriggerSpaceKeyDown(event) {
    if (!isSpaceKey(event)) return;
    this.expand();
  }

  handleTriggerEnterKeyDown(event) {
    if (!isEnterKey(event)) return;
    this.activateTrigger();
  }

  handleTriggerEnterKeyUp(event) {
    if (!isEnterKey(event)) return;
    this.deactivateTrigger();
  }

  handleDocumentEscapeKeyDown(event) {
    if (!isEscapeKey(event)) return;
    this.collapse();
    // Prevents loss of focus after menu is collapsed
    this.triggerElement.focus();
  }

  handleTriggerFocusIn(event) {
    // if focus was gained programmatically, do nothing
    if (!event.relatedTarget) return;
    // if focus was gained from dropdown, do nothing
    if (this.dropdownElement.contains(event.relatedTarget)) return;
    this.expand();
  }

  handleTriggerFocusOut(event) {
    // if focus was lost due to clicking outside, do nothing
    if (!event.relatedTarget) return;
    // if focus moved to dropdown, do nothing
    if (this.dropdownElement.contains(event.relatedTarget)) return;
    this.collapse();
  }

  handleDropdownFocusOut(event) {
    // if focus was lost due to clicking outside, do nothing
    if (!event.relatedTarget) return;
    // if focus is inside dropdown, do nothing
    if (this.dropdownElement.contains(event.relatedTarget)) return;
    this.collapse();
  }
}