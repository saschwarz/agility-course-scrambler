This is a demo application for my Introduction to Ionic presentation. The application generates and displays jump layout sequences for the sport of [Dog Agility](http://agilitynerd.com/). The native shake API is used to change sequences when the device is moved. See the list of tagged revisions for all the demonstrated features.

![Logo](./src/assets/logo-labeled.svg | width=300)

The app is built up from an Ionic starter template and includes tagged revisions for each step in the slides:

- Theme styling.
- Adding custom icons/splashscreens/favicons.
- Converting from tabbed to split pane layout.
- Adding a provider for dog agility domain models and components to render those models as SVG.
- Adding native shake itegration to modify the model.
- Adding a master list page with save/delete and sliding menu on the master list items. Add Alerts and Toasts.
- Adding Progressive Web App (PWA) support.
- Adding persistence via Ionic Storage.

Here's the rest of the presentation:

- [Slides](https://docs.google.com/presentation/d/1OmABc2JcqsPP3i6Q2EfYat-F6GKqGHjiUE2ywPcB09Q/edit?usp=sharing)
- Video (coming soon)

The application is also hosted from this repository as a Progressive Web App (PWA): [View Demo](https://saschwarz.github.io/agility-course-scrambler/)

To play with this demo check it out and then:

```bash
$ npm install ionic
$ npm install
$ ionic cordova platform add android
$ ionic serve
```

