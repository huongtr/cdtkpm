import abc

class AbstractRepository(abc.ABC):
    @abc.abstractmethod  
    def add(self, session):
        raise NotImplementedError  

    @abc.abstractmethod
    def get_by_id(self, id):
        raise NotImplementedError

    @abc.abstractmethod  
    def list(self, session):
        raise NotImplementedError  

