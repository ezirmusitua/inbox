import * as os from "os";
import * as fs from "fs";
import * as dotenv from "dotenv";

export default () => {
  if (fs.existsSync(".env")) {
    return dotenv.parse(fs.readFileSync(".env"));
  } else {
    return dotenv.parse(process.argv.slice(2).join(os.EOL));
  }
};
