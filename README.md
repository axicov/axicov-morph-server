# Morph Server

This server will contain the server code for the morph layer of axicov. Morph will help to create a new instance, load an instance for the agents.

## Overview

- This will be the primary API layer that will interact with `morphcloud` ts sdk and parse the responses in api
- The CLI of axicov will also interact with this particular layer for creating the agents
- The marketplace backend will also communicate with this layer for getting logs about the agents
