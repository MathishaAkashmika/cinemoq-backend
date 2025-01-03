# Movie Booking System - Code Quality Guidelines

## Project Structure

### Client-Side
```
movie-booking-frontend/           # Frontend Repository
├── src/
│   ├── app/                     # App Router Directory
│   │   ├── layout.tsx          # Root Layout
│   │   ├── page.tsx            # Homepage
│   │   ├── movies/             # Movies Pages
│   │   │   ├── page.tsx        # Movies List
│   │   │   └── [id]/page.tsx   # Single Movie
│   │   └── bookings/           # Bookings Pages
│   │       ├── page.tsx        # Bookings List
│   │       └── new/page.tsx    # New Booking
│   ├── components/             # All Components
│   │   ├── ui/                # Basic UI Components
│   │   │   └── button.tsx
│   │   ├── movie-card.tsx     # Movie Components
│   │   ├── movie-list.tsx
│   │   ├── booking-form.tsx   # Booking Components
│   │   └── seat-picker.tsx
│   ├── lib/                   # Utilities & API
│   │   ├── api.ts            # API Configuration
│   │   └── utils.ts          # Helper Functions
│   ├── types/                # TypeScript Types
│   │   └── index.ts         # All Types
│   └── globals.css          # Global Styles
├── public/                  # Static Files
│   └── images/             # Images & Icons
└── package.json            # Dependencies
```

### Server-Side
```
movie-booking-backend/           # Backend Repository
├── src/
│   ├── app.module.ts           # Root application module
│   ├── app.controller.ts       # Root controller
│   ├── app.service.ts          # Root service
│   ├── main.ts                # Entry point
│   ├── movies/                # Movies Module
│   │   ├── movies.module.ts   # Movies module configuration
│   │   ├── movies.controller.ts
│   │   ├── movies.service.ts
│   │   ├── entities/
│   │   │   └── movie.entity.ts
│   │   └── dto/
│   │       ├── create-movie.dto.ts
│   │       └── update-movie.dto.ts
│   ├── bookings/              # Bookings Module
│   │   ├── bookings.module.ts # Bookings module configuration
│   │   ├── bookings.controller.ts
│   │   ├── bookings.service.ts
│   │   ├── entities/
│   │   │   └── booking.entity.ts
│   │   └── dto/
│   │       ├── create-booking.dto.ts
│   │       └── update-booking.dto.ts
│   └── common/                # Shared Resources
│       ├── interfaces/
│       ├── decorators/
│       └── filters/
├── test/                     # Tests
│   ├── movies.e2e-spec.ts    # E2E Tests
│   └── bookings.e2e-spec.ts
├── nest-cli.json            # Nest CLI configuration
├── tsconfig.json            # TypeScript configuration
├── package.json             # Dependencies
└── .env                     # Environment variables
```

## Naming Conventions

### Variables and Functions
- Use camelCase for variables and functions
- Use descriptive names that explain the purpose
```javascript
// Good
const movieTitle = "Inception";
const getUserBookings = () => {};

// Bad
const m = "Inception";
const getdata = () => {};
```

### Components (Frontend)
- Use PascalCase for component names
- Add suffix based on component type
```javascript
// Components
MovieCard.jsx
BookingForm.jsx
NavbarLayout.jsx
```

### API Endpoints
- Use kebab-case for URLs
- Use descriptive names that represent the resource
```javascript
// Good
GET    /api/movies
POST   /api/bookings
GET    /api/user-bookings

// Bad
GET    /api/getMovies
POST   /api/createBooking
```

## API Request Standards

### Frontend API Configuration (services/api.js)
```javascript
// Base API configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// API service with axios
import axios from 'axios';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Movie service example
export const movieService = {
  getAllMovies: async () => {
    const response = await api.get('/movies');
    return response.data;
  },
  
  getMovieById: async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  }
};

// Booking service example
export const bookingService = {
  createBooking: async (bookingData) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  }
};
```

### Backend API Structure (Nest.js)
```typescript
// controllers/movie.controller.ts
@Controller('movies')
export class MovieController {
  constructor(private movieService: MovieService) {}

  @Get()
  getAllMovies() {
    return this.movieService.findAll();
  }

  @Get(':id')
  getMovie(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }
}

// controllers/booking.controller.ts
@Controller('bookings')
export class BookingController {
  constructor(private bookingService: BookingService) {}

  @Post()
  createBooking(@Body() createBookingDto: CreateBookingDto) {
    return this.bookingService.create(createBookingDto);
  }
}
```

## Environment Setup

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Backend (.env)
```
PORT=3001
DATABASE_URL=your_database_url
```

## Cross-Repository Communication

1. **API Documentation**
   - Keep API endpoints consistent between frontend and backend
   - Document all API changes in both repositories

2. **Version Control**
   - Use semantic versioning for both repositories
   - Tag releases that work together
   - Document breaking changes in API

3. **Development Workflow**
   - Run both servers locally during development
   - Frontend on port 3000 (Next.js default)
   - Backend on port 3001 (configured)
   - Use CORS in backend to allow frontend requests

4. **Error Handling**
   - Use consistent error codes between frontend and backend
   - Implement proper error boundaries in frontend
   - Log errors appropriately in both services

## Data Models

### Frontend Types
```typescript
interface Movie {
  id: number;
  title: string;
  description: string;
  duration: number;
  price: number;
}

interface Booking {
  id: number;
  movieId: number;
  userId: number;
  seats: string[];
  showTime: Date;
}
```

### Backend DTOs
```typescript
class CreateBookingDto {
  @IsNumber()
  movieId: number;

  @IsArray()
  seats: string[];

  @IsDateString()
  showTime: Date;
}
```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use common components for repeated elements
   - Separate business logic from UI components

2. **State Management**
   - Use React hooks for local state
   - Keep state as close as possible to where it's used

3. **Error Handling**
   - Always handle API errors gracefully
   - Show user-friendly error messages
   - Log errors for debugging

4. **Code Comments**
   - Comment complex business logic
   - Use JSDoc for function documentation
   ```javascript
   /**
    * Calculates total price for selected seats
    * @param {string[]} seats - Array of selected seat numbers
    * @param {number} basePrice - Base ticket price
    * @returns {number} Total price
    */
   ```

5. **Testing**
   - Write unit tests for critical functions
   - Test API endpoints
   - Test component rendering
