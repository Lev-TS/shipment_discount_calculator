# Task

## Description

The task is based on the Backend Homework Assignment

## Implementation

When processing large files in Node.js, using `stream` is generally a preferred choice. For example, in the context of this task, the following are the key benefits of using `fs.createReadstream` over `fs.readFile`:

- Memory Efficiency: readFile reads the entire content of the file into memory before processing it. This can become a significant issue when dealing with large files, as it can quickly consume a lot of memory and potentially cause the Node.js application to crash with an "out of memory" error. On the other hand, createReadStream reads the file in smaller chunks, called buffers, which are streamed one at a time. This allows us to process the file piece-by-piece, minimizing the memory footprint and making it more memory-efficient.

- Performance: Since readFile reads the entire file at once, it may cause a delay before any processing starts, especially for large files. On the contrary, createReadStream starts processing data as soon as the first buffer is available. This can lead to faster processing times and improved overall performance, especially for files that are too large to fit comfortably in memory.

- Scalability: When dealing with a large number of concurrent users or handling multiple large files simultaneously, using createReadStream enables better scalability. By reading files in smaller chunks, the application can handle multiple requests concurrently without being limited by memory constraints.

- Backpressure Handling: createReadStream has built-in backpressure handling, which means it will automatically pause reading from the file if the processing code is slower than the rate at which data is being read. This helps to prevent memory overflow and ensures that data processing can proceed at an optimal pace.

- File Streaming: The createReadStream method integrates well with other Node.js stream-based modules, allowing us to take advantage of stream processing libraries. We can easily chain multiple stream transformations and manipulations to process the data efficiently.

## Instruction

### Install dependencies

```console
npm install
```

### Run App

Replace the content of the `input.txt` in the root directory and run:

```console
npm run input.txt
```

I have also included a `large_input.txt` which contains 1.6 million random entries. The app is able to process it in under 10 seconds. To test it with the provided large input run:

```console
npm run large_input.txt
```

### Run tests

```console
npm test
```

## Ups...

If it failed, re-install dependencies and re-run the app with the node version indicated in `.nvmrc`

```console
nvm use
```

followed by the steps outlined in the instructions above.

\*\* you might need to install `nvm`
