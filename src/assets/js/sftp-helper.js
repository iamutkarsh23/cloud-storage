let remote = require("electron").remote;

let getDirList = (path) => {
   return remote.getGlobal('SFTP').list(path);
};

module.exports = {
   getDirList: getDirList
};

/* SFTP File JSON
type: (...)
name: (...)
size: (...)
modifyTime: (...)
accessTime: (...)
rights: (...)
   user: "rwx"
   group: "rx"
   other: "rx"
owner: (...)
group: (...)
get type: () => {…}
set type: (value) => {…}
get name: () => {…}
set name: (value) => {…}
get size: () => {…}
set size: (value) => {…}
get modifyTime: () => {…}
set modifyTime: (value) => {…}
get accessTime: () => {…}
set accessTime: (value) => {…}
get rights: () => {…}
set rights: (value) => {…}
get owner: () => {…}
set owner: (value) => {…}
get group: () => {…}
set group: (value) => {…}
*/
