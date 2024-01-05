import { v4 as uuidv4 } from 'uuid';

export { Post, postReviver };

// reviver function to revive the objects from the JSON file back into instances of Post
function postReviver(key, value) {
  if (value?.title && value?.body && value?.uuid && value?.date)
    return new Post(value.title, value.body, value.uuid, value.date);
  return value;
}

// Class for holding posts
class Post {
  #title;

  #body;

  #uuid;

  #date;

  constructor(
    title,
    body,
    uuid = uuidv4(),
    date = new Date().toLocaleString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }),
  ) {
    this.#title = title;
    this.#body = body;
    this.#uuid = uuid;
    this.#date = date;
  }

  get title() {
    return this.#title;
  }

  get body() {
    return this.#body;
  }

  get uuid() {
    return this.#uuid;
  }

  get date() {
    return this.#date;
  }

  setTitle(title) {
    this.#title = title;
  }

  setBody(body) {
    this.#body = body;
  }

  toJSON() {
    return {
      title: this.#title,
      body: this.#body,
      uuid: this.#uuid,
      date: this.#date,
    };
  }

  toString() {
    return `Title: ${this.title}, Body: ${this.body}, ID: ${this.uuid}, Date: ${this.date}`;
  }
}
