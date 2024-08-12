# Stepful scheduling app

The app is built with NextJS, with a mongodb database and [mongoose](https://mongoosejs.com/) for object modeling. The UI is built with the [mantine](https://mantine.dev/) component library, which is responsible for a lot of the app's look and feel. The main schedule view uses a calendar built with [fullcalendar](https://fullcalendar.io/).

The app is primarily one screen, the schedule view, where the user can view events, coaches can create availabilities and complete booked events, and students can book events. There is also a very sparse review listings page where coaches can view all their past reviews.

Right now, we're assuming that coaches will avoid overbooking themselves, since we don't do any validation to prevent overlapping availability blocks. This kind of validation would probably be the first big UX improvement, although it would also likely be fairly complex.

## Improvements

- Validate that event times don't overlap
- Animations from sidebar don't play nice with fullcalendar for some reason
- Fullcalendar default buttons don't match mantine button styles
- Review list page is very sparse and boring
