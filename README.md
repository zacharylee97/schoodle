# Node Skeleton

## Getting Started

1. Create the `.env` by using `.env.example` as a reference: `cp .env.example .env`
2. Update the .env file with your correct local information
3. Install dependencies: `npm i`
4. Fix to binaries for sass: `npm rebuild node-sass`
5. Run migrations: `npm run knex migrate:latest`
  - Check the migrations folder to see what gets created in the DB
6. Run the seed: `npm run knex seed:run`
  - Check the seeds file to see what gets seeded in the DB
7. Run the server: `npm run local`
8. Visit `http://localhost:8080/`

## Functionnalities to Implement
* visitors can create an event proposal in much the same way as Doodle, by specifying:
  * event title and description
  * their own name and email
* organizers can then send the unique URL to possible attendees via their own communication workflow (email, Slack, Messenger, etc.)
* attendees visit the unique URL and:
  * specify their name and email
  * specify their availability (yes/no only) for each possible time slot
  * view all responses including their own
  * modify their response
* the unique URL should be secret and thus not use a simple auto-incrementing integer but instead a larger ID that is harder to guess (much like how secret gists work on GitHub)
* note: this app does not follow the typical user authentication process: users don't need to register or log in and the only way to access the Schoodles is via links


## Dependencies

- Node 5.10.x or above
- NPM 3.8.x or above
