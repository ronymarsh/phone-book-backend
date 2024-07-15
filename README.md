# Phonebook API example application

### Running With Docker

pull image

```sh
docker pull ronymarsh/phonebook_v1.0:latest
```

bind port 3000 and run the app

```sh
docker run -p 127.0.0.1:3000:3000 ronymarsh/phonebook_v1.0
```

After app is running, swagger docs are available [here](http://localhost:3000/doc)
Or jump to [API](#API)

### Running Locally (requires having NodeJS installed)

in project root directory run:

```sh
npm i
```

```sh
nest start
```

### Postman collection to play with

[link to collection](https://drive.google.com/file/d/1tOK8C5fBHXqS4rjCQ17AkFUmzzXJo9_P/view?usp=sharing)

### CSV

Use sample data.csv file in `/csv` for importing contacts from csv file

# API

## 1. Create contact

### Request

`POST /api/contacts`

### Body

    {
    	"firstName": string,//required
    	"lastName": string, // required, combination o firstName and lastName must be unique
    	"phone": string, // required, <countryCode><number>. example: +972541234567
    	"address": string // optional
    }

### Response

Created contact

    {
    	"firstName": string,
    	"lastName": string,
    	"phone": string,
    	"_id": string,
    	"createdAt": Date,
    	"updatedAt": Date,
    	"__v": number
    }

### Errors

| Name        | Code | Description                                                 |
| ----------- | ---- | ----------------------------------------------------------- |
| Bad request | 400  | one or more fields in request invalid                       |
| Conflict    | 409  | User with firstName and lastName combination already exists |

## 2. Batch create contacts

### Request

`POST /api/contacts/batch`
create multiple documents (all or nothing)

### Body

    [
        {
    	    "firstName": string,//required
        	"lastName": string, // required, combination o firstName and lastName must be unique
        	"phone": string, // required, <countryCode><number>. example: +972541234567
    	    "address": string // optional
    	}
    ]

### Response

Array of created contacts

    [
        {
    	    "firstName": string,
        	"lastName": string,
    	    "phone": string,
    	    "_id": string,
    	    "createdAt": Date,
    	    "updatedAt": Date,
    	    "__v": number
    	}
    ]

### Errors

| Name        | Code | Description                                                 |
| ----------- | ---- | ----------------------------------------------------------- |
| Bad request | 400  | one or more fields in request invalid                       |
| Conflict    | 409  | User with firstName and lastName combination already exists |

## 3. Get a specific contact by ID

### Request

`GET /api/contacts/{id}`

### Params

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | -------- |
| id   | string | contact ID  | true     |

### Response

Desired contact

    {
    	"firstName": string,
    	"lastName": string,
    	"phone": string,
    	"_id": string,
    	"createdAt": Date,
    	"updatedAt": Date,
    	"__v": number
    }

### Errors

| Name      | Code | Description                        |
| --------- | ---- | ---------------------------------- |
| Not Found | 404  | Contact with provided ID not found |

## 4. Get contacts

### Request

`GET /api/contacts?searchKey=key&sortBy=firstName&sortDirection=asc&page=1&pageSize=10`

### Query Params

| Name          | Type           | Description                                            | Required |
| ------------- | -------------- | ------------------------------------------------------ | -------- |
| searchKey     | string         | text value to search (applies to text fields only)     | false    |
| sortBy        | string         | Field to sort by, ignored if no such field             | false    |
| sortDirection | ['asc','desc'] | Order to sort results by, defaults to 'asc'= ascending | false    |
| page          | number         | Desired page number                                    | false    |
| pageSize      | number         | Number of contacts per page between 1 and 10           | false    |

### Response

metadata holds pagination info. data contains all desired contacts according to query params.

     {
    	"metadata": {
    		"page": number,
    		"pageSize": number,
    		"totalCount": number,
    		"pageCount": number
    	},
    	"data": [
    		{
    			"_id": string,
    			"firstName": string,
    			"lastName": string,
    			"phone": string,
    			"createdAt": Date,
    			"updatedAt": Date,
    			"__v": number
    		}
    	]
    }

### Errors

| Name        | Code | Description                           |
| ----------- | ---- | ------------------------------------- |
| Bad request | 400  | one or more fields in request invalid |

## 5. Edit contact by ID

### Request

`PATCH /api/contacts/{id}`

### Params

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | -------- |
| id   | string | contact ID  | true     |

### Body

    {
    	"firstName": string,//optional
    	"lastName": string, //optional
    	"phone": string, //optional
    	"address": string //optional
    }

### Response

Edited contact

    {
    	"_id": string,
    	"firstName": string,
    	"lastName": string,
    	"phone": string,
    	"createdAt": Date,
    	"updatedAt": Date,
    	"__v": number
    }

### Errors

| Name      | Code | Description                        |
| --------- | ---- | ---------------------------------- |
| Not Found | 404  | Contact with provided ID not found |

## 6. Delete contact by ID

### Request

`DELETE /api/contacts/{id}`

### Params

| Name | Type   | Description | Required |
| ---- | ------ | ----------- | -------- |
| id   | string | contact ID  | true     |

### Response

Deleted contact
{
"\_id": string,
"firstName": string,
"lastName": string,
"phone": string,
"createdAt": Date,
"updatedAt": Date,
"\_\_v": number
}

### Errors

| Name      | Code | Description                        |
| --------- | ---- | ---------------------------------- |
| Not Found | 404  | Contact with provided ID not found |

## 7. Import contacts from .csv file

### Request

`POST /api/contacts/csv/import?fileName={fileName}`

### Params

| Name     | Type   | Description                                   | Required |
| -------- | ------ | --------------------------------------------- | -------- |
| fileName | string | file name inside `/csv` folder to import from | true     |

### Response

Array of created contacts from file

    [
        {
    	    "firstName": string,
        	"lastName": string,
        	"phone": string,
        	"_id": string,
        	"createdAt": Date,
        	"updatedAt": Date,
        	"__v": number
    	}
    ]

### Errors

| Name        | Code | Description                                                 |
| ----------- | ---- | ----------------------------------------------------------- |
| Bad request | 400  | one or more fields in request missing or invalid            |
| Conflict    | 409  | User with firstName and lastName combination already exists |

## 8. Export contacts to csv

### Request

`GET /api/contacts/csv/export`

### Response

all contacts in csv format:

    firstName1,lastName1,phone1,address1
    firstName2,lastName2,phone2,address2
    ...

## 9. Health check

### Request

`GET /api/contacts/health`
check app is running

### Response

    healthy
