<p align="center">
  <img src="src/assets/images/logo.png" width="320" alt="Logo" />
</p>

## 1. Preparation

### 1.1 Create file .env (development mode) or .env.production (production mode)

```bash
# follow the file .env.example (development mode) or .env.production.example (production mode)
ADMIN_SERVER=<BOOLEAN>
GRAPHQL_END_POINT=<URM_GRAPHQL_SERVER>
CLOUDINARY_NAME=<CLOUDINARY_NAME>
CLOUDINARY_UPLOAD_PRESET=<PRESET_NAME>
FIREBASE_API_KEY=<YOUR_FIREBASE_API_KEY>
FIREBASE_AUTH_DOMAIN=<YOUR_FIREBASE_AUTH_DOMAIN>
FIREBASE_DATABASE_URL=<YOUR_FIREBASE_DATABASE_URL>
FIREBASE_PROJECT_ID=<YOUR_FIREBASE_PROJECT_ID>
FIREBASE_STORAGE_BUCKET=<YOUR_FIREBASE_STORAGE_BUCKET>
FIREBASE_MESSAGING_SENDER_ID=<YOUR_FIREBASE_MESSAGING_SENDER_ID>
FIREBASE_APP_ID=<YOUR_FIREBASE_APP_ID>
FIREBASE_MEASUREMENT_ID=<YOUR_FIREBASE_MEASUREMENT_ID>
TURN_SEYRVER=<OUR_TURN_SERVER_URI>
TURN_PASSWORD=<YOUR_TURN_SERVER_PASSWORD>
TURN_USERNAME=<YOUR_TURN_SERVER_USERNAME>
FACEBOOK_APP_ID=<YOUR_FACEBOOK_APP_ID>
GOOGLE_OAUTH_CLIENT_ID=<YOUR_GOOGLE_CLIENT_ID>
```

### 1.2 Install package

```bash
# using npm
$ npm i

# using yarn
$ yarn add
```

## 2. Running the app

```bash
# development mode
$ npm run start

# production mode
  #1. build app
  $ npm run build
  #2. start app
  $ npm run start:prod
```

## 3. Git policy

### 3.1 Branch

```bash
  # create branch before perform your task
  # naming branch follow the pattern: yourName_yourTask
  # e.g: hieu_khachHang
  $ git branch <your_branch>

  # check out your branch before start code
  $ git checkout <your_branch>
```

### 3.2 Commit code

```bash
  # save your changes
  $ git add .

  # commit code
  # your comment must be concise and describe what you did
  $ git commit -m 'your comment'
```

### 3.3 Pull code

```bash
  # always pull code before whenever start coding or push code to repository
  $ git pull origin master
```

### 3.4 Push code

```bash
  # push code from local to repository
  $ git push origin <your_branch>
```

\*_*NOTE:*_ Before push code, you must pull code from "test" branch and fix conflict
