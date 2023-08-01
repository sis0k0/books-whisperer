# Books Whisperer — Semantic Book Search Recommendations

This is a demo of a books recommendations web application using Weaviate and Google Cloud PaLM 2. The project uses Node.js with express for the server application and Angular for the client application.

## Setup

Follow the instructions below to run the demo locally.

### Google Cloud setup

Enable the [Vertex AI](https://console.cloud.google.com/flows/enableapi?apiid=aiplatform.googleapis.com) APIs and install the [gcloud CLI](https://cloud.google.com/sdk/docs/install).

### Weaviate Cloud Services setup

Follow the [WCS quickstart](https://weaviate.io/developers/wcs/quickstart) instructions to register an account and deploy a cluster.

### Project setup

1. Clone the project repository.

    ```
    git clone https://github.com/sis0k0/books-whisperer.git
    ```

1. Navigate to the server directory and create a `.env` file with the following content. Replace the placeholders with your own credentials.

    **books-whisperer/server/.env**
    ```
    WEAVIATE_HOST='<host-name>.weaviate.network'
    WEAVIATE_API_KEY='<api-key>'

    PALM_TOKEN='<token>'
    GOOGLE_CLOUD_PROJECT_ID='<project-id>'
    ```

1. Get your Weaviate credentials from the [WCS cluster page](https://weaviate.io/developers/weaviate/quickstart#note-your-cluster-details).

1. Run the following `gcloud` command to generate an access token.

    ```
    gcloud auth print-access-token
    ```

1. Run the following `gcloud` command to get your project ID.

    ```
    gcloud config get-value project
    ```

### Running the application

1. Install the dependencies in the `server/` directory and start the server app.

    **books-whisperer/server**
    ```
    npm i && npm start
    ```

1. Open a new terminal window, install the dependencies in the `client/` directory and start the client app.

    **books-whisperer/client**
    ```
    npm i && npm start
    ```

