#!/usr/bin/env node

/**
 * 
 * @author Debapriya Majumder
 * 
 */

const path = require('path');
const fs = require('fs');
const makeDir = require('make-dir');
const low = require('lowdb');
const FileSync = require('lowdb/adapters/FileSync');
const alert = require('terminal-alerts');
const chalk = require('chalk');

const init = require('./utils/init');
const cli = require('./utils/cli');
const log = require('./utils/log');
const ask = require('./utils/ask');
const select = require('./utils/select');

const dbPath = path.join(process.cwd(),`.todo/todos.json`);

const input = cli.input;
const flags = cli.flags;

const { clear , debug } = flags;


(async () => {

    init({clear});
    input.includes(`help`) && cli.showHelp(0);

    if(!fs.existsSync(dbPath)){
        await makeDir(`.todo`);
        process.chdir(`.todo`);
        fs.writeFileSync('todos.json',`{}`);
    }

    const adapter = new FileSync(dbPath);
    const db = low(adapter);

    db.defaults({ todos : [] }).write();

    // COMMAND : todo view and todo ls

    if(input.includes(`view`) || input.includes(`ls`)){
        const allTodos = db.get(`todos`).value();
        allTodos.map((todo,i) => console.log(`${chalk.dim(`${++i} :`)} ${todo.title}`));
        console.log(`\n${chalk.hex(`#fad000`).inverse(` TOTAL `)} ${allTodos.length} tasks\n`);
    }

    // COMMAND : todo add

    if(input.includes(`add`)){
        const todo = await ask({message : `Add a todo `});
        db.get(`todos`).push({ title : todo }).write();
        alert({
            type : `success`,
            name : ` ADDED `,
            msg : `Successfully`
        });
    }

    // COMMAND : todo del

    if(input.includes(`del`)){
        const allTodos = db.get(`todos`).value();
        const toDels = await select({
            choices: allTodos,
            message : `Finish todos :` 
        });
        toDels.map(todoTitle => db.get(`todos`).remove({title : todoTitle}).write());
        alert({
            type: `success`,
            name: `FINISHED`,
            msg : `${toDels.length} todos`
        });
    }


    debug && log(flags);

})();