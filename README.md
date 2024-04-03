
## Features

### View PDFs

![<img src="readme/view_pdfs.png">](readme/view_pdfs.png)

### Fill PDF forms

![<img src="readme/fill_forms.png">](readme/fill_forms.png)

### Insert text

![<img src="readme/insert_text.png">](readme/insert_text.png)

### Insert images

![<img src="readme/insert_images.png">](readme/insert_images.png)

### Rotate PDFs

![<img src="readme/rotate_pdfs.png">](readme/rotate_pdfs.png)

## Future features

- Create your own signature within the tool
- Ability to insert symbols
- Ability to rearrange and insert pages
- Support for non-latin characters

## Technologies used

- Written in [TypeScript](https://www.typescriptlang.org/)
- Bundled with [Webpack](https://webpack.js.org/)
- PDFs rendered using [PDF.js](https://mozilla.github.io/pdf.js/)
- PDFs edited using [pdf-lib](https://github.com/Hopding/pdf-lib)
- Developed on [Visual Studio Code](https://code.visualstudio.com/)
- Code formatted with [Prettier](https://prettier.io/)

## Building instructions

1. Clone the repo
2. Run `npm install` to install all dependencies
3. Run `npm run build` to compile the source code into a JS bundle file
4. To use the tool from your browser, start a server from the root project directory, for example by running `python -m http.server` which makes the tool accessible on port 8000.
5. In your browser go to `localhost:8000`

## License

PrivatePDF is [MIT licensed](LICENSE).
