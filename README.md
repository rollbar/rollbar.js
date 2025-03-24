<p align="center">
  <img alt="rollbar-logo" src="https://user-images.githubusercontent.com/3300063/207964480-54eda665-d6fe-4527-ba51-b0ab3f41f10b.png" />
</p>

<h1 align="center">Rollbar.js</h1>

<p align="center">
  <strong>Proactively discover, predict, and resolve errors in real-time with <a href="https://rollbar.com">Rollbar’s</a> error monitoring platform. <a href="https://rollbar.com/signup/">Start tracking errors today</a>!</strong>
</p>

![Build Status](https://github.com/rollbar/rollbar.js/workflows/Rollbar.js%20CI/badge.svg?tag=latest)
[![Code Quality: Javascript](https://img.shields.io/lgtm/grade/javascript/g/rollbar/rollbar.js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/rollbar/rollbar.js/context:javascript)
[![Total Alerts](https://img.shields.io/lgtm/alerts/g/rollbar/rollbar.js.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/rollbar/rollbar.js/alerts)

---

## Key benefits of using Rollbar.js are:

- **Cross platform:** Rollbar.js supports both server-side and client-side Javascript, including frameworks such as <a href="https://docs.rollbar.com/docs/react-ts">React</a>, <a href="https://docs.rollbar.com/docs/angular">Angular</a>, <a href="https://docs.rollbar.com/docs/nodejs#using-express">Express</a>, <a href="https://docs.rollbar.com/docs/nextjs">Next.js</a> and more.
- **Telemetry:** The telemetry timeline provides a list of “breadcrumbs” events that can help developers understand and fix problems in their client-side javascript. <a href="https://docs.rollbar.com/docs/rollbarjs-telemetry">Learn more about telemetry</a>.
- **Automatic error grouping:** Rollbar aggregates Occurrences caused by the same error into Items that represent application issues. <a href="https://docs.rollbar.com/docs/grouping-occurrences">Learn more about reducing log noise</a>.
- **Advanced search:** Filter items by many different properties. <a href="https://docs.rollbar.com/docs/search-items">Learn more about search</a>.
- **Customizable notifications:** Rollbar supports several messaging and incident management tools where your team can get notified about errors and important events by real-time alerts. <a href="https://docs.rollbar.com/docs/notifications">Learn more about Rollbar notifications</a>.

## Setup Instructions

1. [Sign up for a Rollbar account](https://rollbar.com/signup).
2. For client-side Javascript, follow the [Browser Quick Start](https://docs.rollbar.com/docs/javascript#section-quick-start-browser) instructions. For Node.js, follow the [Server Quick Start](https://docs.rollbar.com/docs/javascript#section-quick-start-server).

## Usage and Reference

For complete usage instructions and configuration reference, see our [Javascript SDK docs](https://docs.rollbar.com/docs/javascript).

## Release History & Changelog

See our [Releases](https://github.com/rollbar/rollbar.js/releases) page for a list of all releases, including changes.

## Help / Support

If you run into any issues, please email us at [support@rollbar.com](mailto:support@rollbar.com).

For bug reports, please [open an issue on GitHub](https://github.com/rollbar/rollbar.js/issues/new).

## Developing

To set up a development environment, you'll need Node.js and npm.

2. `npm install -D`
3. `make`

To run the tests, run `make test`.

## Contributing

1. [Fork it](https://github.com/rollbar/rollbar.js).
2. Create your feature branch (`git checkout -b my-new-feature`).
3. Commit your changes (`git commit -am 'Added some feature'`).
4. Push to the branch (`git push origin my-new-feature`).
5. Create a new Pull Request.
