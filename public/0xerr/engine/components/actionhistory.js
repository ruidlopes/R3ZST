class ActionHistoryComponent {
  constructor(history = []) {
    this.history = history;
    this.cursor = this.history.length - 1;
  }
}

export {ActionHistoryComponent};