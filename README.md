# PortfolioFrontend

TODO
- Should update styling in user list dialog, looks meh
- See stared post and navigate to them
- comments have a set username, it needs to be changed to userId instead. couse this breaks if a username is changed..
- edit images on a post
- se list of stared and liked posts
- Add delete profile option
- If return on view post to home it loads every post twice? Unsure why, might have with infinity scroll nexttoken to do
- login username is case sensitive which is annoying

## How to run locally

Need to have BE up & running. See
https://github.com/SiggeAlfredsson/portfolio-backend

Angular Cli install
```bash
npm install -g @angular/cli
```

Clone the repo (requires git)
```bash
git clone https://github.com/SiggeAlfredsson/portfolio-frontend
```
Run Angular App (requires nodejs & Angular cli)
```bash
cd portfolio-frontend

npm install

ng serve --open
```

Ng serve locally with prod config
```bash
ng serve --host 0.0.0.0 --port 9999 --configuration=production
```

## Tree
```bash
├── app
│   ├── app.component.html
│   ├── app.component.scss
│   ├── app.component.spec.ts
│   ├── app.component.ts
│   ├── app.module.ts
│   ├── app-routing.module.ts
│   └── core
│       ├── components
│       │   └── page-not-found
│       │       ├── page-not-found.component.html
│       │       ├── page-not-found.component.scss
│       │       └── page-not-found.component.ts
│       ├── dialogs
│       │   ├── edit-profile-dialog
│       │   │   ├── edit-profile-dialog.component.html
│       │   │   ├── edit-profile-dialog.component.scss
│       │   │   └── edit-profile-dialog.component.ts
│       │   ├── image-dialog
│       │   │   ├── image-dialog.component.html
│       │   │   ├── image-dialog.component.scss
│       │   │   └── image-dialog.component.ts
│       │   └── users-dialog
│       │       ├── users-dialog.component.html
│       │       ├── users-dialog.component.scss
│       │       └── users-dialog.component.ts
│       ├── guards
│       │   ├── auth.guard.ts
│       │   └── no-auth.guard.ts
│       ├── models
│       │   ├── comment.ts
│       │   ├── post.ts
│       │   └── user.ts
│       ├── pages
│       │   ├── auth
│       │   │   ├── login
│       │   │   │   ├── login.component.html
│       │   │   │   ├── login.component.scss
│       │   │   │   └── login.component.ts
│       │   │   └── register
│       │   │       ├── register.component.html
│       │   │       ├── register.component.scss
│       │   │       └── register.component.ts
│       │   ├── create-post
│       │   │   ├── create-post.component.html
│       │   │   ├── create-post.component.scss
│       │   │   └── create-post.component.ts
│       │   ├── discover-users
│       │   │   ├── discover-users.component.html
│       │   │   ├── discover-users.component.scss
│       │   │   └── discover-users.component.ts
│       │   ├── home
│       │   │   ├── home.component.html
│       │   │   ├── home.component.scss
│       │   │   └── home.component.ts
│       │   ├── user-profile
│       │   │   ├── user-profile.component.html
│       │   │   ├── user-profile.component.scss
│       │   │   └── user-profile.component.ts
│       │   └── view-post
│       │       ├── view-post.component.html
│       │       ├── view-post.component.scss
│       │       └── view-post.component.ts
│       └── services
│           ├── auth.service.ts
│           ├── picture.service.ts
│           ├── post.service.ts
│           ├── theme.service.ts
│           └── user.service.ts
├── assets
│   └── icons
│       └── robot-404-error-errors.1024x851.png
├── environments
│   ├── environment.prod.ts
│   └── environment.ts
├── favicon.ico
├── icon.webp
├── index.html
├── main.ts
├── styles.scss
├── theme.palette.scss
└── theme.scss


```
