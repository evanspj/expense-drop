# Expense Drop

A privacy-focused way to review your expenses. All file processing and data stays in your browser. No data is stored on a server. Your important financial data should be for your eyes only.

## Features

- `Privacy` - Everything is done in the browser so you can rest assured that your data stays on your device
- `Organize` - Organized by account type, month and category
- `Visualize` - Beautiful charts will help you visualize your data
- `Minimal Design` - With the minimalist design you're able to focus on what’s important
- `Insights` - Once your data is analyzed and processed, you will quickly be able to pinpoint notable changes to your spending
- `Save For Later` - Save your transactions (encrypted) to your browsers storage to view again later
- `Edit Data` - Make edits to your transactions after your initial file upload
- `Download` - Download your transactions to an excel file to use with the app at another time or save for your records

## File Format

For the app to work correctly, there is a specific format that is required for the excel file. The app expects the first row of the file to contain the headers for each column. The order of the columns does not matter, but the app will pull data from the headers **date**, **description**, **account**, **category**, and **amount** columns. Any other columns you have in your file will be ignored. An error will be displayed if you try to upload a file with them missing. **Column headers need to be capitalized**.

`**NOTE**` Though these headers are not required, if either the "Account" or "Category" value is left blank, it will affect how the data is presented. Ideally, you want to make sure all cell values are filled in.

## FAQ

You can find a number of questions you may have already answered in the [FAQ section](https://expenses-drop.evanspj.com/#faq) of the landing page.

## Run locally on your machine

```bash
$ git clone https://github.com/evanspj/expense-drop.git
$ cd expense-drop
$ yarn
$ yarn dev
```

## License

[MIT License](/LICENSE)
