# tmplt

A basic templating utility for html files.

## installation

0. clone repo.
1. put in desired directory.
2. add `alias tmplt="path-to-tmplt/main.js"` to your aliases.

## usage

### Templates

The basic use case is to help split an html file into landmark components.

For example, insert the main site header into each webpage

Components are inserted as a modified comment syntax:

`<!--% <file-path> /%-->`

example:

`index.tmplt`
```html
<html>
  ...
  <body>
    <!-- inserts a header component -->
    <!--% ../components/site-header.tmplt /%-->

    <main>
      ...
    </main>

    <!-- inserts a footer component -->
    <!--% ../components/site-footer.tmplt /%-->

  </body>
</html>
```

### Executing javascript

Sometimes you might need to execute code. This is done inline without a comment:

`{% code /%}`

example:

`site-header.tmplt`
```html
<nav>
  <ul>
    <li>
      <a
        {% currentPage === 'awesome-page.tmplt' ? 'class="current-page"' : ''/%}
        href="./awesome-page.html"
      >Awesome Page</a>
    </li>
    <li>
      <a
        {% currentPage === 'contact.tmplt' ? 'class="current-page"' : '' /%}
        href="./contact.html"
      >Contact</a>
    </li>
  </ul>
</nav>
```

more about `currentPage` below...

### keywords

currently tmplt has one keyword: `currentPage`.

This allows your executed code to see which file is currently being processed.

I added this, specifically so I could add the `current-page` class to navigation links. You might find other use cases. 🤷


### Processing files

To make `.tmplt` files into `.html` files, just run a command in your terminal.

#### Order of operations...

when processing a file, tmplt gathers all component comments *in that file*. It then replaces them one by one &mdash; in the order they appear &mdash; with the component's contents.

***❕Note: tmplt can't replace deeply nested components (yet).***

from this...
```html
<html>
  <body>
    <!--% ../components/header.tmplt /%-->

    ...

    <!--% ../components/footer.html /%-->

    ...

  </body>
</html>
```
...to this...
```html
<html>
  <body>
    <header>
      <h1>My Awesome Site</h1>
      <nav>
        <ul>
          <li>
            <a
              {% currentPage === 'awesome-page.tmplt' ? 'class="current-page"' : ''/%}
              href="./awesome-page.html"
            >Awesome Page</a>
          </li>
          <li>
            <a
              {% currentPage === 'contact.tmplt' ? 'class="current-page"' : '' /%}
              href="./awesome-page.html"
            >Contact</a>
          </li>
        </ul>
      </nav>
    </header>

    ...

    <footer>
      ©️ A. Smithee
    </footer>
    ...
  </body>
</html>
```

`tmplt` will then execute any code...

`currentPage = awesome-page.tmplt`
```html
<html>

  ...

    <nav>
      ...
        <a
          class="current-page"
          href="./awesome-page.html"
        >Awesome Page</a>
      ...
        <a

          href="./contact.html"
        >Contact</a>
    ...
  </header>

  ...

</html>
```

### Processing Single files

tmplt can process files one by one:

#### `$ tmplt <input_file> <output_file>`

Process `<input_file>` and save as `<output_file>`

##### example:

```sh
~/website/my-awesome-website $ ls
>> templates/

~/website/my-awesome-website $ tmplt ./templates/index.tmplt ./index.html
>> #...

~/website/my-awesome-website $ ls
>> templates/ index.html

```

### Processing Directories

tmplt can also process all `.tmplt` files in a given directory:

#### `$ tmplt <input_path>`

iterate through `<input_path>` and output files to current dir

##### example:

```sh
~/website/my-awesome-website $ ls
>> templates/

~/website/my-awesome-website $ ls ./templates
>> index.tmplt about.tmplt contact.tmplt

~/website/my-awesome-website $ tmplt ./templates
>> # ...

~/website/my-awesome-website $ ls ./
>> templates/ index.html about.html contact.html
```
#### `$ tmplt <input_path> <output_path>`

iterate through `<input_path>` and output files to `<output_path>`

##### example

```sh
~/website/my-awesome-website $ ls
>> templates/ html/

~/website/my-awesome-website $ ls ./templates
>> index.tmplt about.tmplt contact.tmplt

~/website/my-awesome-website $ tmplt ./templates ./html
>> # ...

~/website/my-awesome-website $ ls ./html
>> index.html about.html contact.html
```

## But why make another mustache/handlebars/EJS/etc...?

Because I wanted to learn more node.js.

Also, it scratched an itch for a temporary, static, folio site.

## road map

1. **deeply render files**

    tmplt is only simple. It only renders a direct component.
    So if your header has a component, it'll render as an html comment.

2. **option for batching files**

    `tmplt --batch ./templates/index.tmplt ./templates/about.tmplt ./`

3. **option for custom file extension on output**

    `tmplt --ext .xml ./templates ./xml`

4. **properly split code into something resembling MVC**

## known bugs

rendering components only goes 1 level deep.

## Can you add 𝐱?

Probably not.  Sorry. This is just a muck-around/learning project that scratched an itch for a temporary folio site.

Maybe if it's an interesting feature that would help me.

Feel free to fork it if you want. node is useful to learn ;)


## I found bugs!

You probably did. It's a WIP. Make an issue if you want. I might get to it? 👆 See above 👆

