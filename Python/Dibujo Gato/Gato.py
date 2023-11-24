import turtle as trl
import math as mt

ventana = trl.Screen()
ventana.title("Gatito dibujo")
ventana.bgcolor("black")

#MOUSE
mouse = trl.Turtle()
mouse.shape("arrow")
mouse.color("white")
mouse.speed(5)
mouse.pensize(10)

def moverLapiz(mouse, x, y):
    mouse.penup()
    mouse.setposition(x,y)
    mouse.pendown()

def moverLapizX(mouse, x):
    mouse.penup()
    mouse.setx(x)
    mouse.pendown()

def moverLapizY(mouse, y):
    mouse.penup()
    mouse.sety(y)
    mouse.pendown()

def posicionarCirculo(x, y, radio, angulo):
    radianes = mt.radians(angulo)
    return [x + (radio * mt.sin(radianes)), y + (radio * mt.cos(radianes))]


#DIBUJAR LA CABEZA
moverLapizY(mouse, -150)
mouse.circle(150)

#DIBUJAR LA NARIZ
narizPosicion = -15
moverLapizY(mouse, -20 + narizPosicion)
mouse.circle(20)

#DIBUJAR LA BOCA
moverLapiz(mouse, -100, -20 + narizPosicion)
mouse.right(90)
mouse.circle(50, 180)
mouse.left(180)
mouse.circle(50,180)

#DIBUJAR LOS OJOS
radioOjo = 30
ojoPosicionY = 40
ojoEspacioX = 30

#OJO DERECHO   
moverLapiz(mouse, ojoEspacioX, ojoPosicionY)
mouse.right(180)
mouse.circle(radioOjo, -180)

#OJO IZQUIERDO
moverLapiz(mouse, -ojoEspacioX, ojoPosicionY)
mouse.circle(radioOjo, 180)


#Dibujar LENGUA
moverLapiz(mouse, -20, -60 + narizPosicion)
mouse.circle(20, 180)

#DIBUJAR LAS OREJAS
orejaComienzo = 25
orejaTamaño = 85
orejaAncho = 22
posicionA = posicionarCirculo(0, 0, 150, orejaComienzo)
moverLapiz(mouse, posicionA[0], posicionA[1])

posicionB = posicionarCirculo(0, 0, 150 + orejaTamaño, orejaComienzo + orejaAncho)
mouse.setposition(posicionB[0], posicionB[1])

posicionC = posicionarCirculo(0, 0, 150, orejaComienzo + orejaComienzo * 2)
mouse.setposition(posicionC[0], posicionC[1])

#OREJA IZQUIERDA
posicionA = posicionarCirculo(0, 0, 150, -orejaComienzo)
moverLapiz(mouse, posicionA[0], posicionA[1])

posicionB = posicionarCirculo(0, 0, 150 + orejaTamaño, -orejaComienzo + -orejaAncho)
mouse.setposition(posicionB[0], posicionB[1])

posicionC = posicionarCirculo(0, 0, 150, -orejaComienzo + -orejaComienzo * 2)
mouse.setposition(posicionC[0], posicionC[1])

#BIGOTES
bigotesTamaño = 180

#BIGOTE DERECHO
moverLapiz(mouse, 50, -15)
mouse.setheading(0)
mouse.forward(bigotesTamaño)

moverLapiz(mouse, 50, 0)
mouse.left(5)
mouse.forward(bigotesTamaño)

#BIGOTES IZQUIERDO
moverLapiz(mouse, -50, -15)
mouse.setheading(180)
mouse.forward(bigotesTamaño)

moverLapiz(mouse, -50, 0)
mouse.left(-5)
mouse.forward(bigotesTamaño)

ventana.exitonclick()