#!/bin/bash

echo "storage:" > /etc/mongod.conf
echo "  wiredTiger:" >> /etc/mongod.conf
echo "    engineConfig:" >> /etc/mongod.conf
echo "      cacheSizeGB: ${cacheSizeGB}" >> /etc/mongod.conf

exec mongod --config /etc/mongod.conf