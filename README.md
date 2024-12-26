# 🎄 Advent of Code 2024

This repository contains my solutions for [Advent of Code 2024](https://adventofcode.com/2024), implemented in **TypeScript** and run using **Deno**.

## Getting Started

### Prerequisites

Make sure you have [Deno](https://deno.land/) installed.

```sh
# Verify installation
deno --version
```

### Project Structure

```
.
├── main.ts         # Challenge runner
├── src/
│   ├── 1.ts        # Solution for Day 1
│   ├── 2.ts        # Solution for Day 2
│   ├── ...         # Solutions for other days
│   ├── utils.ts    # Utility functions shared across challenges
│   ├── input/
│   │   ├── 1.txt   # Input for Day 1
│   │   ├── 2.txt   # Input for Day 2
│   │   ├── ...     # Inputs for other days
├── deno.json       # Deno configuration file
└── README.md       # Project documentation
```

## How to Run

You can run a specific day's challenge or all implemented challenges.

```sh
# Run a specific day
deno run --watch --allow-read --allow-import main.ts 5

# Run all implemented days
deno run --watch --allow-read --allow-import main.ts
```

## Testing

```
# Test a specific day
deno test --allow-import src/15.ts

# Test all implemented days
deno test --allow-import
```

## License
This project is licensed under the **MIT License**.
