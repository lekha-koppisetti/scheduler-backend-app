
## Wallet App Service

- `Implements endpoints to book reschedule cancel and fetch the appointsments `
` 
- `Hosted Backend Services url - https://scheduler-service-txho7xwdwq-el.a.run.app/` 

### Prerequistes to locally setup the project

- `Install Docker`

- `Uncomment docker-compose.yml`

- `Go to project directory and  run 'docker-compose up'`

- `with the docker-compose up command wallet-app will be running in port http://localhost:8080 and database client pgadmin will be running at http://localhost:9693/browser/ through which schema and data can be verified`


## Endpoints

 - POST `/appointment/book` -- endpoint to book an appointment with operatorid 

    `https://scheduler-service-txho7xwdwq-el.a.run.app/appointment/book`

    ```json Request

        {
            "customerId" : "d6fcc512-be94-43d3-8bd5-ad4b893e5aa1",
            "operatorId" : "a04c2b95-4842-4e54-960e-deeb0bbd4394",
            "starttime" : "2023-04-01T12:30:00.000Z"
        }

    ```

    ```json Response

        {
            "id": "bad7172c-6e7a-4267-a07d-1dfb4f4c3329",
            "customerId": "d6fcc512-be94-43d3-8bd5-ad4b893e5aa1",
            "operatorId": "a04c2b95-4842-4e54-960e-deeb0bbd4394",
            "starttime": "2023-04-01T10:00:00.000Z",
            "endtime": "2023-04-01T11:00:00.000Z",
            "createdAt": "2023-03-30T05:30:16.852Z",
            "updatedAt": "2023-03-30T05:30:16.852Z"
        }

    ```



 - PUT `/appointment/reschedule/:id` -- endpoint to reschedule the appointment

    `https://scheduler-service-txho7xwdwq-el.a.run.app/appointment/reschedule/3eef7917-5396-4ac5-98c1-bcde87254a47`

    ```json Request

        {
          "starttime" : "2023-04-01T15:30:00.000Z"
        }

    ```

    ```json Response

         {
             "message": "No slot is available for this time. Please try to reschedule with different slot"
        }

    ```

 - PUT `/appointment/cancel/:id` -- endpoint to cancel the appointmnet
      
    `https://scheduler-service-txho7xwdwq-el.a.run.app/appointment/cancel/75b71071-ada1-4a18-9a30-0d79f51d0674`


    ```json Response
        {
           "message": "1 Appointment cancelled successfully"
        }
    ```

 - GET `/appointments/:operatorId` -- endpoint to get all the appointments of operator id

   `https://scheduler-service-txho7xwdwq-el.a.run.app/appointments/a04c2b95-4842-4e54-960e-deeb0bbd4394`

    ```json Response

        [
            {
                "id": "3eef7917-5396-4ac5-98c1-bcde87254a47",
                "customerId": "d6fcc512-be94-43d3-8bd5-ad4b893e5aa1",
                "operatorId": "a04c2b95-4842-4e54-960e-deeb0bbd4394",
                "starttime": "2023-04-01T15:00:00.000Z",
                "endtime": "2023-04-01T16:00:00.000Z",
                "createdAt": "2023-03-30T05:35:24.953Z",
                "updatedAt": "2023-03-30T05:35:24.953Z",
                "slot": "15-16"
            },
            {
                "id": "bad7172c-6e7a-4267-a07d-1dfb4f4c3329",
                "customerId": "d6fcc512-be94-43d3-8bd5-ad4b893e5aa1",
                "operatorId": "a04c2b95-4842-4e54-960e-deeb0bbd4394",
                "starttime": "2023-04-01T10:00:00.000Z",
                "endtime": "2023-04-01T11:00:00.000Z",
                "createdAt": "2023-03-30T05:30:16.852Z",
                "updatedAt": "2023-03-30T05:30:16.852Z",
                "slot": "10-11"
            }
        ]

    ```
- GET `/appointments/:operatorId?status=free` -- endpoint to get all the free slots operator id

   `https://scheduler-service-txho7xwdwq-el.a.run.app/appointments/a04c2b95-4842-4e54-960e-deeb0bbd4394?status=free`

    ```json Response

        {
            "1-4-2023": [
                "1-10",
                "11-15",
                "16-1"
            ]
        }
    ```
 


## Dependencies:

- `Express` - `A server-side JavaScript framework for building web applications and APIs`

- `Postgres` - `Using Google cloud postgres instance`

- `TypeScript`

- `Knex` - `Knex is a JavaScript library that provides a SQL query builder and an ORM (Object-Relational Mapping) for Node.js. It is used for interfacing with SQL databases such as PostgreSQL. Using Knex, we can do the migrations as well.`


## Database design and queries

appointments table - id, customerId, operatorId, starttime, endtime, createdAt, updatedAt

checking whether slot is available or not by checking starttime and endtime ranges. Please refer to line no : 24 in appointment-service.ts

To get the free slots, I am dynamically calculating free slots using 24 size array for each day by tracking the free slots.

## Deployment  - Using Google Cloud Run

- `gcloud auth login`

- `docker build -t backend-scheduler-app .`

- `docker run -p 3000:3000 backend-scheduler-app`

- `docker tag backend-scheduler-app:latest gcr.io/original-voyage-381915/scheduler-service:1`

- `docker push gcr.io/original-voyage-381915/scheduler-service:1` 

- `gcloud run deploy scheduler-service --image gcr.io/original-voyage-381915/scheduler-service:1 --platform managed --region asia-south1 --project original-voyage-381915`




 