# Death Whimsy Progress Site
This is a site to track the development progress of a few friends' upcoming game,
[Death Whimsy](http://www.squidtankgames.com/). It's meant to show visual progress of the game, rather than just
showing boring progress bars.

Some fun stuff:
- This whole project uses promises instead of callbacks. Working with Koa was pretty interesting given that it's using
  features in ES6 that are not yet finalized (generators), and Koa is much less popular than Express right now. It
  may be possible to use generators in Express to get the benefits of coroutines, but it may also
  not be worth it.
- The timelapse video on the 'art' page will autoplay in everything, including iOS Safari. Hint: at smaller screens,
  it's not really a video! It's <534KB, loaded async (of course), so it's mostly reasonable for mobile connections.
  It may be possible to cut that down to 1/4 to 1/3 the size, but also much more difficult.
- The page-sized carousel is almost pure CSS. This eliminated nearly all layout problems I've had with JS carousels in
  the past, at the expense of not being able to dynamically change the number of slides (not a requirement for this
  site). Works really well cross-browser, too. The concept is from [here](http://csscience.com/responsiveslidercss3/).

There's a preview available at Heroku - [Death Whimsy Progress](http://death-whimsy-roadmap.herokuapp.com) - as some
data / assets are not yet ready for this site's release.

(Note: This is hosted on a free Heroku dyno until release, so it may take 30s-1m for the initial load).

# Template Project
See [Koangulpitestify](http://www.github.com/threehams/koangulpitestify) for the template this project is based on. 