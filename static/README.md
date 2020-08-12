These files are meant as a way to develop and test the River client-side library.

---

If you make any change to these files, you should use [browserify](https://www.npmjs.com/package/browserify) to bundle the app and its dependencies:

```
browserify app.js > bundle.js
```

In this case, `app.js` is the entry point. Local files and module paths can be included with the `require` syntax. Browserify will recursively analyze all the `require()` calls in order to build a bundle you can serve up to the browser in a single `<script>` tag.
