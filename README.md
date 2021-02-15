<h2 align="center"><img src="https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/icon.png" height="128"><br>Dir-tree</h2>

<p align = "center"><strong>A VS Code extension for generating directory tree.</strong></p>

## Features

Use it by right clicking on a folder：

![demo1](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/demo1.gif)

<p align='center'><strong>Right click on a folder</strong></p>

Or entering `Generate directory tree` in the Command Palette：

![demo2](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/demo2.gif)

<p align='center'><strong>Enter command in the Command Palette</strong></p>

And you can：

- Exclude / Include folders or files by clicking the checkbox on the side of the web panel.
- Hide / Display icons of the tree by clicking the checkbox on the top of the tree text.

![demo3](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/demo3.gif)

<p align='center'><strong>Use checkbox</strong></p>

## Extension Settings

<p align = "center"><strong>Settings</strong></p>

![settings](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/settings.png)

- Check **Add Icon** option when you wanna add icons in the tree.

- Check **Load Gitignore** option when you wanna exclude files and folders by `.gitignore` file.

- Use .gitignore pattern to edit **Ignore** config when you wanna exlude files or folders globally：

  ```json
  //settings.json
  "dirTree.ignore": [
      ".git/",
      "node_modules/",
      ".github/",
      "/.eslintrc.json",
      "/package-lock.json"
  ]
  ```

## Known Issues

- It's slow when generating the tree for a directory with a amount of files, you need to wait for a while in this case.
- The .gitignore file in the subfolder will not be parsed. So you might find the patterns of the .gitignore file don't work if you used .gitignore in the subfolders.

## Change Log

[CHANGELOG.md](CHANGELOG.md)

## Similar projects

[zhucyi/project-tree](https://github.com/zhucyi/project-tree)

[XboxYan/tree-generator](https://github.com/XboxYan/tree-generator)

*Note*：This extension is improved on the basis of [file-tree-generator ](https://marketplace.visualstudio.com/items?itemName=Shinotatwu-DS.file-tree-generator).

## License

MIT