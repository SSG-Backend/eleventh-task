const path = require("path");
const fs = require("fs");
const file = fs.readFileSync(path.resolve(`${__dirname}/.env`), "utf-8");
const {log} = console;

const turn_off_comments = true;
const _CONFIG = {
  comment(comment, multiline = false) {
    if (multiline) {
      this.comments.multiline.push(comment);
    } else {
      this.comments.single_line.push(comment);
    }
    return this;
  },
  comments: {
    multiline: [],
    single_line: []
  }
};
const ENV = env = envs = ENVIRONMENT = ENVIRONMENT_VARS = CONSTANTS = VARS = _CONFIG;
const CONFIG = {
  ENV,
  envs,
  ENVIRONMENT,
  ENVIRONMENT_VARS,
  CONSTANTS,
  VARS
};
let line_number = 0;
for (line of file.split("\n")) {
  line = line.trim();
  line_number += 1;

  // Collect comments
  if (/^#/.test(line)) {
    if (!turn_off_comments) {
      _CONFIG.comment(line, false);
    }
    continue;
  }

  // Skip empty line
  if (/^\s+$/.test(line) || !line) {
    continue;
  }

  let parts = line.split("=");

  // Discourage multiple asignments
  if (parts.length != 2 || !parts[0].trim()) {
    handle_error("Invalid format", line_number, line);
    return
  }

  let [key, value] = [parts[0].trim(), parts[1].trim()];

  // Support value re-use using the => operator
  if (value in _CONFIG || value.slice(1) in _CONFIG) {
    if (value[0] == ">") {
      value = _CONFIG[value.slice(1)];
    } else {
      const msg = `-----------------------------------------------------------
Did you mean to re-use the value for the constant ${value} on line ${line_number} ?
To re-use it specify ${key}=>${value} instead.

`;
      warn(msg, line_number);
    }
  }

  // Ensure that key is not spaced
  if (/\s/.test(key)) {
    handle_error("A key cannot have paces.", line_number);
    return
  }

  // Perform primary assignments
  try {
    value = eval(value);
  } catch (error) {
    // since eval failed, assignment remains the original value 
  }
  _CONFIG[key] = value;
  CONFIG[key] = value;
  process.env[key] = value;
}

// console.log(CONFIG);

function handle_error(msg, line_number, additional_message = "") {
  console.error(`
      While parsing the .env file on ${path.resolve(".env")}

      ${msg} on line ${line_number}.

      ${additional_message ? "More details: " + additional_message : ""}

      Check and ensure the following:
      * The format is key=value
      * That each key=value pair is specified in a new line
      * That new line does not start with invald characters/numbers
      * That a comment starts with the hash charatcer (#) 
      `);
  process.exit(1);
}
function warn(msg, line_number) {
  msg = `CODE WARNING ON LINE ${line_number}
 ${msg}`;
  console.warn(msg);
}
module.exports = CONFIG;