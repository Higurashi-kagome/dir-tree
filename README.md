<h2 align="center">Dir Tree</h2>

<p align = "center"><strong>A VS Code extension for generating directory tree.</strong></p>

## Features

Use it by right clicking on a folder：

![demo1](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/demo1.gif)

Or entering `Generate directory tree` in the Command Palette：

![demo2](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/demo2.gif)

And you can：

- Exclude / Include folders or files by clicking the checkbox on the side of the panel.
- Hide / Display icons of the tree by clicking the checkbox on the top of the tree text.
- Choose different tree styles from the menu of options.

![demo3](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/demo3.gif)

## Extension Settings

![settings](https://github.com/Higurashi-kagome/dir-tree/raw/main/res/README/settings.png)

- Check the **Add Icon** option when you wanna add icons in the tree by default.
- Check the **Load Gitignore** option when you wanna exclude files and folders by parsing `.gitignore` file.
- Choose default tree style from the **Tree Style** menu.
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

[openmynet/dir-tree-generator](https://github.com/openmynet/dir-tree-generator)

[d-koppenhagen/vscode-file-tree-to-text-generator](https://github.com/d-koppenhagen/vscode-file-tree-to-text-generator)

And there are some similar extensions which are not open-source nowadays：

[file-tree-generator ](https://marketplace.visualstudio.com/items?itemName=Shinotatwu-DS.file-tree-generator)

[Directory-tree generator](https://marketplace.visualstudio.com/items?itemName=yarimit.directory-configuration-generator)

*Note*：Dir Tree is improved on the basis of [file-tree-generator ](https://marketplace.visualstudio.com/items?itemName=Shinotatwu-DS.file-tree-generator).

## License

MIT