# cdtkpm

## Demo

https://github.com/huongtr/cdtkpm/assets/29396422/052879d0-2fbb-4796-9734-0c49f221c32a

## Local development
### Mobile app
#### user app
- update file .env
- run app
```
yarn install
yarn ios
# Shift+i to select simulator
```
#### driver app
- update file .env
- run app
```
yarn install
yarn ios
# Shift+i to select simulator
```

### Microservices
#### User service
- Start service at localhost:3000
```
docker-compose up --build
```
#### Driver service
- Start service at localhost:3002
```
docker-compose up --build
```

#### Ride Request service
- Start service at localhost:3001
```
docker-compose up --build
```
