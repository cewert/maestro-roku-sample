/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable github/array-foreach */
/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs-extra');
const path = require('path');

let bslibPkgPath = '/roku_modules/rokucommunity_bslib/bslib.brs';
const bslibFound = fs.existsSync('src/source' + bslibPkgPath);
if (!bslibFound) {
    throw new Error(`Could not locate bslib @ 'src/source' + ${bslibPkgPath}`);
}

let componentsDir = path.join(__dirname, '..', 'src', 'components', 'roku_modules');

parseFolder(componentsDir);

let sourceDir = path.join(__dirname, '..', 'src', 'source', 'roku_modules');
parseFolder(sourceDir);

function parseFolder(sourceDir) {
    try {
        fs.readdirSync(sourceDir).forEach(file => {
            let filePath = path.join(sourceDir, file);
            let fileStats = fs.statSync(filePath);
            if (fileStats.isDirectory()) {
                parseFolder(filePath);
            } else if (filePath.endsWith('.xml')) {
                let text = fs.readFileSync(filePath, 'utf8');
                let r = /\/roku_modules\/undefined\/bslib\.brs/gim;
                text = text.replace(r, bslibPkgPath);
                r = /\/roku_modules\/bslib\/bslib\.brs/gim;
                text = text.replace(r, bslibPkgPath);
                r = /\/roku_modules\/undefined/gim;
                text = text.replace(r, '/roku_modules/maestro');
                fs.writeFileSync(filePath, text);
                // console.log('fixed', filePath);
            }
        });
    } catch (e) {
        console.log(e);
    }
}
