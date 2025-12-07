# Neural Drive – Self-Driving Car Simulation

A web-based self-driving car simulation built in React.js that trains AI-controlled vehicles using a neural network combined with a genetic algorithm. The system evolves better drivers over generations while visualizing both the road environment and the neural network in real time.

---

## Features

- Neural network–driven self-driving cars
- Genetic algorithm training system
- Real-time simulation of multiple cars
- Best-performing car tracking
- Interactive parameter tuning (mutation rate, speed, population)
- Live neural network visualization
- Save and restore trained models
- Collision detection and sensor-based perception

---

## Tech Stack

- React.js
- JavaScript
- HTML Canvas
- Custom Neural Network implementation
- Genetic Algorithm logic

---

## How It Works

Each car is controlled by a neural network that processes distance sensor data from the environment. A population of cars is trained simultaneously, and at the end of each generation, the best-performing network is selected and mutated to produce the next generation.

The model gradually improves as poor-performing networks are discarded and better ones evolve.

---

## Controls

- **Mutation Rate** – Controls how much the neural network changes between generations.
- **Max Speed** – Limits the speed of simulated cars.
- **Total Cars** – Adjust population size.
- **Save** – Stores the best model locally.
- **Reset** – Clears saved brains and restarts training.

---

## Local Setup

```bash
git clone https://github.com/your-username/neural-drive.git
cd neural-drive
npm install
npm start
