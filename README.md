# Eventful - Ticketing Platform Backend

Eventful is your gateway to unforgettable experiences, offering a diverse range of events including concerts, theater performances, sports events, and cultural gatherings. This comprehensive ticketing platform ensures that every experience is just a click away.

## Table of Contents

- [Eventful - Ticketing Platform Backend](#eventful---ticketing-platform-backend)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Technologies Used](#technologies-used)
  - [Usage](#usage)
    - [API](#api)
  - [Installation](#installation)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
  - [Unique IPs](#unique-ips)
    - [How We Ensure Unique Clicks](#how-we-ensure-unique-clicks)
  - [FAQ](#faq)

## Features

- **Event Creation**: Seamlessly create and manage events with customizable details.
- **Authentication & Authorization**: Secure login for event creators and attendees, with different views and permissions.
- **QR Code Generation**: Automatically generate QR codes for tickets to validate attendance.
- **Shareability**: Easily share events across social media platforms.
- **Notifications**: Set and receive reminders for upcoming events, with flexible notification settings for both creators and attendees.
- **Analytics**: Access detailed analytics on ticket sales, attendee statistics, and QR code scans.

## Technologies Used

- **Backend**: Node.js, TypeScript, Express, MongoDB, Redis, Firebase
- **Deployment**: Render

## Usage

### API

- Send requests to the backend at [https://server-z0w0.onrender.com](https://server-z0w0.onrender.com)
- View the API documentation at [https://server-z0w0.onrender.com/docs](https://server-z0w0.onrender.com/docs)
- Example: View a specific event at [https://server-z0w0.onrender.com/events/:id](https://server-z0w0.onrender.com/events/12345)

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB
- [Redis](https://redis.io/)
- [Firebase](https://firebase.google.com/)
- [Stripe](https://stripe.com/)
- [Gmail](http://gmail.com)

### Setup

1. Clone the repository:
    ```bash
    git clone https://github.com/yourusername/eventful.git
    ```

2. Navigate into the repository:
    ```bash
    cd eventful/server
    ```

3. Install dependencies:
    ```bash
    npm install
    ```

4. Create a `.env` file in the **backend** directory and add your environment variables:
    ```
    PORT=8000
    PRODUCTION_MONGODB_URI=your_production_mongodb_uri
    DEVELOPMENT_MONGODB_URI=your_development_mongodb_uri
    JWT_SECRET=your_jwt_secret
    ACCESS_TOKEN_NAME=token
    FRONTEND_URL=https://de-eventful.vercel.app/
    STRIPE_SECRET_KEY=your_stripe_secret_key
    MAIL_PASSWORD=your_mail_password
    MAIL_SENDER=your_mail_sender
    PASSWORD_COOKIE_NAME=password_token
    REDIS_URL=your_redis_url
    FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
    FIREBASE_SERVICE_ACCOUNT=path_to_your_firebase_service_account_json
    ```

5. Start the development server:
    ```bash
    npm run start:dev
    ```

## Unique IPs

### How We Ensure Unique Clicks

To ensure each click is meaningful and unique, we:

- **Check Device ID (IP Address)**: Each device has a unique ID.
- **Check URL ID**: Each URL is uniquely identified.

Our system verifies if a device has clicked a link within the last 7 days. If not, the click is recorded as unique.

## FAQ

- **Why do URLs have expiration dates?**
    - Expiration dates help manage URL lifespan and potential payment plans in the future.

- **Why do tokens have expiration dates?**
    - Expiring tokens enhances security by preventing unauthorized access and ensuring periodic re-authentication.
