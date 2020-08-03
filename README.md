# cc-test
 
## Installation

This project expects TypeScript and ts-node to be installed globally on your system. If these are not installed, do so by running the following:

```bash
npm install -g typescript
npm install -g ts-node
npm install
```

## Running

```bash
npm run dev
```

## Building the client

To serve the client, build the other repository: dawnsheedy/cc-client
Move build result into /public at the root of this project.

## OBS Client

To serve captions to a stream, install obs-websockets and use dawnsheedy/cc-obs-client.