class ReactiveComponent extends HTMLElement {
  constructor() {
    super();

    this._caller = this.getAttribute("host__element");
    this.removeAttribute("host__element");

    this._componentName = this.constructor.name;
    this._observers = new Map();

    assignComponentIdToElement(this);

    this.__componentKey = `${this.constructor?.name}${this.__componentId}`;
  }

  connectedCallback() {
    console.log(`${this._componentName} connected`);
    this.__root = this.shadowRoot ?? this.getRootNode();
    if (this._caller) this._caller = this.__root.host.__componentKey;
  }

  observeState(property) {
    this.__propertyName = property;
    const [addObserver, removeObserver] = useObserver(
      this._caller ?? this.__componentKey,
      property,
    );

    if (this._observers.has(property)) {
      const oldRemove = this._observers.get(property);
      oldRemove?.(this);
    }

    addObserver(this);
    this._observers.set(property, removeObserver);
  }

  state(property, initialValue) {
    this.observeState(property);
    return useState(
      this._caller ?? this.__componentKey,
      property,
      initialValue,
    );
  }

  stateChange(updatedState) {
    if (typeof this.onStateChange === "function") {
      this.onStateChange(updatedState);
    } else {
      console.warn(
        `[${this._caller ?? this.__componentKey}] onStateChange not implemented for:`,
        this.__propertyName,
      );
    }
  }

  disconnectedCallback() {
    for (const remove of this._observers.values()) {
      remove?.(this);
    }
    this._observers.clear();
  }
}
