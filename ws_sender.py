import socket
import threading
import numpy as np
import json

from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket

clients = []
class SimpleChat(WebSocket):

    def handleMessage(self):
       for client in clients:
          #if client != self:
          client.sendMessage(self.address[0] + u' - ' + self.data)

    def handleConnected(self):
       print(self.address, 'connected')
       for client in clients:
          client.sendMessage(self.address[0] + u' - connected')
       clients.append(self)

    def handleClose(self):
       clients.remove(self)
       print(self.address, 'closed')
       for client in clients:
          client.sendMessage(self.address[0] + u' - disconnected')

class WSSender(object):
	"""docstring for """
	def __init__(self):
		self.ws_thread = threading.Timer(0, self.set_ws) 
		self.ws_thread.start()
	
	def set_ws(self):
		self.server = SimpleWebSocketServer('', 8000, SimpleChat)
		self.server.serveforever()

	def send(self, data, data2):
		if  type(data) == np.ndarray:
			data = json.dumps([data.tolist(), data2.tolist()])

		for client in clients:
			client.sendMessage(data)
