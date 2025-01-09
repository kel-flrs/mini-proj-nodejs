## Prerequisites

- **Install Docker (Docker Desktop is recommended)**

## Setup Instructions

1. **Clone the Repository**

2. **Create a .env file in the root directory and copy env variables from env.example and paste it to your .env file**

3. **Start your Docker engine through Docker Desktop (recommended)**

4. **Build and Run the Containers:**

   ```bash
   docker-compose up --build
   ```
   **Note:** Make sure you don't have open port running on port 3306 on your local machine. If you encountered port issue, hit Win + R, run services.msc, find MySQL<version> e.g. MySQL80 and stop it (This is for Windows).

## Testing endpoints via Postman

**Note:**
Before testing the Find Treasures Endpoint, do these steps first:

1. Hit Login Endpoint first
2. Copy the token from response body
3. In Find Treasures Endpoint, go to Authorization tab, set Type to Bearer Token and paste the token on the field
4. You can now test the Find Treasures Endpoint

### Login Endpoint (Bonus Endpoint)
### URL: /api/auth/login

### Sample POST request body

  ```json
  {
    "email": "u1@kitra.abc",
    "password": "123123"
  }
  ```
### Response

  ```json
  {
    "id": 3000,
    "name": "U1",
    "age": 21,
    "token": "<token>"
  }
 ```

### Find Treasures Endpoint
### URL: /api/treasures 

### Sample GET request url without prize value
  ```url
  http://localhost:3000/api/treasures?latitude=14.54376481&longitude=121.0199117&distance=1
  ```
### Response
  ```json
  {
    "count": 2,
    "treasures": [
        {
            "id": 100,
            "latitude": "14.54376481",
            "longitude": "121.0199117",
            "name": "T1",
            "moneyValues": [
                15,
                20
            ]
        },
        {
            "id": 102,
            "latitude": "14.54464357",
            "longitude": "121.0203656",
            "name": "T3",
            "moneyValues": [
                15,
                20
            ]
        }
    ]
}
```

### Sample GET request url with prize value
  ```url
  http://localhost:3000/api/treasures?latitude=14.54376481&longitude=121.0199117&distance=1&prizeValue=10
  ```
### Response
  ```json
  {
    "count": 2,
    "treasures": [
        {
            "id": 100,
            "latitude": "14.54376481",
            "longitude": "121.0199117",
            "name": "T1",
            "moneyValues": [
                15
            ]
        },
        {
            "id": 102,
            "latitude": "14.54464357",
            "longitude": "121.0203656",
            "name": "T3",
            "moneyValues": [
                15
            ]
        }
    ]
}
```

## Troubleshooting
1. **Service is unhealthy error in Docker** - prune your Docker images or completely remove all Docker containers and images
2. **Port conflicts** - check if your MySQL Server instance is running on your local machine. If running, stop it for a while to avoid conflict with Docker
3. **Database changes is not reflecting** - enter docker-compose down -v to to reset the environment and start with a fresh state or completely remove all Docker containers and images
4. **Container name is already in use error in Docker build** - remove all Docker containers and images
