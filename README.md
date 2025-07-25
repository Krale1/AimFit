
---

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/products/docker-desktop) & Docker Compose

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/aimfit.git
cd aimfit
```

### 2. Start all services

```bash
docker compose up --build
```

- The **frontend** will be available at [http://localhost:3000](http://localhost:3000)
- The **backend API** at [http://localhost:5000](http://localhost:5000)
- The **ML microservice** at [http://localhost:8000](http://localhost:8000)
- The **PostgreSQL database** at `localhost:5432` (user: `postgres`, password: `root`, db: `aimfit`)

### 3. Environment Variables

- Copy `.env.example` to `.env` in each service directory and fill in as needed.

---

## Development

- **Frontend:**  
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
- **Backend:**  
  ```bash
  cd backend
  npm install
  npm run dev
  ```
- **ML Microservice:**  
  ```bash
  cd ml-microservice
  pip install -r requirements.txt
  python main.py
  ```

---

## Scripts

- `docker compose up --build` — Build and start all services
- `docker compose down` — Stop all services

---

## Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](LICENSE)

---

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Prisma](https://www.prisma.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [FastAPI](https://fastapi.tiangolo.com/) or [Flask](https://flask.palletsprojects.com/)

---
