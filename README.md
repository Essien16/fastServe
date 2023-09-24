# FastServe Backend
## Installation

required: [Node](https://nodejs.org/dist/latest-v12.x/) plus [npm](https://docs.npmjs.com/) and [Git](https://git-scm.com/downloads)

```text
Fork the repo https://github.com/essien16/fastserve
```

```bash
git clone https://github.com/<your username>/fastServe.git

cd fastServe

git remote add upstream https://github.com/Essien16/fastServe.git 

git pull upstream master

git checkout <your_branch_name>
```
## Running Locally

```bash

npm install

npm run dev

```

## Pushing your code

```bash
npm run lint

# add and commit your changes

git pull upstream dev

git push origin <your_branch_name>

# go and make a pull request to the dev branch
```