#/usr/bin/bash
mkdir -p .mock/{.inbox,Users}
mkdir -p .mock/Users/jz/Applications/logseq/{assets,draws,journals,logseq,pages}
touch .mock/.inbox/settings.json

echo '{
  "app": {
    "name": "inbox"
  },
  "backend": {
    "db_database": ".mock/.inbox/dev_db",
    "db_type": "sql.js",
    "host": "127.0.0.1",
    "port": "31312",
    "jwt_expires": "30d",
    "jwt_secret": "helloworld"
  },
  "device": {
    "document_dir": ".mock/Users/jz/Documents/",
    "user_dir": ".mock/Users/jz/"
  },
  "logseq": {
    "root": ".mock/Users/jz/Applications/logseq"
  }
}' > .mock/.inbox/settings.json
