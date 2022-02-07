import * as os from "os";
import * as fs from "fs";
import * as dotenv from "dotenv";

export default () => {
  if (fs.existsSync(".env")) {
    console.log(dotenv.parse(fs.readFileSync(".env")));
    return dotenv.parse(fs.readFileSync(".env"));
  } else {
    return dotenv.parse(
      process.argv
        .slice(2)
        .map((v) => v.slice(2)) // starts with --
        .join(os.EOL),
    );
  }
};
