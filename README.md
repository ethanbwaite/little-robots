# little-robots
A socket.io experiment, currently live at www.littlekitti.es
Connect to the site and then use the 4-digit code or QR code to connect with your phone to use as a controller.

Deployed on AWS EC2, routing through AWS Route 53. Game commands are sent using websockets between the client and server to allow many players to connect and play at the same time. This prototype could potentially be used for an instant controller for a local multiplayer game where the only setup is opening a website and scanning a code.
