# teevittie
Your personal drop in streaming service.


  [![NPM Version][npm-version-image]][npm-url]
  [![NPM Downloads][npm-downloads-image]][npm-downloads-url]

Imagine you have a perfectly **LEGALLY** downloaded folder with loads of video files organised like so:

```
Downloads
├── Show 5d41ga
│   ├── Season 1
│   │   └── Episode 06m30g s01e1.mp4
│   └── Season 2
│       ├── Episode dhrnbt s02e1.mp4
│       ├── Episode g0qsik s02e3.mp4
│       └── Episode khnw5u s02e2.mp4
├── Show i4i7z
│   ├── Season 1
│   │   ├── Episode 20fj1k s01e2.mp4
│   │   └── Episode 315c62 s01e1.mp4
│   └── Season 2
│       ├── Episode 21m1nu s02e3.mp4
│       ├── Episode sxqmjic s02e1.mp4
│       └── Episode xpfaoc s02e2.mp4
├── Show uhhcvo
│   ├── Season 1
│   │   └── Episode rk0v56 s01e1.mp4
│   └── Season 2
│       ├── Episode 63wiv s02e1.mp4
│       └── Episode nofx2 s02e2.mp4
```

Wouldnt it be nice to go something like
```
teevittie Downloads/
```

and get something like
![image](https://user-images.githubusercontent.com/248805/188669381-9d895727-f284-4864-97b7-b4b18073851d.png)

well with `teevittie` you can.

## How to Install
```
npm install -g teevittie
```

## Usage
```
teevittie path/to/folder
```

then follow the instructions on the cli.

Other arguments:

```
    --folder  - specify catalog folder ( --folder='Documents/)', if none passes it will be using current folder.

    --port    - specify the port, default ${DEFAULT_PORT}, ( --port=3030 ).

    --browser - open the browser automatically (on if no folder specified).

    -v        - it will show you the version of teevittie.

    -h        - shows this help.
```

### Screen Recording
[![TeeYT](https://user-images.githubusercontent.com/248805/188894180-08ee0462-7104-47c7-a212-e37bf1a036c3.png)](https://youtu.be/zr9qo2cx35k)


### Features
1. Storing History so you can pick where you left
2. Suggesting the next episode once finished
3. Open browser and current folder if dropped in into a single folder (useful for an exe pack)



[npm-version-image]: https://badgen.net/npm/v/teevittie
[npm-url]: https://npmjs.org/package/teevittie
[npm-downloads-url]: https://npmcharts.com/compare/teevittie?minimal=true
[npm-downloads-image]: https://badgen.net/npm/dm/teevittie