## LinkPulse — URL Shortener with Analytics
LinkPulse is a backend service that converts long URLs into unique short codes, tracks every click with detailed analytics, and uses Redis caching for faster redirects. Built entirely as a backend project with full API documentation and Postman collection for testing.

## Features
  ## Authentication & Security
  - User registration and login with JWT access and refresh tokens
  - Passwords hashed using bcrypt
  - Change password (protected route)
  - Forgot password and reset password via email using Nodemailer with time-based expiring tokens
  - Logout and account deletion
  - Route protection using custom JWT middleware with httpOnly cookies

  ## URL Shortening
  - Converts long URLs into unique short codes using Base62 encoding URL format validation before processing
  - Duplicate URL handling — returns existing short code if the same URL was already shortened by the user
  - 302 redirect for accurate click tracking
  - Optional click limit — URL automatically deactivates after reaching the limit.

  ## Analytics
  - Tracks total clicks, device type, and visitor IP for every redirect
  - Daily click breakdown using MongoDB aggregation pipelines
  - Device type breakdown (mobile, tablet, desktop)
  - Per-URL and combined analytics across all user URLs

  ## Performance
  - Redis caching layer for short URL redirects, reducing repeated MongoDB lookups on frequently visited links

## Tech Stack
     Node.js | Express.js | MongoDB | Redis (Upstash) | 
     JWT, bcrypt | Joi | Nodemailer | us-parser.js

## API Documentation
### Auth Routes — /api/auth
   # API Endpoints

## Authentication
| Method | Endpoint | Description |
|----------|------------|--------------|
| `POST` | `/register` | Register a new user |
| `POST` | `/login` | Login and receive access and refresh tokens via cookies |
| `PUT` | `/changepassword` | Update the password for the logged-in user |
| `POST` | `/forgotpassword` | Send a password reset link to the user's email |
| `POST` | `/resetpassword/:token` | Reset the password using the token received via email |
| `DELETE` | `/deleteuser` | Delete the logged-in user's account |
| `POST` | `/logout` | Clear authentication cookies and log out the user |

## URL Routes -- /api/url
| Method | Endpoint | Description |
|----------|------------|--------------|
| `POST` | `/shortenurl` | Shorten a URL, optionally with a click limit |
| `GET` | `/redirecturl/:shortCode` | Redirect to the original URL |
| `GET` | `/getallurls` | Get all URLs created by the logged in user |
| `PUT` | `/deactivateurl/:id` | Deactivate a specific URL |

## Analytics Routes — /api/analytics
| Method | Endpoint | Description |
|----------|------------|--------------|
| `GET` | `/getanalyticsbycode/:shortCode` | Get total clicks, daily breakdown, and device breakdown for one URL |
| `GET` | `/getallanalytics` | Get combined analytics across all URLs for the logged in user |

## Setup Instructions
1) Clone the Repo
`git clone [https://github.com/Sateesh21/](https://github.com/Sateesh21/LinkPulse-URL-Shortener-with-Analytics)`

2) Install Dependencies
   `npm install`

3) Create a `.env` file in the root directory with the following variables
   - PORT=3000
   - MONGO_URI=your_mongodb_connection_string
   - ACCESS_KEY=your_access_token_secret
   - REFRESH_SECRET_KEY=your_refresh_token_secret
   - NODE_ENV=development
   - EMAIL=your_gmail_address
   - EMAIL_PASSWORD=your_gmail_app_password
   - REDIS_URL=your_upstash_redis_url
     
4) Run the server
   `npm run dev`

## Testing With Postman
  A complete Postman collection is included in this repository (linkpulse.postman_collection.json). Import it into Postman to test all endpoints, including authentication flows, URL shortening, redirection, and analytics.

-----------------------------------------------------------------------------------------------------------------------
#### Author
- Sateesh Sunkara
