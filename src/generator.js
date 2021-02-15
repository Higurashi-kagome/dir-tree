const path = require('path');
const fs = require('fs');
const gitignoreParser = require('./gitignore-parser');
const vscode = require('vscode');

class DirTreeGenerator{
	constructor(config, uri){
        this.uri = uri;
		this.config = config;
        this.workspaceFolderPath = vscode.workspace.getWorkspaceFolder(uri).uri.fsPath;
        this.ignore = this.getIgnore();
    }

    getIgnore(){
        let gitignoreContent = '';
        try {
            if(this.config.loadGitignore){
                gitignoreContent = fs.readFileSync(path.resolve(this.workspaceFolderPath, '.gitignore'), 'utf8');
            }
        } catch (error) { console.log(error.message); }
        //Add '\n' at the beginning to avoid splicing together
        gitignoreContent += `\n${this.config.ignore.join('\n')}`;
        let gitignore = gitignoreParser.compile(gitignoreContent);
        return {gitignore: gitignore, fsPath: this.workspaceFolderPath};
    }

    getTreeHtml(){
        let format = function (deps, item, isLast) {
            let pipe = isLast ? `┗ ` : `┣ `;
            let icon = item.type === 'folder' ? '📂' : '📜';
            let checked = item.ignored ? '' : 'checked';
            return `<input type="checkbox" class="ignoreCheckBox" ${checked}>` + 
                `<span class='${item.type}Name'> ${Array(deps).join(`┃ `)}${pipe}` +
                `<span class='icon'>${icon}</span><span class='basename'>${item.basename}</span>` +
                `</span><br>`;
        };
        let basename = path.basename(this.uri.fsPath);
        // Get relativePath of target dir
        let relativePath = path.relative(this.ignore.fsPath, this.uri.fsPath).split(path.sep).join('/');
        let tree = this.generateTree(this.uri.fsPath, 1, false, format);
        let treeHtml = `<input type="checkbox" class="ignoreCheckBox" checked disabled>` +
                `<span class='folderName baseFolderName' relativePath='${relativePath}'>` +
                `<span class='icon'>📦</span><span class='basename'>${basename}</span>` +
                `</span><br><span class='folder'>${tree}</span>`;
		return treeHtml;
    }

	getTreeText(){
        let format = function (deps, item, isLast) {
            let pipe = isLast ? `┗ ` : `┣ `;
            let icon = item.type === 'folder' ? '📂' : '📜';
            return ` ${Array(deps).join(`┃ `)}${pipe}<span class='icon'>${icon}</span>${item.basename}<br>`;
        };
        let basename = path.basename(this.uri.fsPath);
		return `<span class='icon'>📦</span>${basename}<br>${this.generateTree(this.uri.fsPath, 1, true, format)}`;
    }
    
    generateTree(dirFullPath, deps, isOnlyAccept, format) {

        if (!fs.existsSync(dirFullPath)) return console.log(`${dirFullPath}: path dosen't exist.`);
        if (!fs.statSync(dirFullPath).isDirectory()) return console.log(`${dirFullPath}: not a folder.`);
    
        let dirsAndFiles = fs.readdirSync(dirFullPath).reduce((acc, basename)=>{
            let fullPath = path.join(dirFullPath, basename);
            let ignored = this.isIgnored(fullPath);
            if(isOnlyAccept && ignored) return acc;
            let item = { ignored: ignored, fullPath: fullPath, basename: basename };
            if (fs.statSync(fullPath).isDirectory()) {
                item.type = 'folder';
                acc[0].push(item);
            } else {
                item.type = 'file';
                acc[1].push(item);
            }
            return acc;
        }, [[], []]).reduce((acc, curItem)=>{
            return acc.concat(curItem);
        });
    
    
        let tree = dirsAndFiles.reduce((tempTree, item)=>{
            let isLast = dirsAndFiles.indexOf(item) === dirsAndFiles.length - 1;
            tempTree += format(deps, item, isLast);
            if (item.type === 'folder') {
                tempTree += `<span class='folder'>${this.generateTree(item.fullPath, deps+1, isOnlyAccept, format)}</span>`;
            }
            return tempTree;
        },'');
        return tree;
    }

    isIgnored(fullPath){
        function getFilesRelativePathArr(fromPath, dirPath){
            function getFullPathArr(dirPath){
                let list = [];
                let arr = fs.readdirSync(dirPath);
                arr.forEach(function(item){
                    let fullpath = path.join(dirPath,item);
                    let stats = fs.statSync(fullpath);
                    if(stats.isDirectory()){
                        list = list.concat(getFullPathArr(fullpath));
                    }else{
                        list.push(fullpath);
                    }
                });
                return list;
            }
            let fullPathArr = getFullPathArr(dirPath);
            let relativePathArr = fullPathArr.map(function(fullPath){
                return path.relative(fromPath, fullPath).split(path.sep).join('/');
            })
            return relativePathArr;
        }
        if(fs.statSync(fullPath).isDirectory()){
            let relativePathArr = getFilesRelativePathArr(this.ignore.fsPath, fullPath);
            if(relativePathArr.filter(this.ignore.gitignore.accepts).length) return false;
            else return true;
        }else{
            let relativePath = path.relative(this.ignore.fsPath, fullPath).split(path.sep).join('/');
            if(this.ignore.gitignore.accepts(relativePath)) return false;
            else return true;
        }
    }
}

module.exports = DirTreeGenerator;