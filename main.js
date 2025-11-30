const path = require("path");
const fs = require("fs");
const os = require("os");
const EventEmitter = require("events");

// Question 1: Log current file path and directory 
//console.log({ File: __filename, Dir: __dirname });

// Question 2: Get file name from path 
//console.log(path.basename("/user/files/report.pdf"));

// Question 3: Build path from object
//console.log(path.format({ dir: "/folder", name: "app", ext: ".js" }));

// Question 4: Get file extension 
// console.log(path.extname('/docs/readme.md'));

// Question 5: Parse path and return name and extension 
// const parsed = path.parse('/home/app/main.js');
// console.log({ Name: parsed.name, Ext: parsed.ext });

// Question 6: Check if path is absolute 
// console.log(path.isAbsolute('/home/user/file.txt'));

// Question 7: Join multiple segments 
// console.log(path.join('src', 'components', 'App.js'));

// Question 8: Resolve relative path to absolute 
// console.log(path.resolve('./index.js'));

//  Question 9: Join two paths 
// console.log(path.join('/folder1', 'folder2/file.txt'));

//  Question 10: Delete file asynchronously 
// const filePath = '/path/to/file.txt';
// fs.promises.unlink(filePath)
//   .then(() => {
//     const fileName = path.basename(filePath);
//     console.log(`The ${fileName} is deleted.`);
//   })
//   .catch(error => console.error('Error:', error.message));

//  Question 11: Create folder synchronously 
// try {
//   fs.mkdirSync('./newFolder', { recursive: true });
//   console.log('Success');
// } catch (error) {
//   console.error('Error:', error.message);
// }

//  Question 12: Event emitter for "start" event 
// const emitter = new EventEmitter();
// emitter.on('start', () => {
//   console.log('Welcome event triggered!');
// });
// emitter.emit('start');

//  Question 13: Emit custom "login" event with username 
// const loginEmitter = new EventEmitter();
// loginEmitter.on('login', (username) => {
//   console.log(`User logged in: ${username}`);
// });
// loginEmitter.emit('login', 'Ahmed');

//  Question 14: Read file synchronously 
// try {
//   const content = fs.readFileSync('./notes.txt', 'utf8');
//   console.log(content);
// } catch (error) {
//   console.error('Error:', error.message);
// }

//  Question 15: Write to file asynchronously 
// fs.promises.writeFile('./async.txt', 'Async save', 'utf8')
//   .then(() => console.log('File written successfully'))
//   .catch(error => console.error('Error:', error.message));

// Question 16: Check if directory exists 
// console.log(fs.existsSync('./notes.txt'));

// ========== Question 17: Get OS platform and CPU architecture ==========
// console.log({ Platform: os.platform(), Arch: os.arch() });

