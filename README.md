# Budget Tracker

A full-stack web application for personal finance management. Built with Angular and Node.js/Express.

## Features

- Track income and expenses in multiple currencies (EUR, USD, RSD)
- Categorize transactions
- Monthly financial summaries
- Secure user authentication
- Dark/Light theme support
- Responsive design

## Tech Stack

- **Frontend**: Angular 18
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Authentication**: JWT

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd frontend/budget-tracker
   npm install
   ```
3. Start the servers:
   ```bash
   # Backend (from backend directory)
   node index.js

   # Frontend (from frontend/budget-tracker directory)
   ng serve
   ```
4. Visit `http://localhost:4200` in your browser


https://github.com/user-attachments/assets/2ab3e704-4401-45e7-852f-a9aea7591389


## TODO

- [ ] Update CSS for better responsive design:
  - [ ] Improve mobile navigation
  - [ ] Make transaction tables scroll horizontally on small screens
  - [ ] Adjust modal sizes for mobile devices
  - [ ] Fix form layouts on different screen sizes
- [ ] Add data visualization with charts
- [ ] Implement budget goals feature
- [ ] Add export functionality for transactions

## License

MIT
