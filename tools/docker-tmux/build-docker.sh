#!/bin/bash

set -e

echo "building docker image"
docker build -t tmux .