# exif-resolution

A lil’ script to scale images for the web using EXIF.

Requires [exiftool](https://exiftool.org).

## Usage

### Target dimensions

```
% node exif-resolution img.jpg 400x300
```

No matter *what* `img.jpg`’s actual pixel dimensions are, this will set its [Exif][] metadata [in such a way][] that browsers (well, [some browsers](https://wpt.fyi/results/density-size-correction?label=experimental&label=master&aligned)) will give it an [intrinsic size][] of 400-`px`-wide and 300-`px`-tall.


### Target density

```
% node exif-resolution img.jpg 2x
```
You can also just give the script an image density. For example, if `img.jpg` is 800 × 600, this command is equivalent to the previous one. Both will cause browsers to give the image a [`.naturalWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth) of 400, a [`.naturalHeight`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalHeight) of 300, and an intrinsic density of 2x.


[Exif]: https://en.wikipedia.org/wiki/Exif
[intrinsic size]: https://developer.mozilla.org/en-US/docs/Glossary/Intrinsic_Size
[in such a way]: https://github.com/whatwg/html/pull/5574
[image density]: https://html.spec.whatwg.org/multipage/images.html#pixel-density-descriptor
