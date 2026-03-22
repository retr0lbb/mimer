# Mimer

## About the Project

**Mimer** is a SaaS multi-tenant system designed to automate customer support services. Leveraging AI technologies like OpenAI's GPT, it improves on traditional customer support by offering faster and more accurate responses, reducing operational costs, and enabling a seamless experience for end users. The platform supports multiple tenants, making it a scalable solution for businesses of all sizes.

## Getting Started

Follow these steps to set up and start the project on your local machine.

### Prerequisites

Ensure you have the following installed:

- **Node.js** (v16 or higher recommended)
- **Docker** (for containerized environments)
- **npm** (Node Package Manager) or **yarn**

### Installation Steps

1. Clone the repository:
    ```bash
    git clone https://github.com/retr0lbb/mimer.git
    cd mimer
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Set up the environment variables:
    - Copy the `.env.example` file to `.env` and configure it as per your requirements.

4. Run database migrations using Drizzle:
    ```bash
    npm run db:studio
    ```

5. Start the server in development mode:
    ```bash
    npm run dev
    ```

    Alternatively, you can use the Node.js runtime directly:
    ```bash
    npm run node:dev
    ```

6. The application will be available at `http://localhost:3000`.

## Project Structure

The project follows a modular design pattern to ensure scalability and maintainability. Below is a high-level breakdown of the relevant folders and modules:

### Key Modules:
- **src/server.ts:** Entry point for the application.
- **src/modules:** Contains core modules, each designed to handle a specific domain.
    - **tenant:** Manages tenant CRUD operations and middleware logic.
    - **conversation:** Handles conversations, including routes and controllers.
    - **ia (AI):** Orchestrates AI providers, with support for OpenAI and Gemini.
    - **message-gateway:** Abstracts messaging systems such as WhatsApp.
- **src/db:** Database schemas and models defined using Drizzle ORM.

### Utilities:
- **src/config:** Configuration management, including environment variables.
- **src/utils:** Logging and database helper functions.
- **src/errors:** Centralized error handling logic (e.g., `unauthorized`, `notFound`).

## Design Patterns

The project employs several design principles to ensure robust and scalable development:

- **Repository Pattern:** Abstracts database interactions, enabling flexibility in model changes.
- **Dependency Injection:** Ensures modules like AI providers remain loosely coupled.
- **Modular Architecture:** Promotes separation of concerns, with clear boundaries between different modules.
- **Middlewares:** Extends the Fastify framework to handle tenant-based requests and authentication.

## Features

### Implemented:
1. **Multi-Tenant Support:** Each tenant operates independently with isolated data.
2. **AI Orchestrator:** Routes requests to AI providers based on context.
3. **Conversation Management:** Tracks conversations and messages seamlessly.
4. **Fastify-Powered Backend:** High-performance web server.
5. **Drizzle ORM Database Management:** Simplified schema definition and migrations.

### Upcoming:
1. Integration of advanced messaging systems.
2. Enhanced AI support for custom NLP models.

## License

This project is licensed under the ISC License. See the [LICENSE](https://opensource.org/licenses/ISC) file for details.

---

For more information, visit the [GitHub issues page](https://github.com/retr0lbb/mimer/issues) for open discussions and contributions.