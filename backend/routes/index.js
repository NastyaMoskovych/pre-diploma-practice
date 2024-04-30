const fs = require('fs');

module.exports = function(app) {
    function isFolder(path) {
        return fs.lstatSync(path).isDirectory() && fs.existsSync(path);
    }

    app.get('/', (req, res) => {
        const base = './IT/';
        let path = '';

        if('path' in req.query) {
            path = req.query.path;
        }

        if(isFolder(base + path)) {
            let files = fs.readdirSync(base + path).filter(item => !(/(^|\/)\.[^\/\.]/g).test(item)).map(item => {
                const isDirectory = fs.lstatSync(base + path + '/' + item).isDirectory();
                let size = 0;
                if(!isDirectory) {
                    size = fs.statSync(base + path + '/' + item);
                }

                return {
                    name: item,
                    directory: isDirectory,
                    size: size.size ?? 0
                }
            }).sort((a, b) => {
                if (a.directory !== b.directory) {
                    return b.directory - a.directory;
                } else {
                    return a.name.localeCompare(b.name);
                }
            });
            res.json({
                path: path,
                result: true,
                files: files
            });
        }
    });
}
