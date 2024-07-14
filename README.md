# Phone Book Server

### Running With Docker

pull image from hub 

```sh
docker pull ronymarsh/phonebook_v1.0:latest
```

bind port 3000 and run the app
```sh
docker run -p 127.0.0.1:3000:3000 ronymarsh/phonebook_v1.0
```

After app is running, docs are available at localhost:3000/doc

### Running Locally (requires having NodeJS installed)

```sh
npm i
```

```sh
nest start
```

### Postman collection to play with

### CSV

Use sample data.csv file in `tmp` for importing contacts from csv file


