class DeviceLocationRepository:
    def __init__(self, redis):
        self.redis = redis 

    def add(self, longitude, latitude, sid):
       coords = (longitude, latitude, sid) 
       self.redis.geoadd('device_locations', coords)

    def list_by_geo_radius(self, center_longitude, center_latitude, radius, unit='km'):
       list = self.redis.georadius("device_locations", center_longitude, center_latitude, radius, unit="km", withdist=True, withcoord=True)
       return list
    
    def get(self, sid):
        location = self.redis.geopos('device_locations', sid)
        return location

    def remove(self, sid):
        self.redis.zrem("device_locations", sid)


class DriverSessionRepository:
    def __init__(self, redis):
        self.redis = redis
    
    def add(self, sid, driver_id):
        self.redis.hset("driver_connections", sid, driver_id)

    def get_driver(self, sid):
        return self.redis.hget("driver_connections", sid)

    def remove(self, sid):
        self.redis.hdel("driver_connections", sid)
  