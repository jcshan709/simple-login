import express = require('express');
import qs = require('qs');
import body_parser = require('body-parser');
import http = require('http');
import page_404 = require('./404/404');
import chalk = require('chalk');
import sqlite3 = require('sqlite3');
import fs = require('fs');
import crypto = require('crypto')
import repl = require('repl')
import process = require('process')

var parser = body_parser.urlencoded({extended: true});
var app = express();
const server = http.createServer(app);
const config = JSON.parse(fs.readFileSync(__dirname + '/config.json').toString('utf8'));

var outfile = config.database.outfile;
var userlist = new sqlite3.Database(outfile);

app.use('/', express.static(__dirname + '/files'));

app.get('/', (req, res) => {
  res.redirect('/files/index.html');
});

app.post('/', parser, (req, res) => {
  let name: string = req.body.name;
  let psw: string = req.body.psw;
  name = crypto.createHash('sha256').update(name + name.length).digest('hex');
  psw = crypto.createHash('sha256').update(psw + psw.length).digest('hex');
  userlist.get(`SELECT * FROM userlist WHERE name=="${name}";`, (err: Error, row: any) => {
    if (row == null) {
      userlist.run(`INSERT INTO userlist (name,password) VALUES ("${name}","${psw}");`);
      res.send("<h1 style='text-align: center'>Registered successfully!</h1>");
      return;
    }
    if (row.password == psw) {
      res.send("<h1 style='text-align: center'>Logged successfully!</h1>");
      return;
    }
    res.send("<h1 style='text-align: center'>Wrong password!</h1>");
    return;
  });
});

app.use('/', page_404);

function mainloop(): void {
  let replServer = repl.start(":");
  replServer.on('exit', () => {
    userlist.close();
    server.close();
    console.log('Exited!');
    process.exit(0);
  });
  replServer.defineCommand('tojson', {
    help: "Read database as JSON",
    action: () => {
      console.log(chalk`{yellow [NOTE]} All data was encrypted by sha256.`);
      userlist.all("SELECT * FROM userlist;", (err, row) => {
        if (row.length > 0) console.log(JSON.stringify(row));
        else console.log(chalk.red("Empty!"));
      });
    }
  });
  replServer.defineCommand('readdb', {
    help: "Read database",
    action: () => {
      console.log(chalk`{yellow [NOTE]} All data was encrypted by sha256.`);
      userlist.all("SELECT * FROM userlist;", (err, row) => {
        if (row.length > 0) {
          row.forEach(user => {
            console.log(`name: ${user.name}\npassword: ${user.password}`);
            console.log('------------------------------');
          });
        }
        else console.log(chalk.red("Empty!"));
      });
    }
  });
  replServer.defineCommand('cleardb', {
    help: "Clear all data in database",
    action: () => {
      userlist.run("DELETE FROM userlist;");
      console.log(chalk`{yellow [NOTE]} Cleared!`);
    }
  });
  replServer.defineCommand('rundb', {
    help: "Run a SQL command",
    action: (command: string) => {
      userlist.all(command, (err, row) => {
        if (err != null) { console.log(`${err.name}\n${err.message}`); return; }
        else if (row.length > 0) console.log(JSON.stringify(row));
        console.log(chalk`{greenBright Done!}`);
        return;
      })
    }
  });
  replServer.displayPrompt();
}

server.listen(config.server.port, config.server.host, () => {

  userlist.get('SELECT * FROM userlist;', (err: Error) => {
    if (err != null) userlist.run('CREATE TABLE userlist\n\
(\n\
id INTEGER NOT NULL PRIMARY KEY,\n\
name TEXT NOT NULL,\n\
password TEXT NOT NULL\n\
);');
  });

  console.log(`Listening...`);
  console.log(chalk`Address: {blue.underline http://${config.server.host == "0.0.0.0" ? "127.0.0.1" : config.server.host}:${config.server.port}/}`);

  mainloop();
})
