class TextInputComponent {
  constructor(prompt = '', text = '', cursor = 0) {
    this.prompt = prompt;
    this.text = text;
    this.cursor = cursor;
  }
}

export {TextInputComponent};