> Press Cmd+Shift+V to preview markdown
> Get new Access Token https://github.com/settings/tokens/new

#### Run Vite Dev server
- Run: ` npm run dev `

#### Run TS Express server
- Install tsx library: ` npm i -D tsx `
- Run: ` npx tsx ./src/server/server.ts `
- We're running  a specefic file here. In this case it's 'server.ts' so we can run the server.
- Reference: https://stackoverflow.com/a/76343394/6388651



#### Legacy: Run TS Express server with ts-node (no longer used)
- ` ts-node ./src/server/server.ts `

  ##### Add this to your `tsconfig.json`
  ```json
  "ts-node": {
      "esm": true,
      "experimentalSpecifierResolution": "node",
  }
  ```


---

  #### How to view a console.log on server-side 
  - option1: Call the function with the console.log from the server file that has the function or whatever server file that will work.
      - example: `npx tsx ./src/server/file_with_function.ts`
  - option2: Run a jest test that calls the function that contains the console.log.
  - Then Run server
      - The console.log should show in the terminal, right after "Debugger attached." directly after the initial CLI command, if there is no immediate failure.

### Environment Variables
Access syntax
- Frontend: `import.meta.env.YOUR_VARIABLE`
- Server-side: `process.env.YOUR_VARIABLE`

Server-side requires the below code block wherever you are accessing an env variable
- To get the root path use: `process.cwd()`
```javascript
import * as dotenv from "dotenv";
// use if .env is in root folder
dotenv.config();
// Use if .env file is in a child folder of root
dotenv.config({ path: process.cwd() + '/.env' });
```
- Reference: https://stackoverflow.com/a/62288163/6388651

**How to prevent Type errors in process.env variables**
- All process.env variable types are strings by defualt
- You must change type manually if required
    - e.g. `parseInt(process.env.PGPORT || "", 10)`
- Reference: https://stackoverflow.com/a/58700067/6388651

#### How to allow two types
- eg. `token: string | CustomJwtPayload;`
- Do an initial type check
```javascript
  if (typeof token === "string") {
      response.status(500).send('Token is invalid');
    } else {
      // add code if type is 'CustomJwtPayload'
  }
```

#### JWT verify
- Reference: https://github.com/auth0/node-jsonwebtoken/issues/757#issuecomment-1435836445


## Prisma
##### Dependencies
- run: `npm install @prisma/client`
  - install prisma client to enable query creation from your files
##### Migrate
- run: `npx prisma migrate dev --name init`
  - Create or Update the db tables defined in the schema.prisma file
  - maps your data model to the database schema
- run: `npx prisma migrate reset`
  - Drops the database/schema¹ if possible, or performs a soft reset if the environment does not allow deleting databases/schemas¹
  - Creates a new database/schema¹ with the same name if the database/schema¹ was dropped
  - Applies all migrations
  - Runs seed scripts
##### Seed
- install tsx (if not installed): `npm install tsx`
- in package.json add:
```python
# you can remove 'NODE_ENV=development' if it's declared already in .env file
{
  "scripts": {
    "db-seed": "NODE_ENV=development prisma db seed"
  },
  "prisma": {
    "seed": "tsx prisma/seed.ts"
  }
}
```
- Then run
  - `npm run db-seed`
- Reference: https://github.com/prisma/prisma/discussions/20369#discussioncomment-7637038
##### Command to Clear DB and Re-Seed
- `npx prisma db push --force-reset && npm run db-seed`
##### Database UI
- run: `npx prisma studio`
  - Launch the db view UI in a browser window
  - Browse or edit table data through UI
- Prefix table names: `select * from public."Listing"`
  - prefix table name with prisma schema name from DATABASE_URL
